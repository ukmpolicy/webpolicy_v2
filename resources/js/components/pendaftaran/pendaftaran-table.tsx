import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Pagination, PaginationContent, PaginationItem,
    PaginationLink, PaginationNext, PaginationPrevious
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { List, Search, Eye } from 'lucide-react';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';

export function PendaftaranTable({ data }: { data: any[] }) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'bg-green-500 hover:bg-green-600 font-bold text-white';
            case 'rejected': return 'bg-red-500 hover:bg-red-600 font-bold text-white';
            default: return 'bg-yellow-500 hover:bg-yellow-600 font-bold text-white';
        }
    };

    const columns = useMemo(
        () => [
            {
                id: 'no',
                header: '#',
                cell: ({ row }: any) => pageIndex * pageSize + row.index + 1,
            },
            {
                accessorKey: 'nama',
                header: 'Nama Lengkap',
                cell: ({ row }: any) => row.original.nama || '-',
            },
            {
                accessorKey: 'nim',
                header: 'NIM',
                cell: ({ row }: any) => row.original.nim || '-',
            },
            {
                accessorKey: 'jurusan',
                header: 'Jurusan',
                cell: ({ row }: any) => row.original.jurusan || '-',
            },
            {
                id: 'period',
                accessorFn: (row: any) => row.period?.name,
                header: 'Periode',
                cell: ({ row }: any) => row.original.period?.name || '-',
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }: any) => (
                    <Badge className={getStatusColor(row.original.status)}>
                        {row.original.status.toUpperCase()}
                    </Badge>
                ),
            },
            {
                id: 'actions',
                header: 'Aksi',
                cell: ({ row }: any) => (
                    <Button size="sm" variant="outline" onClick={() => router.get(`/pendaftaran/${row.original.id}`)}>
                        <Eye className="mr-2 h-4 w-4" /> Detail
                    </Button>
                ),
            },
        ],
        [pageIndex, pageSize],
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            pagination: { pageIndex, pageSize },
        },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const next = updater({ pageIndex, pageSize });
                setPageIndex(next.pageIndex);
                setPageSize(next.pageSize);
            } else {
                setPageIndex(updater.pageIndex);
                setPageSize(updater.pageSize);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;

    function getPaginationRange(current: number, total: number) {
        const delta = 2;
        let range = [];
        for (let i = Math.max(0, current - delta); i <= Math.min(total - 1, current + delta); i++) range.push(i);
        if (range[0] > 0) range = [0, ...range];
        if (range[range.length - 1] < total - 1) range = [...range, total - 1];
        return Array.from(new Set(range));
    }

    return (
        <div>
            <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-64">
                        <Input
                            type="search"
                            placeholder="Cari pendaftar..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-9"
                        />
                        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                    </div>

                    <Select
                        value={String(pageSize)}
                        onValueChange={(v) => {
                            setPageSize(Number(v));
                            setPageIndex(0);
                        }}
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50].map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    <List className="mr-2 inline h-4 w-4" />
                                    {size} Baris
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Table className="divide-muted divide-y overflow-hidden rounded-lg border bg-white dark:bg-gray-900">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-muted dark:bg-zinc-900 border-b">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="font-bold py-3 text-gray-700 dark:text-gray-200">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center text-gray-500 h-24">
                                Tidak ada data pendaftar.
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className={row.index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-gray-50/50 dark:bg-zinc-800'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="border-r border-l border-zinc-100 dark:border-zinc-800 dark:text-zinc-100">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={(e) => { e.preventDefault(); if (currentPage > 0) table.previousPage(); }}
                            href="#" aria-disabled={currentPage === 0}
                        />
                    </PaginationItem>
                    {getPaginationRange(currentPage, pageCount).map((i) => (
                        <React.Fragment key={i}>
                            <PaginationItem>
                                <PaginationLink
                                    isActive={i === currentPage}
                                    onClick={(e) => { e.preventDefault(); table.setPageIndex(i); }}
                                    href="#"
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        </React.Fragment>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            onClick={(e) => { e.preventDefault(); if (currentPage < pageCount - 1) table.nextPage(); }}
                            href="#" aria-disabled={currentPage === pageCount - 1}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
