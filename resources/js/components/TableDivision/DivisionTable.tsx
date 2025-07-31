import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Inertia } from '@inertiajs/inertia';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Ellipsis, List, Pencil, Search, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react'; // Import useEffect
import { toast } from 'sonner';

export function DivisionTable({ data, onEdit, periods = [], selectedPeriod: propSelectedPeriod = '', activePeriodId = null }) {
    const [deleteId, setDeleteId] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [columnFilters, setColumnFilters] = useState([]); // Add this line

    // Inisialisasi selectedPeriod dengan activePeriodId dari props
    const [selectedPeriod, setSelectedPeriod] = useState(activePeriodId ? String(activePeriodId) : 'all');

    // Sinkronisasi selectedPeriod state lokal dengan prop activePeriodId
    useEffect(() => {
        setSelectedPeriod(activePeriodId ? String(activePeriodId) : 'all');
    }, [activePeriodId]);

    function handlePeriodFilter(value: string) {
        // Gunakan Inertia.get untuk memuat ulang data dari backend
        Inertia.get(
            '/divisions',
            {
                period_id: value, // Kirim 'all' atau ID periode
            },
            { preserveScroll: true, replace: true },
        );
    }

    // Unique division names for filter (ini masih filter frontend, tidak masalah)
    const divisionNameOptions = useMemo(() => {
        const names = data?.map((d) => d.name).filter((name) => name) || [];
        return ['__all__', ...new Set(names)];
    }, [data]);

    React.useEffect(() => {
        setPageIndex(0);
    }, [globalFilter, selectedPeriod]); // Tambahkan selectedPeriod sebagai dependency

    const columns = [
        {
            id: 'no',
            header: '#',
            cell: () => null, // Render manual di JSX
        },
        {
            accessorKey: 'name',
            header: 'Nama Divisi',
            // filterFn ini tidak akan digunakan jika filtering di backend
            filterFn: (row, _, filterValue) => {
                if (!filterValue || filterValue === '__all__') return true;
                return row.getValue('name') === filterValue;
            },
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
                        <DropdownMenuItem
                            onClick={() => {
                                Inertia.visit(`/division-plans?division_id=${row.original.id}`);
                            }}
                        >
                            <List className="mr-2 h-4 w-4" /> Lihat Daftar Proker Divisi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(row.original)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => setDeleteId(row.original.id)}>
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
            columnFilters, // Tetap ada jika ada filter lain yang dikelola frontend
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
        getFilteredRowModel: getFilteredRowModel(), // Tetap ada untuk globalFilter
        getPaginationRowModel: getPaginationRowModel(),
    });

    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;

    function getPaginationRange(current: number, total: number) {
        const delta = 2;
        let range = [];
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
                        placeholder="Cari divisi..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-9"
                    />
                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                </div>

                {/* Filter Periode */}
                <Select value={selectedPeriod} onValueChange={handlePeriodFilter}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Semua Periode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Periode</SelectItem> {/* Gunakan 'all' */}
                        {periods.map((period) => (
                            <SelectItem key={period.id} value={String(period.id)}>
                                {period.name}
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
                                {/* Perbaikan penomoran manual */}
                                <TableCell className="border-r border-l font-medium dark:border-zinc-800 dark:text-zinc-100">
                                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + idx + 1}
                                </TableCell>
                                {row
                                    .getVisibleCells()
                                    .filter((cell) => cell.column.id !== 'no')
                                    .map(
                                        (
                                            cell, // Filter out 'no' column
                                        ) => (
                                            <TableCell key={cell.id} className="border-r border-l dark:border-zinc-800 dark:text-zinc-100">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ),
                                    )}
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
                        <AlertDialogTitle>Hapus Divisi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus divisi ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteId) {
                                    Inertia.delete(`/divisions/${deleteId}`, {
                                        onSuccess: () => toast.success('Divisi berhasil dihapus!'),
                                        onError: () => toast.error('Gagal menghapus divisi.'),
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
