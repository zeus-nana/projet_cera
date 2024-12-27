import { useMemo, useState } from "react";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../constants.js";
import PropTypes from "prop-types";
import TransactionRow from "./TransactionGlobalRow.jsx";
import Pagination from "../../ui/Pagination.jsx";
import ExportButton from "../../ui/ExportButton.jsx";

function TransactionGlobalTable({ data, isLoading, error }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [filters, setFilters] = useState({});

  const allTransactions = useMemo(() => {
    if (data && data.data.data && Array.isArray(data.data.data.transactions)) {
      return data.data.data.transactions;
    }
    return [];
  }, [data]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return transaction[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }),
    );
  }, [allTransactions, filters]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  const totalCount = filteredTransactions.length;
  const pageCount = Math.ceil(totalCount / PAGE_SIZE);

  const handleFilterChange = (columnName, value) => {
    setFilters((prev) => ({
      ...prev,
      [columnName]: value,
    }));
    setSearchParams({ page: "1" });
  };

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <Spinner />;

  const columns = [
    { name: "date_operation", width: "150px" },
    { name: "etat", width: "150px" },
    { name: "service", width: "250px" },
    { name: "reference", width: "150px" },
    { name: "sens", width: "100px" },
    { name: "montant", width: "150px" },
    { name: "frais_ht", width: "150px" },
    { name: "tta", width: "150px" },
    { name: "tva", width: "150px" },
    { name: "frais_ttc", width: "150px" },
    { name: "commission", width: "150px" },
    { name: "statut_operation", width: "200px" },
    { name: "expediteur", width: "300px" },
    { name: "beneficiaire", width: "300px" },
    { name: "guichet", width: "150px" },
    { name: "agence", width: "230px" },
    { name: "partenaire", width: "150px" },
    { name: "categorie", width: "200px" },
    { name: "sous_categorie", width: "180px" },
    { name: "responsable", width: "150px" },
    { name: "application", width: "150px" },
    { name: "v_hv", width: "100px" },
    { name: "region", width: "150px" },
    { name: "departement", width: "150px" },
    { name: "commune", width: "150px" },
    { name: "code_agence", width: "150px" },
    { name: "pole", width: "150px" },
  ];

  const footer = (
    <Pagination
      count={totalCount}
      pageSize={PAGE_SIZE}
      currentPage={currentPage}
      pageCount={pageCount}
      onPageChange={(page) => setSearchParams({ page: page.toString() })}
    />
  );

  return (
    <>
      <Table
        columns={columns}
        data={paginatedTransactions}
        onFilterChange={handleFilterChange}
        footer={footer}
      >
        <Table.Header>
          {columns.map((column) => (
            <div key={column.name} name={column.name}>
              {column.name}
            </div>
          ))}
        </Table.Header>
        <Table.Body
          render={(transaction) => (
            <TransactionRow
              key={`${transaction.id}`}
              transaction={transaction}
            />
          )}
        />
      </Table>
      <div>
        {filteredTransactions.length > 0 && (
          <ExportButton
            data={filteredTransactions}
            columns={columns}
            filename="transactions_globales"
          />
        )}
      </div>
    </>
  );
}

TransactionGlobalTable.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
};

export default TransactionGlobalTable;
