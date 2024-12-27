import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetMenus } from './useGetMenus.js';
import { PAGE_SIZE } from '../../../constants.js';
import Spinner from '../../../ui/Spinner.jsx';
import Pagination from '../../../ui/Pagination.jsx';
import Menus from '../../../ui/Menus.jsx';
import Table from '../../../ui/Table.jsx';
import MenuRow from './MenuRow.jsx';

function MenuTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [filters, setFilters] = useState({});

  const { isLoading, data, error } = useGetMenus();

  const menus = data?.data?.data?.menus;

  const filteredMenus = useMemo(() => {
    return (
      menus?.filter((menu) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return menu[key]?.toString().toLowerCase().includes(value.toLowerCase());
        })
      ) || []
    );
  }, [menus, filters]);

  const paginatedMenus = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredMenus.slice(startIndex, endIndex);
  }, [filteredMenus, currentPage]);

  const totalCount = filteredMenus.length;
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
      <Table columns={columns} data={paginatedMenus} onFilterChange={handleFilterChange} footer={footer}>
        <Table.Header>
          {columns.map((column) => (
            <div key={column.name} name={column.name}>
              {column.name === 'actions' ? '' : column.name.charAt(0).toUpperCase() + column.name.slice(1)}
            </div>
          ))}
        </Table.Header>
        <Table.Body render={(menu) => <MenuRow key={menu.id} menu={menu} />} />
      </Table>
    </Menus>
  );
}

export default MenuTable;
