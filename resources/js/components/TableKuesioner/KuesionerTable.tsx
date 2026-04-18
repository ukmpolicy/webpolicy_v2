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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, GripVertical, List, Pencil, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function KuesionerTable({ data, onEdit }) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    // Filter
    const filtered = data.filter((item: any) =>
        item.pertanyaan?.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const pageCount = Math.ceil(filtered.length / pageSize);
    const safePageIndex = Math.min(pageIndex, Math.max(0, pageCount - 1));
    const startIndex = safePageIndex * pageSize;
    const paged = filtered.slice(startIndex, startIndex + pageSize);

    const goToPage = (p: number) => setPageIndex(Math.max(0, Math.min(p, pageCount - 1)));

    const handleSearchChange = (val: string) => {
        setSearch(val);
        setPageIndex(0);
    };

    const handlePageSizeChange = (val: string) => {
        setPageSize(Number(val));
        setPageIndex(0);
    };

    function getPaginationRange(current: number, total: number) {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i);
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
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="relative w-full sm:w-64">
                    <Input
                        type="search"
                        placeholder="Cari pertanyaan..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9 bg-background"
                    />
                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">Tampilkan:</span>
                    <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                        <SelectTrigger className="w-24 bg-background">
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
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border shadow-sm bg-card">
                <div className="overflow-x-auto">
                    <Table className="w-full text-sm">
                        <TableHeader>
                            <TableRow className="border-b bg-muted/50">
                                <TableHead className="py-3 px-3 font-semibold text-foreground w-8"></TableHead>
                                <TableHead className="py-3 px-4 font-semibold text-foreground w-12">#</TableHead>
                                <TableHead className="py-3 px-4 font-semibold text-foreground">Pertanyaan</TableHead>
                                <TableHead className="py-3 px-4 font-semibold text-foreground">Status</TableHead>
                                <TableHead className="py-3 px-4 font-semibold text-foreground text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paged.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                        Tidak ada pertanyaan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paged.map((item: any, i: number) => (
                                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="px-3 py-3 text-muted-foreground">
                                            <GripVertical size={14} className="cursor-grab" />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-muted-foreground">
                                            {startIndex + i + 1}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 max-w-lg">{item.pertanyaan}</TableCell>
                                        <TableCell className="px-4 py-3">
                                            {item.is_active ? (
                                                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-400">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                    Nonaktif
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => onEdit(item)}>
                                                    <Pencil size={13} />
                                                </Button>
                                                <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => setDeleteId(item.id)}>
                                                    <Trash2 size={13} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
                <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan {startIndex + 1}–{Math.min(startIndex + pageSize, filtered.length)} dari {filtered.length} data
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline" size="icon" className="h-8 w-8"
                            disabled={safePageIndex === 0}
                            onClick={() => goToPage(safePageIndex - 1)}
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        {getPaginationRange(safePageIndex, pageCount).map((p, idx, arr) => {
                            const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                            return (
                                <span key={p} className="flex items-center gap-1">
                                    {showEllipsis && <span className="px-1 text-muted-foreground">…</span>}
                                    <Button
                                        variant={safePageIndex === p ? 'default' : 'outline'}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => goToPage(p)}
                                    >
                                        {p + 1}
                                    </Button>
                                </span>
                            );
                        })}
                        <Button
                            variant="outline" size="icon" className="h-8 w-8"
                            disabled={safePageIndex >= pageCount - 1}
                            onClick={() => goToPage(safePageIndex + 1)}
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pertanyaan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Pastikan pertanyaan ini tidak digunakan, atau ubah statusnya menjadi Nonaktif. Tindakan hapus ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteId) {
                                    router.delete(`/pertanyaan-kuesioner/${deleteId}`, {
                                        preserveScroll: true,
                                        onSuccess: () => toast.success('Pertanyaan berhasil dihapus.'),
                                        onError: () => toast.error('Gagal menghapus pertanyaan.'),
                                    });
                                    setDeleteId(null);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
