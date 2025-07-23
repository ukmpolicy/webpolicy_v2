import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';
import { Eye, List, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';

export default function ArticleIndex() {
    const { articles = {}, categories = [], selected_category_id, success, error, errors, search: searchQuery, per_page } = usePage().props;

    const [deleteId, setDeleteId] = useState(null);
    const [previewArticle, setPreviewArticle] = useState(null); // Ini bisa dihapus jika modal preview sepenuhnya dihapus

    const [selectedCategoryId, setSelectedCategoryId] = useState(selected_category_id ? String(selected_category_id) : 'all');
    const [globalFilter, setGlobalFilter] = useState(searchQuery || '');
    const [perPage, setPerPage] = useState(per_page || 10);

    const filteredArticles = articles.data || [];
    const paginationLinks = articles.links || [];

    useEffect(() => {
        setSelectedCategoryId(selected_category_id ? String(selected_category_id) : 'all');
        setGlobalFilter(searchQuery || '');
        setPerPage(per_page || 10);
    }, [selected_category_id, searchQuery, per_page]);

    useEffect(() => {
        if (success) toast.success(success);
        if (error) toast.error(error);
        if (errors) {
            for (const key in errors) {
                const errorMessage = errors[key];
                if (typeof errorMessage === 'string') {
                    toast.error(errorMessage);
                } else if (Array.isArray(errorMessage)) {
                    errorMessage.forEach((msg) => toast.error(msg));
                }
            }
        }
    }, [success, error, errors]);

    const buildQueryParams = (pageUrl = null) => {
        const params = {};

        if (pageUrl) {
            const url = new URL(pageUrl);
            const page = url.searchParams.get('page');
            if (page) {
                params.page = page;
            }
        } else {
            params.page = 1;
        }

        if (selectedCategoryId !== 'all') {
            params.category_id = selectedCategoryId;
        }
        if (globalFilter) {
            params.search = globalFilter;
        }
        if (perPage) {
            params.per_page = perPage;
        }

        return params;
    };

    const goToPage = (url) => {
        if (url) {
            const params = buildQueryParams(url);
            Inertia.get('/articles', params, { preserveScroll: true, replace: true });
        }
    };

    const handleFilterChange = (filterName, value) => {
        let newSelectedCategoryId = selectedCategoryId;
        let newGlobalFilter = globalFilter;
        let newPerPage = perPage;

        if (filterName === 'category_id') {
            newSelectedCategoryId = value;
            setSelectedCategoryId(value);
        } else if (filterName === 'search') {
            newGlobalFilter = value;
            setGlobalFilter(value);
        } else if (filterName === 'per_page') {
            newPerPage = value;
            setPerPage(value);
        }

        if (filterName === 'search') {
            debouncedSearch.cancel();
            debouncedSearch(newGlobalFilter);
        } else {
            const params = {
                page: 1,
            };
            if (newSelectedCategoryId !== 'all') params.category_id = newSelectedCategoryId;
            if (newGlobalFilter) params.search = newGlobalFilter;
            if (newPerPage) params.per_page = newPerPage;

            Inertia.get('/articles', params, { preserveScroll: true, replace: true });
        }
    };

    const debouncedSearch = useDebouncedCallback((value) => {
        const params = {
            page: 1,
        };
        if (selectedCategoryId !== 'all') params.category_id = selectedCategoryId;
        if (value) params.search = value;
        if (perPage) params.per_page = perPage;

        Inertia.get('/articles', params, { preserveScroll: true, replace: true });
    }, 500);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Blog', href: '#' },
                { title: 'Kategori Artikel', href: '/category-articles' },
                { title: 'Artikel', href: '/articles' },
            ]}
        >
            <Head title="Manajemen Artikel" />
            <>
                <div className="flex flex-col gap-6 rounded-xl p-4">
                    {/* Header and Add Button */}
                    <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="mb-1 text-2xl font-bold">Manajemen Artikel</h1>
                            <p className="text-sm text-gray-500">Kelola daftar artikel blog Anda.</p>
                        </div>
                        <Button
                            onClick={() => {
                                Inertia.visit('/articles/create');
                            }}
                            className="gap-2"
                        >
                            <Plus className="w-4" /> Tambah Artikel
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        {/* Category Filter */}
                        <div className="w-full sm:w-48">
                            <Select value={selectedCategoryId} onValueChange={(val) => handleFilterChange('category_id', val)}>
                                <SelectTrigger>
                                    <SelectValue>
                                        {selectedCategoryId === 'all'
                                            ? 'Semua Kategori'
                                            : categories.find((cat) => String(cat.id) === selectedCategoryId)?.name || 'Pilih Kategori'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key="all-cat" value="all">
                                        Semua Kategori
                                    </SelectItem>{' '}
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Search and Per Page */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <div className="relative w-48">
                            <Input
                                type="search"
                                placeholder="Cari judul/summary..."
                                value={globalFilter}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="pl-9"
                            />
                            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                        </div>
                        <Select value={String(perPage)} onValueChange={(v) => handleFilterChange('per_page', Number(v))}>
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

                    {/* Article List Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredArticles.length === 0 ? (
                            <div className="col-span-full py-16 text-center text-gray-400">
                                <span className="text-4xl">📝</span>
                                <div className="mt-2">Belum ada artikel yang ditemukan.</div>
                            </div>
                        ) : (
                            filteredArticles.map((article) => (
                                <div
                                    key={article.id}
                                    className="group relative overflow-hidden rounded-xl border bg-white shadow-lg transition hover:shadow-2xl dark:bg-zinc-900"
                                >
                                    <div className="h-48 w-full overflow-hidden">
                                        {article.picture ? (
                                            <img
                                                src={`/storage/${article.picture}`}
                                                alt={article.title}
                                                className="h-full w-full object-cover transition group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-zinc-800">
                                                Tidak ada Gambar
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button
                                            size="icon"
                                            className="bg-white/80 hover:bg-blue-100 dark:bg-zinc-800 dark:hover:bg-blue-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                Inertia.visit(`/articles/${article.id}`); // Perubahan di sini!
                                            }}
                                            title="Lihat Artikel"
                                        >
                                            <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            className="bg-white/80 hover:bg-yellow-100 dark:bg-zinc-800 dark:hover:bg-yellow-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                Inertia.visit(`/articles/${article.id}/edit`);
                                            }}
                                            title="Edit Artikel"
                                        >
                                            <Pencil className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            className="bg-white/80 hover:bg-red-100 dark:bg-zinc-800 dark:hover:bg-red-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteId(article.id);
                                            }}
                                            title="Hapus Artikel"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        </Button>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-2 line-clamp-2 min-h-[48px] font-bold">{article.title}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Penulis: {article.author?.name || 'N/A'}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Status: {article.status === 'published' ? 'Terbit' : 'Draf'}
                                        </div>
                                        <div className="mt-2 text-xs text-gray-400">
                                            Kategori:{' '}
                                            {article.categories && article.categories.length > 0
                                                ? article.categories.map((cat) => cat.name).join(', ')
                                                : '-'}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-400">Dibuat: {new Date(article.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {paginationLinks.length > 3 && (
                        <div className="mt-6 flex items-center justify-between gap-2">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Menampilkan {articles.from || 0} sampai {articles.to || 0} dari {articles.total || 0} artikel
                            </span>
                            <div className="flex gap-2">
                                {paginationLinks.map((link, index) => (
                                    <Button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goToPage(link.url);
                                        }}
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

                {/* Hapus bagian Preview Article Modal jika tidak ingin ada popup sama sekali */}
                {/* {previewArticle && (
                    <Dialog open={!!previewArticle} onOpenChange={() => setPreviewArticle(null)}>
                        <DialogContent className="max-w-4xl p-0">
                            <DialogHeader className="relative p-6 pb-0">
                                <DialogTitle className="text-2xl font-bold">{previewArticle.title}</DialogTitle>
                                <Button variant="ghost" size="icon" onClick={() => setPreviewArticle(null)} className="absolute top-2 right-2">
                                    <X className="h-5 w-5" />
                                </Button>
                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Penulis: {previewArticle.author?.name || 'N/A'} | Kategori:{' '}
                                    {previewArticle.categories && previewArticle.categories.length > 0
                                        ? previewArticle.categories.map((cat) => cat.name).join(', ')
                                        : '-'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                    Status: {previewArticle.status === 'published' ? 'Terbit' : 'Draf'} | Dibuat:{' '}
                                    {new Date(previewArticle.created_at).toLocaleString()}
                                </div>
                            </DialogHeader>
                            <div className="max-h-[70vh] overflow-y-auto p-6">
                                {previewArticle.picture && (
                                    <img
                                        src={`/storage/${previewArticle.picture}`}
                                        alt={previewArticle.title}
                                        className="mb-6 w-full rounded-lg object-cover"
                                    />
                                )}
                                <div className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">{previewArticle.summary}</div>
                                <TuiViewer content={previewArticle.content} />
                            </div>
                            <DialogFooter className="p-6 pt-0">
                                <Button variant="secondary" onClick={() => setPreviewArticle(null)}>
                                    Tutup
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )} */}

                {/* Delete Confirmation Dialog */}
                <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Hapus Artikel?</DialogTitle>
                        </DialogHeader>
                        <div className="mb-4 text-gray-600">Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.</div>
                        <DialogFooter>
                            <Button variant="secondary" onClick={() => setDeleteId(null)}>
                                Batal
                            </Button>
                            <Button
                                onClick={() => {
                                    Inertia.delete(`/articles/${deleteId}`, {
                                        onSuccess: () => {
                                            toast.success('Artikel berhasil dihapus!');
                                            setDeleteId(null);
                                        },
                                        onError: () => toast.error('Gagal menghapus artikel.'),
                                    });
                                }}
                            >
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        </AppLayout>
    );
}
