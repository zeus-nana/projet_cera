import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetUserFonctions } from './useGetUserFonctions';
import { PAGE_SIZE } from '../../../constants';
import Spinner from '../../../ui/Spinner';
import Pagination from '../../../ui/Pagination';
import Menus from '../../../ui/Menus';
import Table from '../../../ui/Table';
import AttributionFonctionRow from './AttributionFonctionRow';

function AttributionFonctionTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [filters, setFilters] = useState({});

  const { isLoading, userFonctions, error } = useGetUserFonctions();

  const filteredAttributions = useMemo(() => {
    return (
      userFonctions?.filter((attribution) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return attribution[key]?.toString().toLowerCase().includes(value.toLowerCase());
        })
      ) || []
    );
  }, [userFonctions, filters]);

  const paginatedAttributions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredAttributions.slice(startIndex, endIndex);
  }, [filteredAttributions, currentPage]);

  const totalCount = filteredAttributions.length;
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
    { name: 'login', width: '150px' },
    { name: 'fonction', width: '200px' },
    { name: 'statut', width: '150px' },
    { name: 'create_by', width: '200px' },
    { name: 'created_at', width: '200px' },
    { name: 'updated_by', width: '200px' },
    { name: 'updated_at', width: '200px' },
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
      <Table columns={columns} data={paginatedAttributions} onFilterChange={handleFilterChange} footer={footer}>
        <Table.Header>
          {columns.map((column) => (
            <div key={column.name} name={column.name}>
              {column.name === 'actions'
                ? ''
                : column.name.charAt(0).toUpperCase() + column.name.slice(1).replace('_', ' ')}
            </div>
          ))}
        </Table.Header>
        <Table.Body render={(item) => <AttributionFonctionRow key={item.id} attribution={item} />} />
      </Table>
    </Menus>
  );
}

export default AttributionFonctionTable;
