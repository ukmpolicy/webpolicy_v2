import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Pagination, PaginationContent, PaginationItem,
    PaginationLink, PaginationNext, PaginationPrevious
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { List, Search, Eye, FileText } from 'lucide-react';
import * as React from 'react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

function DokumenTable({ data }: { data: any[] }) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    const [selectedItem, setSelectedItem] = useState<any>(null);

    const countUploadedFiles = (dokumen: any) => {
        if (!dokumen) return 0;
        let c = 0;
        const keys = ['pas_photo', 'sertifikat_ppkmb', 'follow_ig', 'follow_tiktok', 'follow_yt', 'tgl_lahir_doc', 'bukti_pembayaran'];
        keys.forEach(k => { if (dokumen[k]) c++; });
        return c;
    }

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
                id: 'total_berkas',
                header: 'Total Berkas',
                cell: ({ row }: any) => {
                    const c = countUploadedFiles(row.original.dokumen_berkas);
                    return <span className={`font-semibold ${c < 7 ? 'text-red-500' : 'text-green-500'}`}>{c} / 7 Berkas</span>;
                },
            },
            {
                id: 'actions',
                header: 'Aksi',
                cell: ({ row }: any) => (
                    <Button size="sm" variant="outline" onClick={() => setSelectedItem(row.original)}>
                        <Eye className="mr-2 h-4 w-4" /> Cek Berkas
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

    const BerkasRow = ({ title, path }: { title: string, path: string | null }) => (
        <div className="mb-4">
            <h4 className="font-semibold mb-2 text-sm">{title}</h4>
            {path ? (
                <div className="rounded border bg-gray-50 p-2 text-center overflow-hidden">
                   {path.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                       <img src={`/storage/${path}`} alt={title} className="max-h-48 mx-auto rounded" />
                   ) : (
                       <a href={`/storage/${path}`} target="_blank" rel="noreferrer" className="text-blue-500 underline flex items-center justify-center py-4">
                           <FileText className="mr-2" /> Buka {title}
                       </a>
                   )}
                </div>
            ) : (
                <span className="text-gray-400 italic text-sm">Tidak diunggah</span>
            )}
        </div>
    );

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
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Dokumen Berkas: {selectedItem?.nama}</DialogTitle>
                        <DialogDescription>NIM: {selectedItem?.nim}</DialogDescription>
                    </DialogHeader>
                    {selectedItem?.dokumen_berkas ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <BerkasRow title="Pas Photo" path={selectedItem.dokumen_berkas.pas_photo} />
                            <BerkasRow title="Bukti Pembayaran" path={selectedItem.dokumen_berkas.bukti_pembayaran} />
                            <BerkasRow title="Sertifikat PPKMB" path={selectedItem.dokumen_berkas.sertifikat_ppkmb} />
                            <BerkasRow title="KTP/KTM/Akte (Tgl Lahir)" path={selectedItem.dokumen_berkas.tgl_lahir_doc} />
                            <BerkasRow title="Follow IG" path={selectedItem.dokumen_berkas.follow_ig} />
                            <BerkasRow title="Follow TikTok" path={selectedItem.dokumen_berkas.follow_tiktok} />
                            <BerkasRow title="Subscribe YouTube" path={selectedItem.dokumen_berkas.follow_yt} />
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500">Pendaftar tidak mengunggah dokumen/berkas apapun.</div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function DokumenIndex() {
    const { pendaftarans = [] } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={[{ title: 'Dokumen Berkas', href: '/dokumen-berkas' }]}>
            <Head title="Manajemen Dokumen Berkas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Arsip Dokumen Berkas Pendaftar</h1>
                </div>
                <DokumenTable data={pendaftarans} />
            </div>
        </AppLayout>
    );
}
