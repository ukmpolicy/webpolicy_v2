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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import { router, useForm, usePage } from '@inertiajs/react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Ellipsis, File, FileSpreadsheet, FileText, Layers, List, Pencil, Search, Tag, Trash2, Upload } from 'lucide-react';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export function MemberTable({ data, onEdit, onView, periods, activePeriodId }) {
    const [deleteId, setDeleteId] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const [columnFilters, setColumnFilters] = useState([]);

    const { errors: sessionErrors } = usePage().props;
    const errors_import = sessionErrors?.errors_import || [];

    const periodOptions = useMemo(() => {
        return ['all', ...periods.map((p) => p.name)];
    }, [periods]);

    React.useEffect(() => {
        setPageIndex(0);
    }, [globalFilter, activePeriodId]);

    const {
        data: importData,
        setData: setImportData,
        processing: importProcessing,
        reset: resetImportForm,
    } = useForm({
        file: null,
    });

    const handleFileChange = (e) => {
        setImportData('file', e.target.files[0]);
    };

    const handleImportSubmit = (e) => {
        e.preventDefault();

        if (!importData.file) {
            toast.error('Silakan pilih file untuk diimpor.');
            return;
        }

        const formData = new FormData();
        formData.append('file', importData.file);
        if (activePeriodId) {
            formData.append('period_id', activePeriodId);
        }

        // Menggunakan router.post untuk pengiriman file yang lebih andal
        router.post(route('members.import'), formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Data member berhasil diimpor!');
                resetImportForm();
                setIsImportModalOpen(false);
            },
            onError: (errors) => {
                console.error('Errors dari server:', errors);

                if (Array.isArray(errors.errors_import)) {
                    const errorString = errors.errors_import.join('\n');
                    toast.error('Gagal mengimpor', {
                        description: <pre className="mt-2 w-full rounded-md bg-red-950 p-2 whitespace-pre-wrap text-white">{errorString}</pre>,
                        duration: 15000,
                    });
                } else if (errors.file) {
                    toast.error('Gagal mengimpor: ' + errors.file);
                } else {
                    toast.error('Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.');
                }
            },
        });
    };

    const handleExport = (type) => {
        const queryParams = new URLSearchParams();
        if (activePeriodId) {
            queryParams.set('period_id', activePeriodId);
        }
        const queryString = queryParams.toString();
        const url = `/members/export/${type}${queryString ? '?' + queryString : ''}`;
        window.location.href = url;
    };

    const columns = useMemo(
        () => [
            {
                id: 'no',
                header: '#',
                cell: ({ row, table }) => table.getState().pagination.pageIndex * table.getState().pagination.pageSize + row.index + 1,
            },
            {
                accessorKey: 'name',
                header: 'Nama',
            },
            {
                accessorKey: 'nim',
                header: 'NIM',
            },
            {
                accessorKey: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'period',
                header: 'Periode',
                cell: ({ row }) => row.original.period?.name || '-',
            },
            {
                accessorKey: 'joined_college_on',
                header: 'Tahun Masuk',
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
                            <DropdownMenuItem onClick={() => onView(row.original)}>
                                <Tag className="mr-2 h-4 w-4" /> Detail
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
        ],
        [],
    );

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
            {/* Perbaikan di sini: Pisahkan filter dan tombol aksi */}
            <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                {/* Grup Filter di sisi kiri */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-48">
                        <Input
                            type="search"
                            placeholder="Cari member..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-9"
                        />
                        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                    </div>

                    <Select
                        value={activePeriodId ? activePeriodId.toString() : 'all'}
                        onValueChange={(value) => {
                            router.get('/members', {
                                period_id: value,
                            });
                        }}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Semua Periode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                <Layers className="mr-2 inline h-4 w-4" /> Semua Periode
                            </SelectItem>
                            {periods.map((period) => (
                                <SelectItem key={period.id} value={period.id.toString()}>
                                    <Tag className="mr-2 inline h-4 w-4" />
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

                {/* Grup Tombol Aksi di sisi kanan, sekarang di baris terpisah untuk mobile */}
                <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
                    {/* Tombol Dropdown Ekspor */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <File className="mr-2 h-4 w-4" /> Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExport('excel')}>
                                <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel (.xlsx)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport('csv')}>
                                <FileText className="mr-2 h-4 w-4" /> CSV (.csv)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExport('pdf')}>
                                <FileText className="mr-2 h-4 w-4" /> PDF (.pdf)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Tombol untuk membuka modal import */}
                    <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" /> Import
                    </Button>
                </div>
            </div>

            {/* Tampilkan errors import dari sesi di sini */}
            {Array.isArray(errors_import) && errors_import.length > 0 && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                    <h3 className="mb-2 font-semibold">Gagal mengimpor file:</h3>
                    <ul className="list-inside list-disc space-y-1">
                        {errors_import.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

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
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className={row.index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-gray-50 dark:bg-zinc-800'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="border-r border-l dark:border-zinc-800 dark:text-zinc-100">
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

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Member?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus member ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteId) {
                                    router.delete(`/members/${deleteId}`, {
                                        onSuccess: () => toast.success('Member berhasil dihapus!'),
                                        onError: () => toast.error('Gagal menghapus member.'),
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

            <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Data Member</DialogTitle>
                        <DialogDescription>
                            Unggah file Excel (.xlsx) atau CSV (.csv) untuk menambahkan data member. Pastikan format kolom sesuai dengan template yang
                            ada.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleImportSubmit} className="space-y-4">
                        <Input type="file" onChange={handleFileChange} accept=".xlsx, .csv" className="w-full" />
                        {importData.file && <p className="text-muted-foreground text-sm">File terpilih: {importData.file.name}</p>}
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setIsImportModalOpen(false);
                                    resetImportForm();
                                }}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={!importData.file || importProcessing}>
                                {importProcessing ? 'Mengunggah...' : 'Import'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
