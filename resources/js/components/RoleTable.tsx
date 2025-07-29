import { useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';
import { Pencil, Trash2, User, CalendarDays, Ellipsis, Tag, Search, List } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from './ui/alert-dialog';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from './ui/pagination';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import React from 'react';

// Tipe data disesuaikan dengan skema final (tanpa key)
type Role = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
};

interface RoleTableProps {
    data: Role[];
    onEdit?: (role: Role) => void;
    onManagePermissions?: (role: Role) => void;
    onManageUsers?: (role: Role) => void;
    canManageUsers?: boolean;
};

export function RoleTable({ data, onEdit, onManagePermissions, onManageUsers, canManageUsers }: RoleTableProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        setPageIndex(0);
    }, [globalFilter]);

    const columns: ColumnDef<Role>[] = [
        {
            id: 'rowNumber',
            header: '#',
            cell: ({ row }) => row.index + 1 + pageIndex * pageSize,
        },
        {
            accessorKey: 'name',
            header: 'Nama Role',
        },
        {
            accessorKey: 'created_at',
            header: 'Dibuat',
            cell: info => new Date(info.getValue() as string).toLocaleDateString('id-ID'),
        },
        {
            id: 'actions',
            header: () => <div className="text-center">Aksi</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" aria-label="Aksi">
                                <Ellipsis className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onManagePermissions?.(row.original)}>
                                <Tag className="w-4 h-4 mr-2" /> Manage Permissions
                            </DropdownMenuItem>
                            {canManageUsers && (
                                <DropdownMenuItem onClick={() => onManageUsers?.(row.original)}>
                                    <User className="w-4 h-4 mr-2" /> Manage Users
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeleteId(row.original.id)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            pagination: { pageIndex, pageSize },
        },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: updater => {
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
        // --- PERUBAHAN: Ganti 'shadow-sm' menjadi 'shadow-lg' untuk efek yang lebih kuat ---
        <div className="bg-white dark:bg-zinc-900/50 p-4 sm:p-6 rounded-xl border-4 shadow-lg">
            {/* Filter & Search */}
            <div className="flex flex-wrap gap-2 mb-4 items-center">
                <div className="relative w-full sm:w-48">
                    <Input
                        type="search"
                        placeholder="Cari role..."
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                        className="pl-9 border-2 shadow-lg focus:border-secondary focus:ring-0 focus:shadow-lg transition-all duration-200"
                    />
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                <Select
                    value={String(pageSize)}
                    onValueChange={v => setPageSize(Number(v))}
                >
                    <SelectTrigger className="w-full sm:w-32 border-2 shadow-md">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[5, 10, 20, 50].map(size => (
                            <SelectItem key={size} value={String(size)}>
                                <List className="w-4 h-4 mr-2 inline focus:border-secondary focus:ring-0 focus:shadow-lg transition-all duration-200" />{size} Data
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table Container */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/80">
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center h-24">
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map(cell => (
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

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                 <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={e => { e.preventDefault(); table.previousPage(); }}
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
                                        onClick={e => { e.preventDefault(); table.setPageIndex(i); }}
                                        href="#"
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            </React.Fragment>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={e => { e.preventDefault(); table.nextPage(); }}
                                href="#"
                                aria-disabled={!table.getCanNextPage()}
                                className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/* AlertDialog for delete */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Role?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus role ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteId) {
                                    router.delete(`/roles/${deleteId}`, {
                                        onSuccess: () => toast.success('Role berhasil dihapus!'),
                                        onError: (errors: any) => toast.error(errors.general || 'Gagal menghapus role.'),
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
        </div>
    );
}
