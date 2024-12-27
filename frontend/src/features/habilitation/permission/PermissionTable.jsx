import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetPermissions } from './useGetPermissions';
import { PAGE_SIZE } from '../../../constants';
import Spinner from '../../../ui/Spinner';
import Pagination from '../../../ui/Pagination';
import Menus from '../../../ui/Menus';
import Table from '../../../ui/Table';
import PermissionRow from './PermissionRow';

function PermissionTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [filters, setFilters] = useState({});

  const { isLoading, data, error } = useGetPermissions();

  const permissions = data?.data?.data?.permissions;

  const filteredPermissions = useMemo(() => {
    return (
      permissions?.filter((permission) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return permission[key]?.toString().toLowerCase().includes(value.toLowerCase());
        })
      ) || []
    );
  }, [permissions, filters]);

  const paginatedPermissions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredPermissions.slice(startIndex, endIndex);
  }, [filteredPermissions, currentPage]);

  const totalCount = filteredPermissions.length;
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
    { name: 'nom', width: '300px' },
    { name: 'description', width: '300px' },
    { name: 'menu', width: '200px' },
    { name: 'create_by', width: '150px' },
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
      <Table columns={columns} data={paginatedPermissions} onFilterChange={handleFilterChange} footer={footer}>
        <Table.Header>
          {columns.map((column) => (
            <div key={column.name} name={column.name}>
              {column.name === 'actions'
                ? ''
                : column.name.charAt(0).toUpperCase() + column.name.slice(1).replace('_', ' ')}
            </div>
          ))}
        </Table.Header>
        <Table.Body render={(permission) => <PermissionRow key={permission.id} permission={permission} />} />
      </Table>
    </Menus>
  );
}

export default PermissionTable;
