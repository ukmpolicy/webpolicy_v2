import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Inertia } from '@inertiajs/inertia';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Ellipsis, Eye, List, Pencil, Search, Trash2 } from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function StructureMemberTable({ onEdit }) {
  const {
    data = [],
    periods = [],
    structures = [],
    selectedPeriodId: selectedPeriodRaw = null,
    selectedStructureId = null,
  } = usePage().props;

  const selectedPeriodId = String(selectedPeriodRaw ?? '');

  const [deleteId, setDeleteId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const columns = [
    {
      id: 'no',
      header: '#',
      cell: ({ row }) => row.index + 1 + pageIndex * pageSize,
    },
    {
      accessorKey: 'name',
      header: 'Nama Anggota',
    },
    {
      accessorKey: 'department',
      header: 'Jurusan',
    },
    {
      accessorKey: 'study_program',
      header: 'Prodi',
    },
    {
      accessorKey: 'structure.name',
      header: 'Struktur',
      cell: ({ row }) => row.original.structure?.name || '-',
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={`/structure-members/${row.original.id}`}>
                <Eye className="mr-2 h-4 w-4" /> Detail
              </Link>
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
      pagination: { pageIndex, pageSize },
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

const handlePeriodChange = (value) => {
  router.get(route('structure-members.index'), {
    period_id: value,
    structure_id: undefined, // Reset struktur saat periode berubah
  }, {
    preserveScroll: true,
    preserveState: false, // supaya struktur terupdate
  });
};

  const handleStructureChange = (value) => {
    router.get(route('structure-members.index'), {
      structure_id: value,
      period_id: selectedPeriodId || undefined,
    }, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  const getPaginationRange = (current, total) => {
    const delta = 2;
    let range = [];
    for (let i = Math.max(0, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (range[0] > 0) range = [0, ...range];
    if (range[range.length - 1] < total - 1) range = [...range, total - 1];
    return Array.from(new Set(range));
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="relative w-64">
          <Input
            type="search"
            placeholder="Cari anggota struktur..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

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
                Tidak ada data anggota struktur.
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
          {getPaginationRange(currentPage, pageCount).map((i, idx, arr) => (
            <React.Fragment key={i}>
              {idx > 0 && i - arr[idx - 1] > 1 && (
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
                if (currentPage < pageCount - 1) table.nextPage();
              }}
              href="#"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Hapus Anggota?</AlertDialogTitle>
          <AlertDialogDescription>
            Yakin ingin menghapus anggota ini? Tindakan ini tidak bisa dibatalkan.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                Inertia.delete(`/structure-members/${deleteId}`, {
                  onSuccess: () => toast.success('Anggota berhasil dihapus!'),
                  onError: () => toast.error('Gagal menghapus anggota!'),
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
