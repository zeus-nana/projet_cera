import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReportingService from "../../services/reportingService";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useParams, useSearchParams } from "react-router-dom";
import ChargementDetailRow from "./ChargementDetailRow";
import ExportButton from "../../ui/ExportButton.jsx";
import Pagination from "../../ui/Pagination.jsx";
import { PAGE_SIZE } from "../../constants.js";

function ChargementDetailTable() {
  const { chargement_id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [filters, setFilters] = useState({});

  const {
    isLoading,
    data: response,
    error,
  } = useQuery({
    queryKey: ["chargementErrors", chargement_id],
    queryFn: () => ReportingService.getErrorChargementByID(chargement_id),
  });

  const allErrors = useMemo(() => {
    console.log("response", response?.data?.data?.chargeError);
    if (
      response?.data?.status === "success" &&
      response?.data?.data?.chargeError
    ) {
      return response.data.data.chargeError;
    }
    return [];
  }, [response]);

  const filteredDetails = useMemo(() => {
    return allErrors.filter((error) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return error[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }),
    );
  }, [allErrors, filters]);

  const paginatedDetails = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredDetails.slice(startIndex, endIndex);
  }, [filteredDetails, currentPage]);

  const totalCount = filteredDetails.length;
  const pageCount = Math.ceil(totalCount / PAGE_SIZE);

  const handleFilterChange = (columnName, value) => {
    setFilters((prev) => ({
      ...prev,
      [columnName]: value,
    }));
    setSearchParams({ page: "1" });
  };

  if (error) return <div>Erreur: {error.message}</div>;
  if (isLoading) return <Spinner />;

  const columns = [
    { name: "ligne", width: "10px" },
    { name: "contenu", width: "600px" },
    { name: "message_erreur", width: "300px" },
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
    <Menus>
      <Table
        columns={columns}
        data={paginatedDetails}
        onFilterChange={handleFilterChange}
        footer={footer}
      >
        <Table.Header>
          <div name="ligne">Ligne</div>
          <div name="contenu">Contenu</div>
          <div name="message_erreur">Message d&apos;erreur</div>
        </Table.Header>
        <Table.Body
          render={(detail) => (
            <ChargementDetailRow key={detail.id} detail={detail} />
          )}
        />
      </Table>
      <div>
        {filteredDetails.length > 0 && (
          <ExportButton
            data={filteredDetails}
            columns={columns}
            filename="erreurs_chargement"
          />
        )}
      </div>
    </Menus>
  );
}

export default ChargementDetailTable;
