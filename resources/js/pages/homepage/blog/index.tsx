import { Link, PageProps, router } from '@inertiajs/react';
import { motion } from 'framer-motion'; // Import motion dari framer-motion
import React, { useEffect, useState } from 'react';

// Mengimpor komponen-komponen yang sudah dipecah
import AppLoading from '@/components/homepage/app-loading';
import ArticleCard from '@/components/homepage/blog/ArticleCard';
import BlogFilter from '@/components/homepage/blog/BlogFilter';
import BlogLayout from '@/components/homepage/blog/BlogLayout';
import Pagination from '@/components/homepage/blog/Pagination';
import { ChevronRight } from 'lucide-react';

// --- DEFINISI ULANG TIPE UNTUK PROPS INERTIA ---
interface Category {
    id: number;
    name: string;
}

interface Author {
    id: number;
    name: string;
    picture?: string;
    role?: {
        id: number;
        name: string;
    };
}

interface Article {
    id: number;
    title: string;
    picture?: string;
    slug: string;
    summary: string;
    content: string;
    author_id: number;
    status: 'draft' | 'published';
    created_at: string;
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
    search?: string;
    per_page?: number;
    selected_category_id?: number;
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
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const [currentSearch, setCurrentSearch] = useState<string>(initialSearch || '');
    const [currentCategoryId, setCurrentCategoryId] = useState<number | ''>(initialSelectedCategoryId || '');

    useEffect(() => {
        setCurrentSearch(initialSearch || '');
        setCurrentCategoryId(initialSelectedCategoryId || '');
    }, [initialSearch, initialSelectedCategoryId]);

    const handlePaginationClick = (url: string | null) => {
        if (url) {
            const urlParams = new URLSearchParams(new URL(url).search);
            const page = parseInt(urlParams.get('page') || '1', 10);

            const queryParams: { page: number; per_page: number; search?: string; category_id?: number } = {
                page: page,
                per_page: initialPerPage || 6,
            };

            if (currentSearch) {
                queryParams.search = currentSearch;
            }
            if (currentCategoryId) {
                queryParams.category_id = currentCategoryId;
            }

            router.get(url, queryParams, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    // Varian animasi untuk elemen-elemen
    const fadeInSlideUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const cardGridVariants = {
        visible: {
            opacity: 1,
            transition: {
                when: 'beforeChildren',
                staggerChildren: 0.1, // Memberikan efek stagger pada children
            },
        },
        hidden: { opacity: 0 },
    };

    const cardItemVariants = {
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
        hidden: { opacity: 0, y: 20 },
    };

    // Varian untuk elemen teks individual di header (opsional, karena parent sudah dianimasikan)
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    if (isLoading) {
        return <AppLoading />;
    }

    return (
        <BlogLayout title="Berita - UKM POLICY">
            {/* Section Label (judul halaman) - Dengan Animasi */}
            <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeInSlideUp} // Animasi untuk section keseluruhan
                className="relative overflow-hidden bg-black py-8"
            >
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-red-600/40 opacity-40 blur-[120px]" />
                    <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-white/10 opacity-10 blur-2xl" />
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="pt-12 pb-6 text-left md:pt-20">
                        {/* Breadcrumb: Home > Berita - Dengan Animasi */}
                        <motion.div variants={textVariants} className="mb-6 flex items-center text-xs md:text-sm">
                            <Link href={route('home')} className="font-medium text-gray-300 transition-colors duration-200 hover:text-red-400">
                                Beranda
                            </Link>
                            <ChevronRight className="mx-2 h-4 w-4 text-white/60" />
                            <span className="font-bold text-red-500">Berita</span>
                        </motion.div>
                        {/* Judul Utama: BLOG KAMI - Dengan Animasi */}
                        <motion.h1
                            variants={textVariants}
                            className="mb-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-3xl md:text-4xl"
                        >
                            BERITA KAMI
                        </motion.h1>
                        {/* Deskripsi - Dengan Animasi */}
                        <motion.p variants={textVariants} className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                            Dapatkan informasi dan berita terbaru dari kami
                        </motion.p>
                    </div>
                </div>
                <div className="w-full border-t border-neutral-800 px-4 sm:px-6 lg:px-8"></div>
            </motion.section>

            {/* Konten Artikel Blog */}
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <BlogFilter
                    categories={categories}
                    currentSearch={currentSearch}
                    currentCategoryId={currentCategoryId}
                    initialPerPage={initialPerPage}
                    setCurrentSearch={setCurrentSearch}
                    setCurrentCategoryId={setCurrentCategoryId}
                />

                {articles.data.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cardGridVariants} // Varian untuk grid artikel, mengontrol stagger
                        className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {articles.data.map((article) => (
                            <motion.div key={article.id} variants={cardItemVariants}>
                                {' '}
                                {/* Varian untuk setiap kartu artikel */}
                                <ArticleCard article={article} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.p
                        initial="initial"
                        animate="animate"
                        variants={fadeInSlideUp} // Animasi untuk pesan "Tidak ada artikel"
                        className="rounded-lg border border-zinc-800 bg-zinc-900/50 py-10 text-center text-lg text-gray-400"
                    >
                        Tidak ada artikel yang ditemukan untuk kriteria ini.
                    </motion.p>
                )}
                <Pagination links={articles.links} handlePaginationClick={handlePaginationClick} />
            </section>
        </BlogLayout>
    );
};

export default BlogPage;
