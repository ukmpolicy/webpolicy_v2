import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import AppLoading from '@/components/homepage/app-loading';
import { Head, Link, PageProps, router } from '@inertiajs/react'; // Import PageProps
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, ListFilter, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// --- DEFINISI TIPE UNTUK PROPS INERTIA ---
interface Category {
    id: number;
    name: string;
}

interface Author {
    id: number;
    name: string;
    picture?: string; // Tambahkan property picture
    role?: {
        // role bisa jadi null jika tidak eager-loaded atau tidak ada
        id: number;
        name: string;
    };
}

interface Article {
    id: number;
    title: string;
    picture?: string; // Bisa null
    slug: string;
    summary: string;
    content: string;
    author_id: number;
    status: 'draft' | 'published';
    created_at: string; // ISO 8601 string date
    updated_at: string;
    author: Author;
    categories: Category[];
}

interface ArticlesPaginationData {
    current_page: number;
    data: Article[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface BlogPageProps extends PageProps {
    articles: ArticlesPaginationData;
    categories: Category[];
    search?: string; // Bisa tidak ada
    per_page?: number; // Bisa tidak ada
    selected_category_id?: number; // Bisa tidak ada
}
// --- AKHIR DEFINISI TIPE ---

const BlogPage: React.FC<BlogPageProps> = ({
    articles,
    categories,
    search: initialSearch,
    per_page: initialPerPage,
    selected_category_id: initialSelectedCategoryId,
}) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const [currentSearch, setCurrentSearch] = useState<string>(initialSearch || '');
    const [currentCategoryId, setCurrentCategoryId] = useState<number | ''>(initialSelectedCategoryId || '');

    useEffect(() => {
        setCurrentSearch(initialSearch || '');
        setCurrentCategoryId(initialSelectedCategoryId || '');
    }, [initialSearch, initialSelectedCategoryId]);

    const applyFilters = (page: number = 1, newSearch: string = currentSearch, newCategoryId: number | '' = currentCategoryId) => {
        const queryParams: { page: number; per_page: number; search?: string; category_id?: number } = {
            page: page,
            per_page: initialPerPage || 6, // Default ke 6 jika tidak ada
        };

        if (newSearch) {
            queryParams.search = newSearch;
        }
        if (newCategoryId) {
            queryParams.category_id = newCategoryId;
        }

        router.get(route('blog.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = e.target.value;
        setCurrentSearch(newSearch);
        if (window._searchTimeout) {
            // Cek apakah properti window._searchTimeout ada sebelum clearTimeout
            clearTimeout(window._searchTimeout);
        }
        window._searchTimeout = setTimeout(() => {
            applyFilters(1, newSearch, currentCategoryId);
        }, 300);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategoryId = e.target.value === '' ? '' : parseInt(e.target.value, 10);
        setCurrentCategoryId(newCategoryId);
        applyFilters(1, currentSearch, newCategoryId);
    };

    const handlePaginationClick = (url: string | null) => {
        if (url) {
            const urlParams = new URLSearchParams(new URL(url).search);
            const page = parseInt(urlParams.get('page') || '1', 10);
            applyFilters(page, currentSearch, currentCategoryId);
        }
    };

    // --- VARIAN ANIMASI FRAMER MOTION ---
    const fadeInSlideUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const cardGridVariants = {
        visible: {
            opacity: 1,
            transition: {
                when: 'beforeChildren',
                staggerChildren: 0.1,
            },
        },
        hidden: { opacity: 0 },
    };

    const cardItemVariants = {
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
        hidden: { opacity: 0, y: 20 },
    };
    // --- AKHIR VARIAN ANIMASI ---

    interface ArticleCardProps {
        article: Article;
    }

    const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
        const getImageUrl = (path?: string): string => {
            // Tipe path bisa undefined
            return path ? `/storage/${path}` : '/images/default-blog-cover.jpg';
        };

        return (
            <Link
                href={route('blog.show', article.slug)}
                className="group relative block flex h-full transform flex-col overflow-hidden rounded-xl border border-transparent bg-zinc-900 shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-red-600 hover:shadow-2xl"
            >
                {article.picture && (
                    <div className="relative h-56 w-full overflow-hidden md:h-64">
                        <img
                            src={getImageUrl(article.picture)}
                            alt={article.title}
                            className="h-full w-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </div>
                )}

                <div className="flex flex-grow flex-col p-6">
                    <div className="mb-3 flex flex-wrap gap-2">
                        {article.categories.map((category) => (
                            <span
                                key={category.id}
                                className="inline-block rounded-full bg-red-800/20 px-2.5 py-0.5 text-xs font-semibold text-red-300"
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>

                    <h2 className="mb-2 line-clamp-2 text-lg font-extrabold text-white transition-colors duration-300 group-hover:text-red-500">
                        {article.title}
                    </h2>

                    <p className="mb-4 line-clamp-3 flex-grow text-sm leading-relaxed text-gray-400">{article.summary}</p>

                    <div className="mt-auto flex items-center justify-between border-t border-zinc-800 pt-4 text-xs text-gray-500">
                        <span className="flex items-center gap-3 font-medium text-gray-300">
                            {/* {article.author.role?.name || 'Divisi Tidak Diketahui'} */}
                            {/* <UserRound className="h-4 w-4 text-red-400" /> */}
                            <div className="h-8 w-8 overflow-hidden rounded-full">
                                <img
                                    className="h-full w-full object-cover"
                                    src={article.author?.picture ? getImageUrl(article.author?.picture) : '/assets/no-image.png'}
                                    alt="Gambar"
                                />
                            </div>
                            <div>
                                <div className="font-bold capitalize">{article.author.name || 'Penulis Tidak Diketahui'}</div>
                                <div className="opacity-70">Mincy</div>
                            </div>
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-gray-300">
                            <Calendar className="h-4 w-4 text-red-400" />
                            {new Date(article.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </Link>
        );
    };

    if (isLoading) return <AppLoading />;

    return (
        <>
            <Head title="Blog - UKM POLICY" />
            <AppHeader />
            <main className="min-h-screen bg-black pt-0 text-white">
                {/* Section Label (judul halaman) */}
                <motion.section className="relative overflow-hidden bg-black py-8">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-red-600/40 opacity-40 blur-[120px]" />
                        <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-white/10 opacity-10 blur-2xl" />
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="pt-12 pb-6 text-left md:pt-20">
                            {/* Breadcrumb: Home > Blog */}
                            <div className="mb-6 flex items-center text-xs md:text-sm">
                                <Link href={route('home')} className="font-medium text-gray-300 transition-colors duration-200 hover:text-red-400">
                                    Home
                                </Link>
                                <ChevronRight className="mx-2 h-4 w-4 text-white/60" />
                                <span className="font-bold text-red-500">Berita</span>
                            </div>
                            {/* Judul Utama: BLOG KAMI */}
                            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-3xl md:text-4xl">BERITA KAMI</h1>
                            {/* Deskripsi */}
                            <p className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                                Dapatkan informasi dan berita terbaru dari kami
                            </p>
                        </div>
                    </div>
                    {/* GARIS PEMISAH */}
                    <div className="w-full border-t border-neutral-800 px-4 sm:px-6 lg:px-8"></div>
                </motion.section>

                {/* Konten Artikel Blog */}
                <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeInSlideUp}
                        className="mb-20 flex flex-col items-center justify-between gap-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md md:flex-row"
                    >
                        <div className="relative w-full md:w-1/2">
                            <input
                                type="text"
                                placeholder="Cari artikel berdasarkan judul atau ringkasan..."
                                value={currentSearch}
                                onChange={handleSearchChange}
                                className="w-full rounded-md border-zinc-700 bg-zinc-800 py-3 pr-12 pl-4 text-white placeholder-gray-500 shadow-sm focus:border-red-500 focus:ring-red-500"
                            />
                            <Search className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative w-full md:w-1/4">
                            <select
                                value={currentCategoryId}
                                onChange={handleCategoryChange}
                                className="w-full appearance-none rounded-md border-zinc-700 bg-zinc-800 py-3 pr-12 pl-4 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                        className="bg-zinc-800 text-white hover:bg-red-600 hover:text-white"
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <ListFilter className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        </div>
                    </motion.div>
                    {articles.data.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={cardGridVariants}
                            className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {articles.data.map((article) => (
                                <motion.div key={article.id} variants={cardItemVariants}>
                                    <ArticleCard article={article} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.p
                            initial="initial"
                            animate="animate"
                            variants={fadeInSlideUp}
                            className="rounded-lg border border-zinc-800 bg-zinc-900/50 py-10 text-center text-lg text-gray-400"
                        >
                            Tidak ada artikel yang ditemukan untuk kriteria ini.
                        </motion.p>
                    )}
                    {/* Pagination */}
                    {articles.links && articles.links.length > 3 && (
                        <motion.div initial="initial" animate="animate" variants={fadeInSlideUp} className="mt-20 flex justify-center space-x-2">
                            {articles.links.map(
                                (
                                    link, // Hapus index karena tidak digunakan jika key sudah ada
                                ) => (
                                    <button
                                        key={link.label} // Menggunakan link.label sebagai key, pastikan unik
                                        onClick={() => handlePaginationClick(link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                                            link.active ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''} `}
                                    />
                                ),
                            )}
                        </motion.div>
                    )}
                </section>
            </main>
            <AppFooter />
        </>
    );
};

export default BlogPage;
