import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetCleListes } from './useCleListe.js';
import CleListeRow from './CleListeRow.jsx';
import { PAGE_SIZE } from '../../../constants.js';
import Spinner from '../../../ui/Spinner.jsx';
import Pagination from '../../../ui/Pagination.jsx';
import Menus from '../../../ui/Menus.jsx';
import Table from '../../../ui/Table.jsx';

function CleListeTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [filters, setFilters] = useState({});

  const { cleListes, isLoading, error } = useGetCleListes();

  const filteredCleListes = useMemo(() => {
    return (
      cleListes?.filter((cleListe) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return cleListe[key]?.toString().toLowerCase().includes(value.toLowerCase());
        })
      ) || []
    );
  }, [cleListes, filters]);

  const paginatedCleListes = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredCleListes.slice(startIndex, endIndex);
  }, [filteredCleListes, currentPage]);

  const totalCount = filteredCleListes.length;
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
    { name: 'libelle', width: '200px' },
    { name: 'created_by', width: '100px' },
    { name: 'updated_by', width: '100px' },
    { name: 'created_at', width: '100px' },
    { name: 'updated_at', width: '100px' },
    { name: 'actions', width: '50px', filterable: false },
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
      <Table columns={columns} data={paginatedCleListes} onFilterChange={handleFilterChange} footer={footer}>
        <Table.Header>
          {columns.map((column) => (
            <div key={column.name} name={column.name}>
              {column.name === 'actions' ? '' : column.name.charAt(0).toUpperCase() + column.name.slice(1)}
            </div>
          ))}
        </Table.Header>
        <Table.Body render={(cleListe) => <CleListeRow key={cleListe.id} cleListe={cleListe} />} />
      </Table>
    </Menus>
  );
}

export default CleListeTable;
