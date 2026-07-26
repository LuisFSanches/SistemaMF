import { ReactNode, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import {
    Frame,
    Toolbar,
    SearchBox,
    ScrollArea,
    Table,
    Footer,
    EmptyState,
    SkeletonBar,
} from './style';

export interface ColumnDef<T> {
    key: string;
    header: string;
    headerRender?: () => ReactNode;
    align?: 'left' | 'right';
    width?: string;
    sortable?: boolean;
    sortValue?: (row: T) => string | number;
    render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    rowKey: (row: T) => string;
    loading?: boolean;
    skeletonRows?: number;
    emptyTitle?: string;
    emptyDescription?: string;
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    toolbarExtra?: ReactNode;
    toolbarActions?: ReactNode;
    footer?: ReactNode;
    responsiveCards?: boolean;
    getRowLabel?: (row: T) => string | undefined;
    rowClassName?: (row: T) => string | undefined;
}

export function DataTable<T>({
    columns,
    data,
    rowKey,
    loading = false,
    skeletonRows = 5,
    emptyTitle = 'Nenhum registro encontrado',
    emptyDescription = 'Tente ajustar a busca ou os filtros.',
    searchPlaceholder,
    searchValue,
    onSearchChange,
    toolbarExtra,
    toolbarActions,
    footer,
    responsiveCards = true,
    getRowLabel,
    rowClassName,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const sortedData = useMemo(() => {
        if (!sortKey) return data;
        const column = columns.find((c) => c.key === sortKey);
        if (!column?.sortValue) return data;

        const sorted = [...data].sort((a, b) => {
            const va = column.sortValue!(a);
            const vb = column.sortValue!(b);
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [data, sortKey, sortDir, columns]);

    const handleSort = (column: ColumnDef<T>) => {
        if (!column.sortable) return;
        if (sortKey === column.key) {
            setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(column.key);
            setSortDir('asc');
        }
    };

    const showToolbar = onSearchChange || toolbarExtra || toolbarActions;
    const hasRows = sortedData.length > 0;

    return (
        <Frame>
            {showToolbar && (
                <Toolbar>
                    {onSearchChange && (
                        <SearchBox>
                            <FontAwesomeIcon icon={faSearch} />
                            <input
                                type="text"
                                placeholder={searchPlaceholder || 'Buscar'}
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </SearchBox>
                    )}
                    {toolbarExtra}
                    <div className="dt-spacer" />
                    {toolbarActions}
                </Toolbar>
            )}

            <ScrollArea>
                <Table className={responsiveCards ? 'dt-responsive-cards' : ''}>
                    <thead>
                        <tr>
                            {columns.map((col) => {
                                const isActive = sortKey === col.key;
                                return (
                                    <th
                                        key={col.key}
                                        className={[
                                            col.align === 'right' ? 'dt-align-right' : '',
                                            col.sortable ? 'dt-sortable' : '',
                                            isActive ? 'dt-sort-active' : '',
                                        ].join(' ').trim()}
                                        style={col.width ? { width: col.width } : undefined}
                                        onClick={() => handleSort(col)}
                                    >
                                        {col.headerRender ? col.headerRender() : col.header}
                                        {col.sortable && (
                                            <FontAwesomeIcon
                                                className="dt-sort-icon"
                                                icon={isActive ? (sortDir === 'asc' ? faSortUp : faSortDown) : faSort}
                                            />
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {loading &&
                            Array.from({ length: skeletonRows }).map((_, i) => (
                                <tr key={`skeleton-${i}`}>
                                    {columns.map((col) => (
                                        <td key={col.key} data-label={col.header} style={col.width ? { width: col.width } : undefined}>
                                            <SkeletonBar style={{ width: `${45 + ((i * 13 + col.key.length * 7) % 40)}%` }} />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {!loading &&
                            hasRows &&
                            sortedData.map((row) => (
                                <tr key={rowKey(row)} className={rowClassName?.(row)}>
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={col.align === 'right' ? 'dt-align-right' : ''}
                                            style={col.width ? { width: col.width } : undefined}
                                            data-label={col.header}
                                        >
                                            {col.render(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </Table>

                {!loading && !hasRows && (
                    <EmptyState>
                        <div className="dt-empty-glyph">
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                        <h4>{emptyTitle}</h4>
                        <p>{emptyDescription}</p>
                    </EmptyState>
                )}
            </ScrollArea>

            {footer && <Footer>{footer}</Footer>}
        </Frame>
    );
}
