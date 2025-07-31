import React, { useState, useEffect, useMemo } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationPrevious, PaginationNext, PaginationEllipsis,
} from '@/components/ui/pagination';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Ellipsis, Pencil, Trash2, List, ArrowUp, ArrowDown, Search,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable,
} from '@tanstack/react-table';

const intPart = (lvl) => Math.floor(lvl);
const fracPart = (lvl) => {
  const [, f = '0'] = lvl.toString().split('.');
  return f;
};

export function StructureTable({ data, onEdit }) {
  const { periods = [], selectedPeriodId } = usePage().props;

  const defaultPeriodId =
    selectedPeriodId?.toString() ||
    periods.find((p) => p.is_active)?.id?.toString() ||
    '';

  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriodId);
  const [structures, setStructures] = useState([...data]);
  const [deleteId, setDeleteId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setStructures([...data]);
  }, [data]);

  const handleFilterChange = (value) => {
    setSelectedPeriod(value);
    setPageIndex(0);
    Inertia.get('/structures', { period_id: value }, {
      preserveState: true,
      replace: true,
    });
  };

  const filteredData = useMemo(
    () => [...structures].sort((a, b) => a.level - b.level),
    [structures],
  );

  const columns = useMemo(
    () => [
      {
        id: 'no',
        header: '#',
        cell: ({ row }) => row.index + 1 + pageIndex * pageSize,
      },
      { accessorKey: 'name', header: 'Nama Struktur' },
      {
        accessorKey: 'division.name',
        header: 'Divisi',
        cell: ({ row }) => row.original.division?.name || '-',
      },
      {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => renderActions(row.original),
      },
    ],
    [pageIndex, pageSize],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, pagination: { pageIndex, pageSize } },
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

  const maxIntGroupA = useMemo(() =>
    Math.max(0, ...filteredData.filter((s) => !s.division_id).map((s) => intPart(s.level))),
    [filteredData]
  );

  const minIntGroupB = useMemo(() => {
    const ints = filteredData.filter((s) => s.division_id).map((s) => intPart(s.level));
    return ints.length ? Math.min(...ints) : Infinity;
  }, [filteredData]);

  const clusterOf = (structure) =>
    filteredData.filter(
      (s) => s.division_id === structure.division_id &&
        s.period_id === structure.period_id &&
        s.division_id !== null,
    );

  const tryMove = (structure, dir) => {
    const isGroupA = structure.division_id === null;
    const delta = dir === 'up' ? -1 : 1;
    let updated = [...structures];

    if (isGroupA) {
      updated = updated.map((s) => {
        if (s.id === structure.id) {
          const int = intPart(s.level) + delta;
          return { ...s, level: parseFloat(`${int}.${fracPart(s.level)}`) };
        }
        return s;
      });
    } else {
      const cluster = clusterOf(structure);
      const canMove =
        dir === 'up'
          ? intPart(structure.level) - 1 >= maxIntGroupA
          : intPart(structure.level) + 1 < 1000;

      if (!canMove) {
        toast.error('Perpindahan melanggar batas level.');
        return;
      }

      updated = updated.map((s) => {
        const inCluster = cluster.find((c) => c.id === s.id);
        if (!inCluster) return s;
        const int = intPart(s.level) + delta;
        return { ...s, level: parseFloat(`${int}.${fracPart(s.level)}`) };
      });
    }

    const changes = updated
      .filter((s) => s.period_id === structure.period_id)
      .map(({ id, level }) => ({ id, level }));

    Inertia.post('/structures/reorder', { data: changes }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Urutan berhasil disimpan');
        setStructures(updated);
      },
      onError: () => toast.error('Gagal menyimpan urutan'),
    });
  };

  const renderActions = (structure) => {
    const isGroupA = structure.division_id === null;
    const actionsDisabledUp = (!isGroupA && intPart(structure.level) - 1 < maxIntGroupA) ||
                              (isGroupA && intPart(structure.level) - 1 < 1);
    const actionsDisabledDown = (isGroupA && intPart(structure.level) + 1 >= minIntGroupB);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onEdit(structure)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => Inertia.get('/structure-members', { structure_id: structure.id })}>
            <List className="mr-2 h-4 w-4" /> Lihat Struktur
          </DropdownMenuItem>
          <DropdownMenuItem disabled={actionsDisabledUp} onClick={() => tryMove(structure, 'up')}>
            <ArrowUp className="mr-2 h-4 w-4" /> Naik Level
          </DropdownMenuItem>
          <DropdownMenuItem disabled={actionsDisabledDown} onClick={() => tryMove(structure, 'down')}>
            <ArrowDown className="mr-2 h-4 w-4" /> Turun Level
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={() => setDeleteId(structure.id)}>
            <Trash2 className="mr-2 h-4 w-4" /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
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
              <TableCell colSpan={table.getAllColumns().length} className="text-center">
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
