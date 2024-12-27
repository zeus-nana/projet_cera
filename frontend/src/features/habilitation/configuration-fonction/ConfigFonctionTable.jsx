import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetConfigFonction } from './useGetConfigFonction.js';
import { PAGE_SIZE } from '../../../constants';
import Spinner from '../../../ui/Spinner';
import Pagination from '../../../ui/Pagination';
import Menus from '../../../ui/Menus';
import Table from '../../../ui/Table';
import ConfigFonctionRow from './ConfigFonctionRow.jsx';

function ConfigFonctionTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [filters, setFilters] = useState({});

  const { isLoading, data, error } = useGetConfigFonction();

  const configFonctions = data?.data?.data?.fonctionMenuPermissions;

  const filteredConfigFonctions = useMemo(() => {
    return (
      configFonctions?.filter((permission) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return permission[key]?.toString().toLowerCase().includes(value.toLowerCase());
        })
      ) || []
    );
  }, [configFonctions, filters]);

  const paginatedConfigFonctions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredConfigFonctions.slice(startIndex, endIndex);
  }, [filteredConfigFonctions, currentPage]);

  const totalCount = filteredConfigFonctions.length;
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
    { name: 'fonction', width: '200px' },
    { name: 'menu', width: '200px' },
    { name: 'permission', width: '200px' },
    { name: 'create_by', width: '200px' },
    { name: 'created_at', width: '200px' },
    // { name: 'actions', width: '100px', filterable: false },
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
      <Table columns={columns} data={paginatedConfigFonctions} onFilterChange={handleFilterChange} footer={footer}>
        <Table.Header>
          {columns.map((column) => (
            <div key={column.name} name={column.name}>
              {column.name === 'actions'
                ? ''
                : column.name.charAt(0).toUpperCase() + column.name.slice(1).replace('_', ' ')}
            </div>
          ))}
        </Table.Header>
        <Table.Body render={(config) => <ConfigFonctionRow key={config.id} config={config} />} />
      </Table>
    </Menus>
  );
}

export default ConfigFonctionTable;
