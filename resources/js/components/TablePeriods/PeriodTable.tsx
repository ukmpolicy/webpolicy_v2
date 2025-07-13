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
// --- TAMBAHAN: Import ikon baru ---
import { Ellipsis, List, Pencil, Search, Trash2, Eye, Shield } from 'lucide-react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
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

// Tipe data yang lebih lengkap
type Period = {
    id: number;
    name: string;
    started_at: string;
    ended_at: string;
    is_active: boolean; // Pastikan ini ada
    created_at: string;
    updated_at: string;
};

// --- TAMBAHAN: Props baru untuk handle Visi & Misi ---
interface PeriodTableProps {
    data: Period[];
    onEdit?: (period: Period) => void;
    onManageVisions?: (period: Period) => void;
    onManageMissions?: (period: Period) => void;
}

export function PeriodTable({ data, onEdit, onManageVisions, onManageMissions }: PeriodTableProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        setPageIndex(0);
    }, [globalFilter, columnFilters]);

    const nameOptions = useMemo(() => Array.from(new Set(data.map((p) => p.name))), [data]);

    const columns: ColumnDef<Period>[] = [
        {
            id: 'rowNumber',
            header: '#',
            cell: ({ row }) => row.index + 1 + pageIndex * pageSize,
        },
        {
            accessorKey: 'name',
            header: 'Nama Periode',
        },
        {
            accessorKey: 'started_at',
            header: 'Tanggal Mulai',
            cell: (info) => new Date(info.getValue() as string).toLocaleDateString('id-ID'),
        },
        {
            accessorKey: 'ended_at',
            header: 'Tanggal Selesai',
            cell: (info) => new Date(info.getValue() as string).toLocaleDateString('id-ID'),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: (info) => (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    info.getValue()
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                    {info.getValue() ? 'Aktif' : 'Tidak Aktif'}
                </span>
            ),
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
                        {/* --- TAMBAHAN BARU: Menu Kelola Visi & Misi --- */}
                        <DropdownMenuItem onClick={() => onManageVisions?.(row.original)}>
                            <Eye className="mr-2 h-4 w-4" /> Kelola Visi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onManageMissions?.(row.original)}>
                            <Shield className="mr-2 h-4 w-4" /> Kelola Misi
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* --- AKHIR TAMBAHAN BARU --- */}
                        <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit Periode
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteId(row.original.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus Periode
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
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-48">
                    <Input
                        type="search"
                        placeholder="Cari Periode..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-9"
                    />
                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                </div>
                <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                    <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[5, 10, 20, 50].map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                <List className="mr-2 inline h-4 w-4" />
                                {size} Data
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted hover:bg-muted/80">
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={(e) => { e.preventDefault(); table.previousPage(); }}
                            href="#"
                            aria-disabled={!table.getCanPreviousPage()}
                            className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>
                    {getPaginationRange(currentPage, pageCount).map((i, idx, arr) => (
                        <React.Fragment key={i}>
                            {idx > 0 && arr[idx-1] !== i-1 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
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
                            onClick={(e) => { e.preventDefault(); table.nextPage(); }}
                            href="#"
                            aria-disabled={!table.getCanNextPage()}
                            className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Periode?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus periode secara permanen.
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
                                        preserveScroll: true,
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
