import { useMemo, useState } from "react";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../constants.js";
import PropTypes from "prop-types";
import TransactionRow from "./TransactionAgregeRow.jsx";
import Pagination from "../../ui/Pagination.jsx";
import ExportButton from "../../ui/ExportButton.jsx";

function TransactionAgregeTable({ data, isLoading, error }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [filters, setFilters] = useState({});

  const allTransactions = useMemo(() => {
    if (
      data &&
      data.data.data &&
      Array.isArray(data.data.data.aggregatedTransactions)
    ) {
      return data.data.data.aggregatedTransactions;
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
    { name: "categorie", width: "200px" },
    { name: "sous_categorie", width: "180px" },
    { name: "partenaire", width: "150px" },
    { name: "service", width: "250px" },
    { name: "date_operation", width: "150px" },
    { name: "montant", width: "150px" },
    { name: "frais_ttc", width: "150px" },
    { name: "frais_ht", width: "150px" },
    { name: "tva", width: "150px" },
    { name: "commission", width: "150px" },
    { name: "nombre_operation", width: "200px" },
    { name: "code_agence", width: "150px" },
    { name: "agence", width: "300px" },
    { name: "v_hv", width: "120px" },
    { name: "region", width: "150px" },
    { name: "departement", width: "200px" },
    { name: "commune", width: "200px" },
    { name: "statut_operation", width: "175px" },
    { name: "responsable", width: "150px" },
    { name: "application", width: "300px" },
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

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <Spinner />;

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
              key={`${transaction.ligne}`}
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

TransactionAgregeTable.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
};

export default TransactionAgregeTable;
