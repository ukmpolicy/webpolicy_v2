import { useState, useMemo, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef, getFilteredRowModel, getPaginationRowModel, ColumnFiltersState } from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';
import { Pencil, Trash2, Hash, User, CalendarDays, Ellipsis, Tag, Search, Layers, List } from 'lucide-react';
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
import { Inertia } from '@inertiajs/inertia';
import { toast } from 'sonner';
import React from 'react';

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
};

export function RoleTable({ data, onEdit, onManagePermissions }: RoleTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [globalFilter, columnFilters]);

  // Unique role names for filter
  const nameOptions = useMemo(() => Array.from(new Set(data.map(r => r.name))), [data]);
  const nameFilter = columnFilters.find(f => f.id === 'name')?.value as string ?? '';

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'id',
      header: '#',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'name',
      header: 'Nama Role',
      cell: info => info.getValue(),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === '__all__') return true;
        return row.getValue(columnId) === filterValue;
      },
    },
    {
      accessorKey: 'created_at',
      header: () => (
        <span className="flex items-center gap-1">
          <CalendarDays className="w-4 h-4" /> Dibuat
        </span>
      ),
      cell: info => new Date(info.getValue() as string).toLocaleDateString('id-ID'),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="Aksi">
              <Ellipsis className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onManagePermissions?.(row.original)}>
              <Tag className="w-4 h-4 mr-2" /> Manage Permissions
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteId(row.original.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Hapus
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
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <div className="relative w-48">
          <Input
            type="search"
            placeholder="Cari role..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
        <Select
          value={nameFilter || "__all__"}
          onValueChange={value =>
            setColumnFilters(old => [
              ...old.filter(f => f.id !== 'name'),
              value !== "__all__" ? { id: 'name', value } : undefined,
            ].filter(Boolean) as ColumnFiltersState)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Semua Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">
              <Layers className="w-4 h-4 mr-2 inline" /> Semua Role
            </SelectItem>
            {nameOptions.map(name => (
              <SelectItem key={name} value={name}>
                <Tag className="w-4 h-4 mr-2 inline" />{name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={String(pageSize)}
          onValueChange={v => setPageSize(Number(v))}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map(size => (
              <SelectItem key={size} value={String(size)}>
                <List className="w-4 h-4 mr-2 inline" />{size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Table */}
      <Table className="border rounded-lg overflow-hidden divide-y divide-muted">
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className="bg-muted dark:bg-zinc-900">
              {headerGroup.headers.map(header => (
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
              <TableRow
                key={row.id}
                className={
                  idx % 2 === 0
                    ? "bg-white dark:bg-zinc-900"
                    : "bg-gray-50 dark:bg-zinc-800"
                }
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell
                    key={cell.id}
                    className="border-l border-r dark:border-zinc-800 dark:text-zinc-100"
                  >
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
              onClick={e => {
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
                      onClick={e => {
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
              onClick={e => {
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
                  Inertia.delete(`/roles/${deleteId}`, {
                    onSuccess: () => toast.success('Role berhasil dihapus!'),
                    onError: () => toast.error('Gagal menghapus role.'),
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
