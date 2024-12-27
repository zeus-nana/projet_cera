import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetAllListes } from './useListeToUse.js';
import ListeToUseRow from './ListeToUseRow.jsx';
import { PAGE_SIZE } from '../../../constants.js';
import Spinner from '../../../ui/Spinner.jsx';
import Pagination from '../../../ui/Pagination.jsx';
import Menus from '../../../ui/Menus.jsx';
import Table from '../../../ui/Table.jsx';

function ListeToUseTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [filters, setFilters] = useState({});

  const { listes, isLoading, error } = useGetAllListes();

  const filteredListes = useMemo(() => {
    return (
      listes?.filter((liste) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return liste[key]?.toString().toLowerCase().includes(value.toLowerCase());
        })
      ) || []
    );
  }, [listes, filters]);

  const paginatedListes = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredListes.slice(startIndex, endIndex);
  }, [filteredListes, currentPage]);

  const totalCount = filteredListes.length;
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
    { name: 'code', width: '100px' },
    { name: 'libelle', width: '200px' },
    { name: 'usage', width: '150px' },
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
      <Table columns={columns} data={paginatedListes} onFilterChange={handleFilterChange} footer={footer}>
        <Table.Header>
          {columns.map((column) => (
            <div key={column.name} name={column.name}>
              {column.name === 'actions' ? '' : column.name.charAt(0).toUpperCase() + column.name.slice(1)}
            </div>
          ))}
        </Table.Header>
        <Table.Body render={(liste) => <ListeToUseRow key={liste.id} liste={liste} />} />
      </Table>
    </Menus>
  );
}

export default ListeToUseTable;
