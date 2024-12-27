import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { PAGE_SIZE } from '../../constants.js';
import UsersRow from './UsersRow';
import Pagination from '../../ui/Pagination.jsx';
import { useGetUsers } from './useGetUsers.js';

function UsersTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [filters, setFilters] = useState({});

  const { users: allUsers, isLoading, error } = useGetUsers();

  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];

    return allUsers.filter((user) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return user[key]?.toString().toLowerCase().includes(value.toLowerCase());
      })
    );
  }, [allUsers, filters]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  const totalCount = filteredUsers.length;
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
    { name: 'avatar', width: '60px', filterable: false },
    { name: 'login', width: '120px' },
    { name: 'username', width: '200px' },
    { name: 'email', width: '250px' },
    { name: 'phone', width: '120px' },
    { name: 'profile', width: '150px' },
    { name: 'department', width: '150px' },
    { name: 'localisation', width: '150px' },
    { name: 'active', width: '100px' },
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
      <Table columns={columns} data={paginatedUsers} onFilterChange={handleFilterChange} footer={footer}>
        <Table.Header>
          {columns.map((column) => (
            <div key={column.name} name={column.name}>
              {column.name === 'avatar' || column.name === 'actions'
                ? ''
                : column.name === 'active'
                  ? 'Statut'
                  : column.name.charAt(0).toUpperCase() + column.name.slice(1)}
            </div>
          ))}
        </Table.Header>
        <Table.Body render={(user) => <UsersRow key={user.id} user={user} />} />
      </Table>
    </Menus>
  );
}

export default UsersTable;
