import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminService from "../../services/adminService";
import Spinner from "../../ui/Spinner";
import UploadRow from "./UploadRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Pagination from "../../ui/Pagination.jsx";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../constants.js";

function UploadTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [filters, setFilters] = useState({});

  const {
    isLoading,
    data: response,
    error,
  } = useQuery({
    queryKey: ["uploads"],
    queryFn: AdminService.getAllUploads,
  });

  const allUploads = response?.data?.data?.uploads ?? [];

  const filteredUploads = useMemo(() => {
    return allUploads.filter((upload) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === "statut") {
          return upload[key] === value;
        }
        return upload[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }),
    );
  }, [allUploads, filters]);

  const paginatedUploads = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredUploads.slice(startIndex, endIndex);
  }, [filteredUploads, currentPage]);

  const totalCount = filteredUploads.length;
  const pageCount = Math.ceil(totalCount / PAGE_SIZE);

  const filterableColumns = [
    "id",
    "dateUpload",
    "etat",
    "nombreTraite",
    "nombreEchec",
    "creePar",
    "statut",
  ];

  const handleFilterChange = (columnName, value) => {
    setFilters((prev) => ({
      ...prev,
      [columnName]: value,
    }));
    setSearchParams({ page: "1" });
  };

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <Spinner />;

  return (
    <Menus>
      <Table
        columns="0.5fr 1fr 1fr 1fr 1fr 1fr 1fr"
        data={paginatedUploads}
        filterableColumns={filterableColumns}
        onFilterChange={handleFilterChange}
      >
        <Table.Header>
          <div name="id">ID</div>
          <div name="dateUpload">Date Upload</div>
          <div name="etat">État</div>
          <div name="nombreTraite">Nombre Traité</div>
          <div name="nombreEchec">Nombre Échec</div>
          <div name="creePar">Créé Par</div>
          <div name="statut">Statut</div>
        </Table.Header>

        <Table.Body
          render={(upload) => <UploadRow key={upload.id} upload={upload} />}
        />

        <Table.Footer>
          <Pagination
            count={totalCount}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={(page) => setSearchParams({ page: page.toString() })}
          />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default UploadTable;
