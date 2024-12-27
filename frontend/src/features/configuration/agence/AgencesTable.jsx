import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetAllAgences } from './useAgence.js';
import AgenceRow from './AgenceRow.jsx';
import { PAGE_SIZE } from '../../../constants.js';
import Spinner from '../../../ui/Spinner.jsx';
import Pagination from '../../../ui/Pagination.jsx';
import Menus from '../../../ui/Menus.jsx';
import Table from '../../../ui/Table.jsx';

function AgencesTable() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const [filters, setFilters] = useState({});

    const { agences, isLoading, error } = useGetAllAgences();

    const filteredAgences = useMemo(() => {
        return (
            agences?.filter((agence) =>
                Object.entries(filters).every(([key, value]) => {
                    if (!value) return true;
                    return agence[key]?.toString().toLowerCase().includes(value.toLowerCase());
                })
            ) || []
        );
    }, [agences, filters]);

    const paginatedAgences = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return filteredAgences.slice(startIndex, endIndex);
    }, [filteredAgences, currentPage]);

    const totalCount = filteredAgences.length;
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
        { name: 'code_agence', width: '150px' },
        { name: 'agence', width: '200px' },
        { name: 'gesuni', width: '100px' },
        { name: 'reseau', width: '150px' },
        { name: 'pole', width: '200px' },
        { name: 'type_agence', width: '150px' },
        { name: 'v/hv', width: '80px' },
        { name: 'telephone', width: '150px' },
        { name: 'commune', width: '150px' },
        { name: 'arrondissement', width: '150px' },
        { name: 'departement', width: '150px' },
        { name: 'region', width: '150px' },
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
            <Table columns={columns} data={paginatedAgences} onFilterChange={handleFilterChange} footer={footer}>
                <Table.Header>
                    {columns.map((column) => (
                        <div key={column.name} name={column.name}>
                            {column.name === 'actions'
                                ? ''
                                : column.name
                                      .split('_')
                                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                      .join(' ')}
                        </div>
                    ))}
                </Table.Header>
                <Table.Body render={(agence) => <AgenceRow key={agence.id} agence={agence} />} />
            </Table>
        </Menus>
    );
}

export default AgencesTable;
