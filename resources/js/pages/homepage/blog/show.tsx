import { Link, PageProps } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Mengimpor komponen-komponen yang sudah dipecah
import AppLoading from '@/components/homepage/app-loading';
import BlogLayout from '@/components/homepage/blog/BlogLayout';
import RelatedArticlesSidebar from '@/components/homepage/blog/RelatedArticlesSidebar';
import TuiViewer from '@/components/tui-viewer';

// --- DEFINISI ULANG TIPE UNTUK PROPS INERTIA ---
// Pindahkan tipe ke sini agar bisa diimpor oleh komponen lain
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

export interface Article {
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

interface BlogArticleShowProps extends PageProps {
    article: Article;
    relatedArticles: Article[];
}
// --- AKHIR DEFINISI TIPE ---

// Fungsi helper untuk mengubah string menjadi Title Case
const toTitleCase = (str: string): string => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const BlogArticleShow: React.FC<BlogArticleShowProps> = ({ article, relatedArticles }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const getImageUrl = (path?: string): string => {
        return path ? `/storage/${path}` : '/images/penguin.png';
    };

    const fadeInSlideUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    if (isLoading) {
        return <AppLoading />;
    }

    if (!article || article.status !== 'published') {
        return (
            <BlogLayout title="Artikel Tidak Ditemukan">
                <main className="flex min-h-screen items-center justify-center pt-0 text-white">
                    <motion.div initial="initial" animate="animate" variants={fadeInSlideUp} className="p-8 text-center">
                        <h1 className="mb-4 text-4xl font-bold text-red-500">404 - Artikel Tidak Ditemukan</h1>
                        <p className="mb-6 text-lg text-gray-400">Maaf, artikel yang Anda cari tidak tersedia atau sudah dihapus.</p>
                        <Link href={route('blog.index')} className="font-medium text-red-600 hover:text-red-800">
                            &larr; Kembali ke Daftar Berita
                        </Link>
                    </motion.div>
                </main>
            </BlogLayout>
        );
    }

    return (
        <BlogLayout title={article.title}>
            {/* Section Label (detail page title) */}
            <motion.section initial="initial" animate="animate" variants={fadeInSlideUp} className="relative overflow-hidden bg-black py-8">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-red-600/40 opacity-40 blur-[120px]" />
                    <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-white/10 opacity-10 blur-2xl" />
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="pt-12 pb-6 text-left md:pt-20">
                        {/* Breadcrumb */}
                        <div className="mb-6 flex items-center text-xs md:text-sm">
                            <Link href={route('home')} className="font-medium text-gray-300 transition-colors duration-200 hover:text-red-400">
                                Beranda
                            </Link>
                            <ChevronRight className="mx-2 h-4 w-4 text-white/60" />
                            <Link href={route('blog.index')} className="font-medium text-gray-300 transition-colors duration-200 hover:text-red-400">
                                Berita
                            </Link>
                            <ChevronRight className="mx-2 h-4 w-4 text-white/60" />
                            <span className="line-clamp-1 font-bold text-red-500">Rincian Detail</span>
                        </div>
                        {/* Judul Utama Artikel */}
                        <h1 className="mb-2 text-3xl leading-tight font-extrabold tracking-tight text-white uppercase sm:text-3xl md:text-4xl">
                            {article.title}
                        </h1>
                        {/* Meta Info (Divisi & Tanggal) */}
                        <div className="flex items-center gap-4 text-xs text-gray-400 sm:text-sm md:text-base">
                            {/* Gabungkan gambar dan nama penulis dalam satu container */}
                            <div className="flex items-center gap-2 font-medium text-gray-300">
                                <div className="h-6 w-6 overflow-hidden rounded-full">
                                    <img
                                        className="h-full w-full object-cover"
                                        src={article.author?.picture ? getImageUrl(article.author?.picture) : '/assets/penguin.png'}
                                        alt="Gambar"
                                    />
                                </div>
                                {/* <span>{article.author.name || 'Nama Tidak Diketahui'}</span> */}
                                <span>{toTitleCase(article.author.name || 'Nama Tidak Diketahui')}</span>
                            </div>

                            {/* Tanggal tetap di container terpisah */}
                            <span className="flex items-center gap-1.5 font-medium text-gray-300">
                                <Calendar className="h-4 w-4 text-red-400" />
                                {new Date(article.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full border-t border-neutral-800 px-4 sm:px-6 lg:px-8"></div>
            </motion.section>

            {/* Konten Detail Artikel + Sidebar */}
            <motion.section initial="initial" animate="animate" variants={fadeInSlideUp} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                    {/* Kolom Kiri: Konten Artikel Utama */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-6 shadow-xl backdrop-blur-md sm:p-8">
                            {article.picture && (
                                <img
                                    src={getImageUrl(article.picture)}
                                    alt={article.title}
                                    className="mb-8 h-64 w-full rounded-md object-cover shadow-md sm:h-80"
                                    loading="lazy"
                                />
                            )}

                            <div className="mb-6 flex flex-wrap gap-2">
                                {article.categories.map((category) => (
                                    <span
                                        key={category.id}
                                        className="inline-block rounded-full bg-red-800/20 px-2.5 py-0.5 text-xs font-semibold text-red-300"
                                    >
                                        {category.name}
                                    </span>
                                ))}
                            </div>

                            <div className="prose prose-lg max-w-none">
                                <style jsx="true">{`
                                    .prose h1,
                                    .prose h2,
                                    .prose h3,
                                    .prose h4,
                                    .prose h5,
                                    .prose h6,
                                    .prose p,
                                    .prose li,
                                    .prose a,
                                    .prose strong,
                                    .prose em,
                                    .prose blockquote {
                                        color: #ffffff !important;
                                    }
                                    /* Styling for inline code */
                                    .prose code:not(pre > code) {
                                        color: #ef4444 !important;
                                        background-color: transparent !important;
                                    }
                                    /* Styling for code blocks (pre > code) */
                                    .prose pre > code {
                                        color: #fcc737 !important;
                                        background-color: transparent !important;
                                    }
                                    .prose pre {
                                        background-color: #1a1a1a !important;
                                        border-color: #2d3748 !important;
                                        color: inherit !important;
                                    }
                                    .prose blockquote {
                                        border-left-color: #ef4444 !important;
                                    }
                                    .prose table {
                                        width: 100% !important;
                                        border-collapse: collapse !important;
                                        margin-top: 1.5em !important;
                                        margin-bottom: 1.5em !important;
                                        background-color: #1a1a1a !important;
                                        border: 1px solid #333333 !important;
                                        border-radius: 0.5rem;
                                        overflow: hidden;
                                    }
                                    .prose th,
                                    .prose td {
                                        border: 1px solid #333333 !important;
                                        padding: 0.75em 1em !important;
                                        color: #ffffff !important;
                                        text-align: left !important;
                                    }
                                    .prose thead th {
                                        background-color: #292d3e !important;
                                        font-weight: 700 !important;
                                        color: #ffffff !important;
                                    }
                                    .prose tbody tr:nth-child(odd) {
                                        background-color: #1a1a1a !important;
                                    }
                                    .prose tbody tr:nth-child(even) {
                                        background-color: #1e1e1e !important;
                                    }
                                    .prose tbody tr:hover {
                                        background-color: #282828 !important;
                                    }
                                    .prose td a {
                                        color: #ef4444 !important;
                                    }
                                    .prose td a:hover {
                                        color: #dc2626 !important;
                                    }
                                `}</style>
                                <TuiViewer content={article.content} />
                            </div>

                            <div className="prose prose-lg mt-8 max-w-none">
                                <h2 className="!mt-0 !mb-2 !text-xl !font-bold">Ringkasan Konten</h2>
                                <p>{article.summary}</p>
                            </div>
                        </div>

                        {/* Tombol Kembali ke Daftar Blog */}
                        <div className="mt-8 text-center">
                            <Link
                                href={route('blog.index')}
                                className="inline-flex items-center font-semibold text-red-600 transition-colors hover:text-red-800"
                            >
                                &larr; Kembali ke Daftar Berita
                            </Link>
                        </div>
                    </div>

                    {/* Kolom Kanan: Sidebar Artikel Terkait */}
                    <RelatedArticlesSidebar relatedArticles={relatedArticles} />
                </div>
            </motion.section>
        </BlogLayout>
    );
};

export default BlogArticleShow;
