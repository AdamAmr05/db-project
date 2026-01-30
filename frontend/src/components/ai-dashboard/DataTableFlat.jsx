import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';

const DataTableFlat = ({ element }) => {
    if (!element?.props) {
        return (
            <div className="text-xs text-muted font-mono">Invalid element data.</div>
        );
    }

    const { title, description, columns, data = [] } = element.props;

    if (!columns || !Array.isArray(columns) || columns.length === 0) {
        return (
            <div className="text-xs text-muted font-mono">No columns defined.</div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-primary">{title || 'Data Table'}</h4>
                {description && <p className="text-xs text-muted">{description}</p>}
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[var(--surface-highlight)]">
                            {columns.map((col) => {
                                const label = col.label ?? col.header ?? col.key;
                                return (
                                    <TableHead
                                        key={col.key}
                                        className={`text-xs font-mono text-muted ${col.align === 'right' ? 'text-right' :
                                            col.align === 'center' ? 'text-center' : 'text-left'
                                            }`}
                                    >
                                        {label}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center text-muted text-xs py-4">
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, idx) => (
                                <TableRow key={idx} className="hover:bg-[var(--surface-highlight)]">
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            className={`text-xs font-mono ${col.align === 'right' ? 'text-right' :
                                                col.align === 'center' ? 'text-center' : 'text-left'
                                                }`}
                                        >
                                            {row[col.key] ?? '-'}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DataTableFlat;
