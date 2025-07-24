import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import AppLoading from '@/components/homepage/app-loading';
import TuiViewer from '@/components/tui-viewer';
import { Head, Link, PageProps } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, UserRound } from 'lucide-react';
import React from 'react';

// --- DEFINISI TIPE UNTUK PROPS INERTIA ---
interface Category {
    id: number;
    name: string;
}

interface Author {
    id: number;
    name: string;
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
    imode?: string;
    updated_at: string;
    author: Author;
    categories: Category[];
}

interface BlogArticleShowProps extends PageProps {
    article: Article;
    relatedArticles: Article[];
}
// --- AKHIR DEFINISI TIPE ---

// --- KOMPONEN RELATED ARTICLE CARD (SEKARANG BERADA DI DALAM FILE INI) ---
interface RelatedArticleCardProps {
    article: Article;
}

const RelatedArticleCard: React.FC<RelatedArticleCardProps> = ({ article }) => {
    const getImageUrl = (path?: string): string => {
        return path ? `/storage/${path}` : '/images/default-blog-cover.jpg';
    };

    return (
        <Link
            href={route('blog.show', article.slug)}
            className="group flex items-center gap-4 rounded-lg bg-neutral-950 p-3 transition-colors duration-200 hover:bg-neutral-900" // Hitam/Abu Sangap Gelap
        >
            {/* Thumbnail Image */}
            {article.picture && (
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                        src={getImageUrl(article.picture)}
                        alt={article.title}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                </div>
            )}

            <div className="flex-grow">
                {/* Category */}
                <div className="mb-1 flex flex-wrap gap-1">
                    {article.categories.map((category) => (
                        <span key={category.id} className="inline-block rounded-full bg-red-800/20 px-1.5 py-0.5 text-xs font-semibold text-red-300">
                            {category.name}
                        </span>
                    ))}
                </div>
                {/* Title */}
                <h3 className="line-clamp-2 text-base font-semibold text-white transition-colors duration-200 group-hover:text-red-400">
                    {article.title}
                </h3>
                {/* Meta Info */}
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <UserRound className="h-3 w-3 text-red-400" />
                        {article.author.role?.name || 'Divisi'}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-red-400" />
                        {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                </div>
            </div>
        </Link>
    );
};
// --- AKHIR KOMPONEN RELATED ARTICLE CARD (SEKARANG BERADA DI DALAM FILE INI) ---

const BlogArticleShow: React.FC<BlogArticleShowProps> = ({ article, relatedArticles }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true); // Gunakan React.useState

    React.useEffect(() => {
        // Gunakan React.useEffect
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const getImageUrl = (path?: string): string => {
        return path ? `/storage/${path}` : '/images/default-blog-cover.jpg';
    };

    const fadeInSlideUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    if (isLoading) return <AppLoading />;

    if (!article || article.status !== 'published') {
        return (
            <>
                <Head title="Artikel Tidak Ditemukan" />
                <AppHeader />
                <main className="flex min-h-screen items-center justify-center bg-black pt-0 text-white">
                    <motion.div initial="initial" animate="animate" variants={fadeInSlideUp} className="p-8 text-center">
                        <h1 className="mb-4 text-4xl font-bold text-red-500">404 - Artikel Tidak Ditemukan</h1>
                        <p className="mb-6 text-lg text-gray-400">Maaf, artikel yang Anda cari tidak tersedia atau sudah dihapus.</p>
                        <Link href={route('blog.index')} className="font-medium text-red-600 hover:text-red-800">
                            &larr; Kembali ke Daftar Blog
                        </Link>
                    </motion.div>
                </main>
                <AppFooter />
            </>
        );
    }

    return (
        <>
            <Head title={article.title} />
            <AppHeader />
            <main className="min-h-screen bg-black pt-0 text-white">
                {/* Section Label (detail page title) */}
                <motion.section initial="initial" animate="animate" variants={fadeInSlideUp} className="relative overflow-hidden bg-black py-8">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        {/* Blob merah */}
                        <div className="absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-red-600/40 opacity-40 blur-[120px]" />
                        {/* Blob putih/terang untuk efek highlight samar */}
                        <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-white/10 opacity-10 blur-2xl" />
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="pt-12 pb-6 text-left md:pt-20">
                            {/* Breadcrumb */}
                            <div className="mb-6 flex items-center text-xs md:text-sm">
                                <Link href={route('home')} className="font-medium text-gray-300 transition-colors duration-200 hover:text-red-400">
                                    Home
                                </Link>
                                <ChevronRight className="mx-2 h-4 w-4 text-white/60" />
                                <Link
                                    href={route('blog.index')}
                                    className="font-medium text-gray-300 transition-colors duration-200 hover:text-red-400"
                                >
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
                            <div className="flex items-center gap-4 text-base text-gray-400">
                                <span className="flex items-center gap-1.5 font-medium text-gray-300">
                                    <UserRound className="h-4 w-4 text-red-400" />
                                    {article.author.role?.name || 'Divisi Tidak Diketahui'}
                                </span>
                                <span className="flex items-center gap-1.5 font-medium text-gray-300">
                                    <Calendar className="h-4 w-4 text-red-400" />
                                    {new Date(article.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* GARIS PEMISAH */}
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

                                {/* KONTEN UTAMA ARTIKEL: Tambahkan kembali prose-invert */}
                                <div className="prose prose-invert prose-lg max-w-none">
                                    <TuiViewer content={article.content} />
                                </div>

                                {/* RINGKASAN ARTIKEL DIPINDAHKAN KE SINI DENGAN GAYA PROSE */}
                                {/* Tambahkan kembali prose-invert di sini jika ringkasan juga di atas bg gelap */}
                                <div className="prose prose-invert prose-lg mt-8 max-w-none">
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
                                    &larr; Kembali ke Daftar Blog
                                </Link>
                            </div>
                        </div>

                        {/* Kolom Kanan: Sidebar Artikel Terkait */}
                        <div className="relative lg:col-span-1">
                            <div className="sticky top-28 rounded-lg border border-neutral-800 bg-neutral-950/50 p-6 shadow-xl backdrop-blur-md">
                                <h2 className="mb-6 border-b border-neutral-700 pb-3 text-xl font-bold text-white">Artikel Terkait</h2>
                                {relatedArticles && relatedArticles.length > 0 ? (
                                    <div className="space-y-4">
                                        {relatedArticles.map((relatedArticle) => (
                                            <RelatedArticleCard key={relatedArticle.id} article={relatedArticle} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">Tidak ada artikel terkait saat ini.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.section>
            </main>
            <AppFooter />
        </>
    );
};

export default BlogArticleShow;
