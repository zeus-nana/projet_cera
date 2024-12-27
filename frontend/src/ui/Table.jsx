import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TableContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    @media (max-width: 1366px) {
        font-size: 0.9em;
    }
`;

const StyledTable = styled.div`
    border-top: 1px solid var(--color-grey-200);
    border-right: 1px solid var(--color-grey-200);
    border-left: 1px solid var(--color-grey-200);
    font-size: 1.4rem;
    background-color: var(--color-grey-0);
    border-radius: 7px 7px 0 0;
    overflow: hidden;
    flex-grow: 1;

    @media (max-width: 1366px) {
        font-size: 1.26rem;
    }
`;

const TableWrapper = styled.div`
    overflow-x: auto;
    max-height: 100%;
`;

const TableContent = styled.div`
    min-width: 100%;
    width: max-content;
`;

const StyledHeader = styled.div`
    background-color: var(--color-grey-50);
    border-bottom: 1px solid var(--color-grey-200);
    position: sticky;
    top: 0;
    z-index: 1;
`;

const HeaderRow = styled.div`
    display: flex;
`;

const HeaderCell = styled.div`
    padding: 0.8rem 1.2rem 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-weight: 600;
    color: var(--color-grey-600);
    width: ${(props) => props.$width || '200px'};
    flex-shrink: 0;
    flex-grow: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid var(--color-grey-200);
    justify-content: center;

    &:last-child {
        border-right: none;
    }

    @media (max-width: 1366px) {
        padding: 0.72rem 1.08rem 0.36rem;
    }
`;

const FilterInput = styled.input`
    width: calc(100% - 0.5rem);
    padding: 0.4rem;
    margin: 0.2rem 0.25rem 0.4rem;
    border: 1px solid var(--color-grey-200);
    border-radius: 8px;
    font-size: 1.2rem;

    @media (max-width: 1366px) {
        font-size: 1.08rem;
        padding: 0.36rem;
        margin: 0.18rem 0.225rem 0.36rem;
    }
`;

const StyledRow = styled.div`
    display: flex;
    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }
`;

const StyledCell = styled.div`
    padding: 0.4rem 1.2rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    width: ${(props) => props.$width || '200px'};
    flex-shrink: 0;
    flex-grow: 1;
    text-align: ${(props) => props.$alignment || 'left'};
    border-right: 1px solid var(--color-grey-100);

    &:last-child {
        border-right: none;
    }

    @media (max-width: 1366px) {
        padding: 0.36rem 1.08rem;
    }
`;

const StyledBody = styled.div`
    margin: 0.4rem 0;

    @media (max-width: 1366px) {
        margin: 0.36rem 0;
    }
`;

const StyledFooter = styled.div`
    background-color: var(--color-grey-50);
    padding: 1.2rem;
    border: 1px solid var(--color-grey-200);
    border-radius: 0 0 7px 7px;

    @media (max-width: 1366px) {
        padding: 1.08rem;
    }
`;

const SelectableRow = styled(StyledRow)`
    cursor: ${(props) => (props.$selectable ? 'pointer' : 'default')};
    background-color: ${(props) => (props.$selected ? 'var(--color-brand-200)' : 'transparent')};
`;

const Empty = styled.p`
    font-size: 1.6rem;
    font-weight: 500;
    text-align: start;
    margin: 2.4rem;

    @media (max-width: 1366px) {
        font-size: 1.44rem;
        margin: 2.16rem;
    }
`;

const TableContext = createContext();

function Table({
    columns,
    data,
    children,
    onFilterChange,
    footer,
    selectionType = 'none', // 'single', 'multi' or 'none'
    onRowSelect,
}) {
    const [filters, setFilters] = useState({});
    const [selectedRows, setSelectedRows] = useState(new Set());

    const handleRowSelect = useCallback(
        (id) => {
            if (selectionType === 'none') return;

            setSelectedRows((prev) => {
                const newSet = new Set(prev);
                if (selectionType === 'multi') {
                    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
                } else {
                    // single select
                    newSet.clear();
                    if (!prev.has(id)) {
                        newSet.add(id);
                    }
                }
                if (onRowSelect) {
                    onRowSelect(Array.from(newSet));
                }
                return newSet;
            });
        },
        [selectionType, onRowSelect]
    );

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
        if (onFilterChange) {
            onFilterChange(name, value);
        }
    };

    const filteredData = useMemo(() => {
        return data.filter((item) =>
            Object.entries(filters).every(([key, value]) => {
                if (value === '') return true;
                const itemValue = item[key]?.toString().toLowerCase() ?? '';
                return itemValue.includes(value.toLowerCase());
            })
        );
    }, [data, filters]);

    const contextValue = {
        columns,
        filteredData,
        handleFilterChange,
        filters,
        selectionType,
        selectedRows,
        handleRowSelect,
    };

    return (
        <TableContext.Provider value={contextValue}>
            <TableContainer>
                <StyledTable role="table">
                    <TableWrapper>
                        <TableContent>{children}</TableContent>
                    </TableWrapper>
                </StyledTable>
                {footer && <StyledFooter>{footer}</StyledFooter>}
            </TableContainer>
        </TableContext.Provider>
    );
}

Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            width: PropTypes.string,
        })
    ).isRequired,
    onFilterChange: PropTypes.func,
    data: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    footer: PropTypes.node,
    selectionType: PropTypes.oneOf(['none', 'single', 'multi']),
    onRowSelect: PropTypes.func,
};

function Header({ children }) {
    const { columns, handleFilterChange, filters } = useContext(TableContext);
    return (
        <StyledHeader role="row" as="header">
            <HeaderRow>
                {columns.map((column) => (
                    <HeaderCell key={column.name} $width={column.width}>
                        {React.Children.toArray(children).find((child) => child.props.name === column.name)}
                        {column.filterable !== false && ( // Vérifiez si la colonne est filtrable
                            <FilterInput
                                type="text"
                                name={column.name}
                                value={filters[column.name] || ''}
                                onChange={(e) => handleFilterChange(column.name, e.target.value)}
                            />
                        )}
                    </HeaderCell>
                ))}
            </HeaderRow>
        </StyledHeader>
    );
}

Header.propTypes = {
    children: PropTypes.node.isRequired,
};

function Row({ children, id }) {
    const { columns, selectionType, selectedRows, handleRowSelect } = useContext(TableContext);

    return (
        <SelectableRow
            role="row"
            $selectable={selectionType !== 'none'}
            $selected={selectedRows.has(id)}
            onClick={() => handleRowSelect(id)}
        >
            {columns.map((column) => {
                const child = React.Children.toArray(children).find((child) => child.props.name === column.name);
                return (
                    <StyledCell key={column.name} $width={column.width} $alignment={child.props.alignment || 'left'}>
                        {child}
                    </StyledCell>
                );
            })}
        </SelectableRow>
    );
}

Row.propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function Body({ render }) {
    const { filteredData } = useContext(TableContext);
    if (!filteredData.length) return <Empty>Aucun élément à afficher</Empty>;
    return <StyledBody>{filteredData.map(render)}</StyledBody>;
}

Body.propTypes = {
    render: PropTypes.func.isRequired,
};

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;

export default Table;
