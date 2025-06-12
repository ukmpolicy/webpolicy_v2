import { Inertia } from '@inertiajs/inertia';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Ellipsis, Layers, List, Pencil, Search, Tag, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

type Period = {
    id: number;
    name: string;
    started_at: string; // Tambahkan ini
    ended_at: string; // Tambahkan ini
    created_at: string;
    updated_at: string;
};

interface PeriodTableProps {
    data: Period[];
    onEdit?: (period: Period) => void;
}

export function PeriodTable({ data, onEdit }: PeriodTableProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        setPageIndex(0);
    }, [globalFilter, columnFilters]);

    // Unique role names for filter
    const nameOptions = useMemo(() => Array.from(new Set(data.map((p) => p.name))), [data]);
    const nameFilter = (columnFilters.find((f) => f.id === 'name')?.value as string) ?? '';

    // Inisialisasi Coloumn Form
    const columns: ColumnDef<Period>[] = [
        {
            id: 'rowNumber',
            header: '#',
            cell: ({ row }) => row.index + 1 + pageIndex * pageSize,
        },
        {
            accessorKey: 'name',
            header: 'Nama Periode',
            cell: (info) => info.getValue(),
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue || filterValue === '__all__') return true;
                return row.getValue(columnId) === filterValue;
            },
        },
        {
            accessorKey: 'started_at',
            header: 'Waktu Mulai',
            cell: (info) => {
                const date = new Date(info.getValue() as string);
                return date.getFullYear();
            },
        },
        {
            accessorKey: 'ended_at',
            header: 'Waktu Berakhir',
            cell: (info) => {
                const date = new Date(info.getValue() as string);
                return date.getFullYear();
            },
        },
        {
            accessorKey: 'is_active',
            header: 'Status Aktif',
            cell: (info) => (info.getValue() ? 'Aktif' : 'Tidak Aktif'),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" aria-label="Aksi">
                            <Ellipsis className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteId(row.original.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            columnFilters,
            pagination: { pageIndex, pageSize },
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
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

    // Helper untuk menentukan halaman yang ditampilkan (tanpa duplikat)
    function getPaginationRange(current: number, total: number) {
        const delta = 2;
        let range: number[] = [];
        for (let i = Math.max(0, current - delta); i <= Math.min(total - 1, current + delta); i++) {
            range.push(i);
        }
        if (range[0] > 0) range = [0, ...range];
        if (range[range.length - 1] < total - 1) range = [...range, total - 1];
        return Array.from(new Set(range));
    }
    return (
        <>
            {/* Filter & Search */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="relative w-48">
                    <Input
                        type="search"
                        placeholder="Cari Periode..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-9"
                    />
                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                </div>
                <Select
                    value={nameFilter || '__all__'}
                    onValueChange={(value) =>
                        setColumnFilters(
                            (old) =>
                                [...old.filter((f) => f.id !== 'name'), value !== '__all__' ? { id: 'name', value } : undefined].filter(
                                    Boolean,
                                ) as ColumnFiltersState,
                        )
                    }
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Semua Periode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">
                            <Layers className="mr-2 inline h-4 w-4" /> Semua Periode
                        </SelectItem>
                        {nameOptions.map((name) => (
                            <SelectItem key={name} value={name}>
                                <Tag className="mr-2 inline h-4 w-4" />
                                {name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[5, 10, 20, 50].map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                <List className="mr-2 inline h-4 w-4" />
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {/* Table */}
            <Table className="divide-muted divide-y overflow-hidden rounded-lg border">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-muted dark:bg-zinc-900">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="font-bold">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                Tidak ada data.
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row, idx) => (
                            <TableRow key={row.id} className={idx % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-gray-50 dark:bg-zinc-800'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="border-r border-l dark:border-zinc-800 dark:text-zinc-100">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {/* Pagination */}
            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 0) table.previousPage();
                            }}
                            href="#"
                            aria-disabled={currentPage === 0}
                        />
                    </PaginationItem>
                    {(() => {
                        const range = getPaginationRange(currentPage, pageCount);
                        let last = -1;
                        return range.map((i) => {
                            const showEllipsis = last !== -1 && i - last > 1;
                            last = i;
                            return (
                                <React.Fragment key={i}>
                                    {showEllipsis && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )}
                                    <PaginationItem>
                                        <PaginationLink
                                            isActive={i === currentPage}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                table.setPageIndex(i);
                                            }}
                                            href="#"
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                </React.Fragment>
                            );
                        });
                    })()}
                    <PaginationItem>
                        <PaginationNext
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < pageCount - 1) table.nextPage();
                            }}
                            href="#"
                            aria-disabled={currentPage === pageCount - 1}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            {/* AlertDialog for delete */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Periode?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus periode ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteId) {
                                    Inertia.delete(`/periods/${deleteId}`, {
                                        onSuccess: () => toast.success('Periode berhasil dihapus!'),
                                        onError: () => toast.error('Gagal menghapus periode.'),
                                    });
                                    setDeleteId(null);
                                }
                            }}
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
