import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetFonctions } from './useGetFonctions.js';
import { PAGE_SIZE } from '../../../constants.js';
import Spinner from '../../../ui/Spinner.jsx';
import Pagination from '../../../ui/Pagination.jsx';
import Menus from '../../../ui/Menus.jsx';
import Table from '../../../ui/Table.jsx';
import FonctionRow from './FonctionRow.jsx';

function FonctionsTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [filters, setFilters] = useState({});

  const { isLoading, data, error } = useGetFonctions();

  const fonctions = data?.data?.data?.fonctions;

  const filteredFonctions = useMemo(() => {
    return (
      fonctions?.filter((fonction) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return fonction[key]?.toString().toLowerCase().includes(value.toLowerCase());
        })
      ) || []
    );
  }, [fonctions, filters]);

  const paginatedFonctions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredFonctions.slice(startIndex, endIndex);
  }, [filteredFonctions, currentPage]);

  const totalCount = filteredFonctions.length;
  const pageCount = Math.ceil(totalCount / PAGE_SIZE);

  const handleFilterChange = (columnName, value) => {
    setFilters((prev) => ({
      ...prev,
      [columnName]: value,
    }));
    setSearchParams({ page: '1' });
  };

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <Spinner />;

  const columns = [
    { name: 'nom', width: '200px' },
    { name: 'description', width: '300px' },
    { name: 'create_by', width: '200px' },
    { name: 'actions', width: '100px', filterable: false },
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
      <Table columns={columns} data={paginatedFonctions} onFilterChange={handleFilterChange} footer={footer}>
        <Table.Header>
          {columns.map((column) => (
            <div key={column.name} name={column.name}>
              {column.name === 'actions' ? '' : column.name.charAt(0).toUpperCase() + column.name.slice(1)}
            </div>
          ))}
        </Table.Header>
        <Table.Body render={(fonction) => <FonctionRow key={fonction.id} fonction={fonction} />} />
      </Table>
    </Menus>
  );
}

export default FonctionsTable;
