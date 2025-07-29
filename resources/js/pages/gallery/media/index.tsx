import { MediaFormModal } from '@/components/TableMedia/MediaFormModal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';
import { List, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';

export default function MediaIndex() {
    const {
        media = {},
        albums = [],
        selected_album_id, // Ini adalah nilai dari URL/backend
        success,
        error,
        errors,
        search: searchQuery,
        per_page,
        media_type: mediaTypeQuery, // Ini adalah nilai dari URL/backend
    } = usePage().props;

    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [preview, setPreview] = useState(null);
    const previewRef = useRef(null);
    const [moveData, setMoveData] = useState<{ id: number; album_id: string } | null>(null);

    // State lokal yang akan sinkron dengan props dari backend
    const [selectedAlbumId, setSelectedAlbumId] = useState<string>(selected_album_id ? String(selected_album_id) : 'all');
    const [mediaType, setMediaType] = useState(mediaTypeQuery || 'all');
    const [globalFilter, setGlobalFilter] = useState(searchQuery || '');
    const [perPage, setPerPage] = useState(per_page || 5);

    const filteredMedia = media.data || [];
    const paginationLinks = media.links || [];

    // Gunakan useEffect untuk sinkronisasi state lokal dengan props dari Inertia
    // Ini penting agar Select menunjukkan nilai yang benar setelah navigasi/reload
    useEffect(() => {
        setSelectedAlbumId(selected_album_id ? String(selected_album_id) : 'all');
    }, [selected_album_id]); // Trigger saat selected_album_id dari props berubah

    useEffect(() => {
        setMediaType(mediaTypeQuery || 'all');
    }, [mediaTypeQuery]); // Trigger saat mediaTypeQuery dari props berubah

    useEffect(() => {
        if (success) toast.success(success);
        if (error) toast.error(error);
        if (errors?.file) toast.error(errors.file);
    }, [success, error, errors]);

    useEffect(() => {
        if (!preview) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') setPreview(null);
        }
        function handleClickOutside(e: MouseEvent) {
            if (previewRef.current && !previewRef.current.contains(e.target as Node)) setPreview(null);
        }
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [preview]);

    const debouncedSearch = useDebouncedCallback((value: string) => {
        Inertia.get(
            '/gallery-media',
            {
                album_id: selectedAlbumId !== 'all' ? selectedAlbumId : undefined,
                search: value,
                per_page: perPage,
                media_type: mediaType !== 'all' ? mediaType : undefined,
            },
            { preserveScroll: true, replace: true },
        );
    }, 500);

    const goToPage = (url) => {
        if (url) {
            Inertia.get(url, {}, { preserveScroll: true });
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Gallery', href: '#' },
                { title: 'Albums', href: '/gallery-album' },
                { title: 'Media', href: '/gallery-media' },
            ]}
        >
            <Head title="Galeri Media" />
            <>
                <div className="flex flex-col gap-6 rounded-xl p-4">
                    {/* Header and Add Button */}
                    <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="mb-1 text-2xl font-bold">Galeri Media</h1>
                            <p className="text-sm text-gray-500">Kumpulan foto & video dari berbagai album.</p>
                        </div>
                        <Button
                            onClick={() => {
                                setEditData(null);
                                setOpen(true);
                            }}
                            className="gap-2"
                        >
                            <Plus className="w-4" /> Tambah Media
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        {/* Album Filter - PERBAIKAN TAMPILAN SelectValue */}
                        <div className="w-full sm:w-48">
                            <Select
                                value={selectedAlbumId}
                                onValueChange={(val) => {
                                    setSelectedAlbumId(val);
                                    Inertia.get(
                                        '/gallery-media',
                                        {
                                            album_id: val !== 'all' ? val : undefined,
                                            search: globalFilter,
                                            per_page: perPage,
                                            media_type: mediaType !== 'all' ? mediaType : undefined,
                                        },
                                        { preserveScroll: true },
                                    );
                                }}
                            >
                                <SelectTrigger>
                                    {/* LOGIKA PERBAIKAN UNTUK MENAMPILKAN NAMA ALBUM YANG DIPILIH */}
                                    <SelectValue>
                                        {selectedAlbumId === 'all'
                                            ? 'Semua Album'
                                            : albums.find((album) => String(album.id) === selectedAlbumId)?.name || 'Pilih Album'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Album</SelectItem>
                                    {albums.map((album) => (
                                        <SelectItem key={album.id} value={String(album.id)}>
                                            {album.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Media Type Filter - KONFIRMASI TAMPILAN SelectValue */}
                        <div className="w-full sm:w-48">
                            <Select
                                value={mediaType}
                                onValueChange={(val) => {
                                    setMediaType(val);
                                    Inertia.get(
                                        '/gallery-media',
                                        {
                                            album_id: selectedAlbumId !== 'all' ? selectedAlbumId : undefined,
                                            search: globalFilter,
                                            per_page: perPage,
                                            media_type: val !== 'all' ? val : undefined,
                                        },
                                        { preserveScroll: true },
                                    );
                                }}
                            >
                                <SelectTrigger>
                                    {/* LOGIKA INI SEHARUSNYA SUDAH BENAR, TERGANTUNG mediaType dari props */}
                                    <SelectValue>{mediaType === 'image' ? 'Gambar' : mediaType === 'video' ? 'Video' : 'Semua'}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    <SelectItem value="image">Gambar</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Search and Per Page */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <div className="relative w-48">
                            <Input
                                type="search"
                                placeholder="Cari caption..."
                                value={globalFilter}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setGlobalFilter(value);
                                    debouncedSearch(value);
                                }}
                                className="pl-9"
                            />
                            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                        </div>
                        <Select
                            value={String(perPage)}
                            onValueChange={(v) => {
                                setPerPage(Number(v));
                                Inertia.get(
                                    '/gallery-media',
                                    {
                                        album_id: selectedAlbumId !== 'all' ? selectedAlbumId : undefined,
                                        search: globalFilter,
                                        per_page: v,
                                        media_type: mediaType !== 'all' ? mediaType : undefined,
                                    },
                                    { preserveScroll: true },
                                );
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

                    {/* Media Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {filteredMedia.length === 0 ? (
                            <div className="col-span-full py-16 text-center text-gray-400">
                                <span className="text-4xl">📁</span>
                                <div className="mt-2">Belum ada media yang ditemukan.</div>
                            </div>
                        ) : (
                            filteredMedia.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative overflow-hidden rounded-xl border bg-white shadow-lg transition hover:shadow-2xl dark:bg-zinc-900"
                                >
                                    <div
                                        className="flex h-52 w-full cursor-pointer items-center justify-center bg-gray-100"
                                        onClick={() => setPreview(item)}
                                    >
                                        {/* Gunakan thumbnail_file untuk tampilan grid */}
                                        {item.mimetype.startsWith('image/') ? (
                                            <img
                                                src={`/storage/${item.thumbnail_file || item.file}`} // Gunakan thumbnail jika ada
                                                alt={item.caption || 'Media'}
                                                className="h-full w-full object-cover transition group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : item.mimetype.startsWith('video/') ? (
                                            <video
                                                src={`/storage/${item.thumbnail_file || item.file}`} // Untuk video, Anda mungkin ingin placeholder atau thumbnail video
                                                className="h-full w-full object-cover transition group-hover:scale-105"
                                                muted
                                                playsInline
                                                preload="none"
                                            />
                                        ) : (
                                            <div className="text-gray-400">Tidak dapat ditampilkan</div>
                                        )}
                                    </div>
                                    <span className="absolute top-2 left-2 rounded bg-blue-600 px-2 py-0.5 text-xs text-white shadow">
                                        {item.album?.name || '-'}
                                    </span>
                                    {/* PERUBAHAN DI SINI UNTUK IKON EDIT/PINDAH/HAPUS */}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button
                                            size="icon"
                                            // Hapus variant="outline"
                                            className="bg-white/80 hover:bg-blue-100 dark:bg-zinc-800 dark:hover:bg-blue-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditData(item);
                                                setOpen(true);
                                            }}
                                        >
                                            <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            // Hapus variant="outline"
                                            className="bg-white/80 hover:bg-yellow-100 dark:bg-zinc-800 dark:hover:bg-yellow-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMoveData({ id: item.id, album_id: String(item.album_id) });
                                            }}
                                            title="Pindah Album"
                                        >
                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                                <path
                                                    d="M8 17l4 4 4-4m-4-5v9M20 12a8 8 0 11-16 0 8 8 0 0116 0z"
                                                    // Atur warna stroke secara eksplisit untuk dark mode
                                                    stroke="#eab308" // Warna default (light mode)
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    // Tambahkan atribut class untuk dark mode jika diperlukan secara spesifik
                                                    // Jika #eab308 sudah cukup terlihat, tidak perlu dark:stroke
                                                />
                                            </svg>
                                        </Button>
                                        <Button
                                            size="icon"
                                            // Hapus variant="outline"
                                            className="bg-white/80 hover:bg-red-100 dark:bg-zinc-800 dark:hover:bg-red-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteId(item.id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        </Button>
                                    </div>
                                    <div className="p-4">
                                        <div className="truncate font-semibold">
                                            {item.caption || <span className="text-gray-400 italic">Tanpa caption</span>}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-400">Dibuat: {new Date(item.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {paginationLinks.length > 3 && (
                        <div className="mt-6 flex items-center justify-between gap-2">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Menampilkan {media.from || 0} sampai {media.to || 0} dari {media.total || 0} media
                            </span>
                            <div className="flex gap-2">
                                {paginationLinks.map((link, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => goToPage(link.url)}
                                        disabled={!link.url}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        className={
                                            link.label.includes('Previous') || link.label.includes('Next')
                                                ? 'px-4'
                                                : 'flex h-8 w-8 items-center justify-center'
                                        }
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modals */}
                <MediaFormModal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setEditData(null);
                    }}
                    initialData={editData}
                    albums={albums}
                    selectedAlbumId={selectedAlbumId === 'all' ? null : selectedAlbumId}
                />

                {preview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                        <div ref={previewRef} className="relative w-fit max-w-2xl rounded-xl bg-white p-4 shadow-lg dark:bg-zinc-900">
                            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={() => setPreview(null)}>
                                <X className="h-6 w-6" />
                            </button>
                            <div className="flex flex-col items-center p-4">
                                {preview.mimetype.startsWith('image/') ? (
                                    <img
                                        src={`/storage/${preview.file}`} // Tetap gunakan file asli untuk preview besar
                                        alt={preview.caption || 'Media'}
                                        className="mb-4 max-h-[50vh] w-auto rounded"
                                    />
                                ) : preview.mimetype.startsWith('video/') ? (
                                    <video src={`/storage/${preview.file}`} controls className="mb-4 max-h-[50vh] w-auto rounded" />
                                ) : (
                                    <div className="text-gray-400">Tidak dapat ditampilkan</div>
                                )}
                                <div className="max-h-[150px] w-full overflow-y-auto px-4 pt-2 pb-4 text-left text-lg leading-snug font-bold">
                                    {preview.caption || <span className="text-gray-400 italic">Tanpa caption</span>}
                                </div>
                                <div className="mt-1 text-sm text-gray-500">Album: {preview.album?.name || '-'}</div>
                                <div className="mt-1 text-xs text-gray-400">Dibuat: {new Date(preview.created_at).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                )}

                <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Hapus Media?</DialogTitle>
                        </DialogHeader>
                        <div className="mb-4 text-gray-600">Apakah Anda yakin ingin menghapus media ini? Tindakan ini tidak dapat dibatalkan.</div>
                        <DialogFooter>
                            <Button variant="secondary" onClick={() => setDeleteId(null)}>
                                Batal
                            </Button>
                            <Button
                                onClick={() => {
                                    Inertia.delete(`/gallery-media/${deleteId}`, {
                                        onSuccess: () => {
                                            toast.success('Berhasil hapus Media');
                                            setDeleteId(null);
                                        },
                                        onError: () => toast.error('Gagal hapus Media'),
                                    });
                                }}
                            >
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={!!moveData} onOpenChange={() => setMoveData(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Pindah Album</DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!moveData) return;
                                Inertia.post(
                                    `/gallery-media/${moveData.id}/move`,
                                    { album_id: moveData.album_id },
                                    {
                                        onSuccess: () => {
                                            toast.success('Media berhasil dipindahkan');
                                            setMoveData(null);
                                        },
                                        onError: (err) => {
                                            toast.error(err?.album_id || 'Gagal memindahkan media');
                                        },
                                    },
                                );
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="mb-1 block text-sm font-medium">Pilih Album Tujuan</label>
                                <Select
                                    value={moveData?.album_id || ''}
                                    onValueChange={(val) => setMoveData(moveData ? { ...moveData, album_id: val } : null)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Album" />
                                    </SelectTrigger>
                                    {/* Scroll bar ditambahkan di sini, max-h-48 dan overflow-y-auto */}
                                    <SelectContent className="max-h-48 overflow-y-auto">
                                        {albums.map((album) => (
                                            <SelectItem key={album.id} value={String(album.id)}>
                                                {album.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button variant="secondary" type="button" onClick={() => setMoveData(null)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={!moveData?.album_id}>
                                    Pindahkan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </>
        </AppLayout>
    );
}
