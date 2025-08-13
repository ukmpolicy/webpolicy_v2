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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import { Ellipsis, GripVertical, List, Pencil, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// Import Dnd Kit
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
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const intPart = (lvl) => Math.floor(lvl);

// Komponen Baris yang Bisa Diseret (Sortable Row)
const SortableTableRow = ({ structure, index, onEdit, renderActions, pageIndex, pageSize }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: structure.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow ref={setNodeRef} style={style} className="group transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800">
            <TableCell {...attributes} {...listeners} className="cursor-grab">
                <GripVertical className="text-muted-foreground h-4 w-4" />
            </TableCell>
            <TableCell>{index + 1 + pageIndex * pageSize}</TableCell>
            <TableCell>{structure.name}</TableCell>
            <TableCell>{structure.division?.name || '-'}</TableCell>
            {/* <TableCell>{structure.level}</TableCell> <-- Kolom ini dihilangkan */}
            <TableCell className="w-10 pr-4 text-right">{renderActions(structure)}</TableCell>
        </TableRow>
    );
};

// Fungsi helper untuk menghitung ulang level
const recomputeLevels = (items) => {
    const newItems = [...items];
    const divisionSubLevelCounters = new Map();
    let mainLevel = 0;

    for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];

        if (item.division_id === null) {
            mainLevel++;
            item.level = parseFloat(mainLevel.toFixed(1));
            divisionSubLevelCounters.clear();
        } else {
            const parent = newItems
                .slice(0, i)
                .reverse()
                .find((parent) => parent.division_id === null);
            const baseLevel = parent ? intPart(parent.level) : 1;

            const currentSubLevel = divisionSubLevelCounters.get(baseLevel) || 0;
            const newSubLevel = currentSubLevel + 1;
            divisionSubLevelCounters.set(baseLevel, newSubLevel);

            item.level = parseFloat(`${baseLevel}.${newSubLevel}`);
        }
    }
    return newItems;
};

export function StructureTable({ data, onEdit }) {
    const { periods = [], selectedPeriodId } = usePage().props;

    const [selectedPeriod, setSelectedPeriod] = useState(selectedPeriodId?.toString() || periods.find((p) => p.is_active)?.id?.toString() || '');
    const [structures, setStructures] = useState([...data]);
    const [deleteId, setDeleteId] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        setStructures([...data].sort((a, b) => a.level - b.level));
    }, [data]);

    const handleFilterChange = (value) => {
        setSelectedPeriod(value);
        setPageIndex(0);
        Inertia.get(
            '/structures',
            { period_id: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id === over.id) return;

        const allVisibleRows = filteredAndSearchedData;

        const oldIndex = allVisibleRows.findIndex((item) => item.id === active.id);
        const newIndex = allVisibleRows.findIndex((item) => item.id === over.id);
        const reorderedVisibleData = arrayMove(allVisibleRows, oldIndex, newIndex);

        const otherData = structures.filter((s) => String(s.period_id) !== String(selectedPeriod));
        const updatedStructures = recomputeLevels([...reorderedVisibleData, ...otherData]);

        const levels = updatedStructures.map((s) => s.level);
        if (new Set(levels).size !== levels.length) {
            toast.error('Gagal mengurutkan, level duplikat terdeteksi. Silakan coba lagi.');
            return;
        }

        const changes = updatedStructures.filter((s) => String(s.period_id) === String(selectedPeriod)).map(({ id, level }) => ({ id, level }));

        if (changes.length > 0) {
            Inertia.post(
                '/structures/reorder',
                { data: changes },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Urutan berhasil disimpan');
                        setStructures(updatedStructures);
                    },
                    onError: () => toast.error('Gagal menyimpan urutan'),
                },
            );
        }
    };

    const renderActions = (structure) => {
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
                    <DropdownMenuItem className="text-red-600" onClick={() => setDeleteId(structure.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    const filteredAndSearchedData = useMemo(() => {
        let result = structures.filter((s) => String(s.period_id) === String(selectedPeriod));

        if (globalFilter) {
            result = result.filter(
                (item) =>
                    item.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
                    (item.division?.name && item.division.name.toLowerCase().includes(globalFilter.toLowerCase())),
            );
        }

        return result.sort((a, b) => a.level - b.level);
    }, [structures, selectedPeriod, globalFilter]);

    const paginatedData = useMemo(() => {
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        return filteredAndSearchedData.slice(start, end);
    }, [filteredAndSearchedData, pageIndex, pageSize]);

    const pageCount = Math.ceil(filteredAndSearchedData.length / pageSize);

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

    const ids = useMemo(() => paginatedData.map(({ id }) => id), [paginatedData]);

    return (
        <>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                <div className="relative w-64">
                    <Input
                        type="search"
                        placeholder="Cari struktur..."
                        value={globalFilter}
                        onChange={(e) => {
                            setGlobalFilter(e.target.value);
                            setPageIndex(0);
                        }}
                        className="pl-8"
                    />
                    <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
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
                <Select
                    value={String(pageSize)}
                    onValueChange={(v) => {
                        setPageSize(Number(v));
                        setPageIndex(0);
                    }}
                >
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

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Table className="overflow-hidden rounded-lg border">
                    <TableHeader className="bg-gray-50 dark:bg-zinc-900">
                        <TableRow>
                            <TableHead className="w-10 font-bold"></TableHead>
                            <TableHead className="w-10 font-bold">#</TableHead>
                            <TableHead className="font-bold">Nama Struktur</TableHead>
                            <TableHead className="font-bold">Divisi</TableHead>
                            <TableHead className="w-10 pr-4 text-right font-bold">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200 dark:divide-zinc-700">
                        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                            {paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        Tidak ada data struktur.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((structure, index) => (
                                    <SortableTableRow
                                        key={structure.id}
                                        structure={structure}
                                        index={index}
                                        onEdit={onEdit}
                                        renderActions={renderActions}
                                        pageIndex={pageIndex}
                                        pageSize={pageSize}
                                    />
                                ))
                            )}
                        </SortableContext>
                    </TableBody>
                </Table>
            </DndContext>

            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={(e) => {
                                e.preventDefault();
                                if (pageIndex > 0) setPageIndex(pageIndex - 1);
                            }}
                            href="#"
                        />
                    </PaginationItem>
                    {(() => {
                        const range = getPaginationRange(pageIndex, pageCount);
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
                                            isActive={i === pageIndex}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPageIndex(i);
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
                                if (pageIndex < pageCount - 1) setPageIndex(pageIndex + 1);
                            }}
                            href="#"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogTitle>Hapus Struktur?</AlertDialogTitle>
                    <AlertDialogDescription>Yakin ingin menghapus struktur ini? Tindakan ini tidak bisa dibatalkan.</AlertDialogDescription>
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
