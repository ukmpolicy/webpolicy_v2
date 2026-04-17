import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Pagination, PaginationContent, PaginationItem,
    PaginationLink, PaginationNext, PaginationPrevious
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { List, Search, Eye } from 'lucide-react';
import * as React from 'react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

function KuisionerTable({ data }: { data: any[] }) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    const [selectedItem, setSelectedItem] = useState<any>(null);

    const columns = useMemo(
        () => [
            {
                id: 'no',
                header: '#',
                cell: ({ row }: any) => pageIndex * pageSize + row.index + 1,
            },
            {
                accessorKey: 'nama',
                header: 'Nama',
                cell: ({ row }: any) => row.original.nama || '-',
            },
            {
                accessorKey: 'nim',
                header: 'NIM',
                cell: ({ row }: any) => row.original.nim || '-',
            },
            {
                id: 'deskripsi_diri',
                header: 'Deskripsi Diri',
                cell: ({ row }: any) => {
                    const ans = row.original.kuisioner?.deskripsi_diri || '-';
                    return <span className="truncate max-w-[200px] block" title={ans}>{ans}</span>;
                },
            },
            {
                id: 'alasan_bergabung',
                header: 'Alasan Bergabung',
                cell: ({ row }: any) => {
                    const ans = row.original.kuisioner?.alasan_bergabung || '-';
                    return <span className="truncate max-w-[200px] block" title={ans}>{ans}</span>;
                },
            },
            {
                id: 'actions',
                header: 'Aksi',
                cell: ({ row }: any) => (
                    <Button size="sm" variant="outline" onClick={() => setSelectedItem(row.original)}>
                        <Eye className="mr-2 h-4 w-4" /> Buka Jawaban
                    </Button>
                ),
            },
        ],
        [pageIndex, pageSize],
    );

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter, pagination: { pageIndex, pageSize } },
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
                        <Input type="search" placeholder="Cari nama / nim..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="pl-9" />
                        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                    </div>

                    <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPageIndex(0); }}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50].map((size) => (
                                <SelectItem key={size} value={String(size)}><List className="mr-2 inline h-4 w-4" />{size} Baris</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Table className="divide-muted divide-y overflow-hidden rounded-lg border bg-white dark:bg-gray-900">
                <TableHeader>
                    {table.getHeaderGroups().map((group) => (
                        <TableRow key={group.id} className="bg-muted dark:bg-zinc-900 border-b">
                            {group.headers.map((header) => (
                                <TableHead key={header.id} className="font-bold py-3 text-gray-700 dark:text-gray-200">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length === 0 ? (
                        <TableRow><TableCell colSpan={columns.length} className="text-center text-gray-500 h-24">Tidak ada data.</TableCell></TableRow>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className={row.index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="border-r border-l">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem><PaginationPrevious onClick={(e) => { e.preventDefault(); if (currentPage > 0) table.previousPage(); }} href="#" aria-disabled={currentPage === 0} /></PaginationItem>
                    {getPaginationRange(currentPage, pageCount).map((i) => (
                        <React.Fragment key={i}>
                            <PaginationItem><PaginationLink isActive={i === currentPage} onClick={(e) => { e.preventDefault(); table.setPageIndex(i); }} href="#">{i + 1}</PaginationLink></PaginationItem>
                        </React.Fragment>
                    ))}
                    <PaginationItem><PaginationNext onClick={(e) => { e.preventDefault(); if (currentPage < pageCount - 1) table.nextPage(); }} href="#" aria-disabled={currentPage === pageCount - 1} /></PaginationItem>
                </PaginationContent>
            </Pagination>

            <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Jawaban Kuisioner: {selectedItem?.nama}</DialogTitle>
                        <DialogDescription>NIM: {selectedItem?.nim}</DialogDescription>
                    </DialogHeader>
                    {selectedItem?.kuisioner ? (
                        <div className="space-y-4">
                            <div><div className="font-semibold mb-1">1. Deskripsi Diri</div><div className="bg-gray-50 p-3 rounded text-sm">{selectedItem.kuisioner.deskripsi_diri || '-'}</div></div>
                            <div><div className="font-semibold mb-1">2. Alasan Bergabung</div><div className="bg-gray-50 p-3 rounded text-sm">{selectedItem.kuisioner.alasan_bergabung || '-'}</div></div>
                            <div><div className="font-semibold mb-1">3. Makna Logo</div><div className="bg-gray-50 p-3 rounded text-sm">{selectedItem.kuisioner.makna_logo || '-'}</div></div>
                            <div><div className="font-semibold mb-1">4. Visi & Misi</div><div className="bg-gray-50 p-3 rounded text-sm">{selectedItem.kuisioner.visi_misi || '-'}</div></div>
                            <div><div className="font-semibold mb-1">5. Sejarah UKM</div><div className="bg-gray-50 p-3 rounded text-sm">{selectedItem.kuisioner.sejarah_ukm || '-'}</div></div>
                            <div><div className="font-semibold mb-1">6. Pengetahuan Linux</div><div className="bg-gray-50 p-3 rounded text-sm">{selectedItem.kuisioner.pengetahuan_linux || '-'}</div></div>
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500">Belum ada data kuisioner.</div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function KuisionerIndex() {
    const { pendaftarans = [] } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={[{ title: 'Kuisioner', href: '/kuisioner' }]}>
            <Head title="Manajemen Kuisioner" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Respon Kuisioner Pendatar</h1>
                </div>
                <KuisionerTable data={pendaftarans} />
            </div>
        </AppLayout>
    );
}
