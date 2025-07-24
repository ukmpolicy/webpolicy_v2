import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import {
  Table,
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import {
  Input
} from '@/components/ui/input';
import {
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationPrevious, 
  PaginationNext, 
  PaginationEllipsis
} from '@/components/ui/pagination';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Ellipsis, Pencil, Trash2, List, ArrowDown, ArrowUp, Search } from 'lucide-react';
import { toast } from 'sonner';
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable
} from '@tanstack/react-table';

export function StructureTable({ data, onEdit, sortDirection: initialSortDirection }) {
    const { periods = [], selectedPeriodId } = usePage().props;

const defaultPeriodId = selectedPeriodId || periods.find(p => p.name === '2024-2025')?.id?.toString() || '';

const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriodId);

  const [deleteId, setDeleteId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [sortDirection, setSortDirection] = useState(initialSortDirection || 'desc');

useEffect(() => {
  if (selectedPeriodId) {
    setSelectedPeriod(selectedPeriodId.toString());
  } else {
    const fallback = periods.find(p => p.name === '2024-2025')?.id?.toString() || '';
    setSelectedPeriod(fallback);
  }
}, [selectedPeriodId, periods]);


  function handleFilterChange(period_id) {
    Inertia.get('/structures', {
      period_id,
      sort: sortDirection,
    });
  }

  function sortByLevel(direction) {
    Inertia.get('/structures', {
      period_id: selectedPeriod,
      sort: direction
    }, { preserveState: true, replace: true });
  }

  const columns = [
    {
      id: 'no',
      header: '#',
      cell: ({ row }) => row.index + 1 + pageIndex * pageSize,
    },
    {
      accessorKey: 'name',
      header: 'Nama Struktur',
    },
    {
      accessorKey: 'division.name',
      header: 'Divisi',
      cell: ({ row }) => row.original.division?.name || '-',
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        // Cek apakah baris ini adalah paling atas atau paling bawah
        const rowIndex = row.index;
        const totalRows = table.getRowModel().rows.length;
        const isFirst = rowIndex === 0;
        const isLast = rowIndex === totalRows - 1;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => Inertia.get(`/structure-members`, { structure_id: row.original.id })}>
                <List className="mr-2 h-4 w-4" /> Lihat Struktur
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => setDeleteId(row.original.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Hapus
              </DropdownMenuItem>
              {/* Tampilkan aksi urutkan level hanya jika bukan paling atas/bawah */}
              {!isFirst && sortDirection === 'asc' && (
                <DropdownMenuItem onClick={() => {
                  setSortDirection('desc');
                  sortByLevel('desc');
                }}>
                  <ArrowUp className="mr-2 h-4 w-4" /> Urutkan Level ke Atas
                </DropdownMenuItem>
              )}
              {!isLast && sortDirection === 'desc' && (
                <DropdownMenuItem onClick={() => {
                  setSortDirection('asc');
                  sortByLevel('asc');
                }}>
                  <ArrowDown className="mr-2 h-4 w-4" /> Urutkan Level ke Bawah
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
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

  function getPaginationRange(current, total) {
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
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="relative w-64">
          <Input
            type="search"
            placeholder="Cari struktur..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        <Select value={selectedPeriod} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter berdasarkan Periode" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem key={p.id} value={p.id.toString()}>
                {p.name}
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

      <Table className="rounded-lg border overflow-hidden">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
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
              <TableCell colSpan={columns.length} className="text-center">
                Tidak ada data struktur.
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

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 0) table.previousPage();
              }}
              href="#"
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
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Hapus Struktur?</AlertDialogTitle>
          <AlertDialogDescription>
            Yakin ingin menghapus struktur ini? Tindakan ini tidak bisa dibatalkan.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                Inertia.delete(`/structures/${deleteId}`, {
                  onSuccess: () => toast.success('Struktur berhasil dihapus!'),
                  onError: () => toast.error('Gagal menghapus struktur!'),
                });
                setDeleteId(null);
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
