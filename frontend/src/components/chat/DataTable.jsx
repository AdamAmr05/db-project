import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

const DataTable = ({ element }) => {
    // Guard against null/undefined element
    if (!element?.props) {
        return (
            <Card className="border border-border bg-[var(--surface)] shadow-lg">
                <CardHeader>
                    <CardTitle>Data Table</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted font-mono">Invalid element data.</p>
                </CardContent>
            </Card>
        );
    }

    const { title, description, columns, data = [] } = element.props;

    if (!columns || !Array.isArray(columns) || columns.length === 0) {
        return (
            <Card className="border border-border bg-[var(--surface)] shadow-lg">
                <CardHeader>
                    <CardTitle>{title || 'Data Table'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted font-mono">No columns defined.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border border-border bg-[var(--surface)] shadow-lg">
            <CardHeader>
                <CardTitle>{title || 'Data Table'}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[var(--surface-highlight)]">
                                {columns.map((col) => (
                                    <TableHead
                                        key={col.key}
                                        className={`text-xs font-mono text-muted ${col.align === 'right' ? 'text-right' :
                                            col.align === 'center' ? 'text-center' : 'text-left'
                                            }`}
                                    >
                                        {col.label}
                                    </TableHead>
                                ))}
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
            </CardContent>
        </Card>
    );
};

export default DataTable;
