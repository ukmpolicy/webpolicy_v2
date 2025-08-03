import { router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Ellipsis, List, Pencil, Search, Tag, Trash2, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from './ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

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
}

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
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: 'name',
            header: 'Nama Role',
        },
        {
            accessorKey: 'created_at',
            header: 'Dibuat',
            cell: (info) => new Date(info.getValue() as string).toLocaleDateString('id-ID'),
        },
        {
            id: 'actions',
            header: () => <div className="text-center">Aksi</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" aria-label="Aksi">
                                <Ellipsis className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onManagePermissions?.(row.original)}>
                                <Tag className="mr-2 h-4 w-4" /> Manage Permissions
                            </DropdownMenuItem>
                            {canManageUsers && (
                                <DropdownMenuItem onClick={() => onManageUsers?.(row.original)}>
                                    <User className="mr-2 h-4 w-4" /> Manage Users
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => setDeleteId(row.original.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
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
        // --- PERUBAHAN: Ganti 'shadow-sm' menjadi 'shadow-lg' untuk efek yang lebih kuat ---
        <div className="rounded-xl border-4 bg-white p-4 shadow-lg sm:p-6 dark:bg-zinc-900/50">
            {/* Filter & Search */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-48">
                    <Input
                        type="search"
                        placeholder="Cari role..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="focus:border-secondary border-2 pl-9 shadow-lg transition-all duration-200 focus:shadow-lg focus:ring-0"
                    />
                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                </div>
                <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                    <SelectTrigger className="w-full border-2 shadow-md sm:w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[5, 10, 20, 50].map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                <List className="focus:border-secondary mr-2 inline h-4 w-4 transition-all duration-200 focus:shadow-lg focus:ring-0" />
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table Container */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/80">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
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
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.previousPage();
                                }}
                                href="#"
                                aria-disabled={!table.getCanPreviousPage()}
                                className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                        {getPaginationRange(currentPage, pageCount).map((i, idx, arr) => (
                            <React.Fragment key={i}>
                                {idx > 0 && arr[idx - 1] !== i - 1 && (
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
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.nextPage();
                                }}
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
