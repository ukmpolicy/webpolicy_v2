import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

// Komponen yang sudah ada dan kita gunakan kembali
import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import AppLoading from '@/components/homepage/app-loading';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ChevronRight, Eye, X } from 'lucide-react';

import Pagination from '@/components/homepage/blog/Pagination';

interface Media {
    id: number; // Pastikan ini adalah angka
    file: string;
    caption: string;
    thumbnail_file?: string;
}

interface Album {
    id: number;
    name: string;
    media: Media[]; // Album memiliki semua media di dalamnya
}

interface AlbumShowPageProps {
    album: Album;
}

const AlbumShowPage: React.FC<AlbumShowPageProps> = ({ album }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

    const [mediaCurrentPage, setMediaCurrentPage] = useState(1);
    const mediaPerPage = 12;

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setMediaCurrentPage(1);
    }, [album.id]);

    // --- PERUBAHAN DI SINI ---
    // Buat salinan array media dan urutkan berdasarkan ID secara menurun (terbaru pertama)
    // Menggunakan (album.media || []) untuk memastikan itu adalah array, bahkan jika album.media undefined.
    const sortedMedia = [...(album.media || [])].sort((a, b) => {
        // Pastikan ID diperlakukan sebagai angka untuk perbandingan yang benar
        const idA = typeof a.id === 'number' ? a.id : parseInt(String(a.id), 10);
        const idB = typeof b.id === 'number' ? b.id : parseInt(String(b.id), 10);
        return idB - idA; // Urutkan dari ID terbesar ke terkecil (terbaru pertama)
    });

    // Gunakan sortedMedia untuk pagination
    const totalMediaPages = Math.ceil(sortedMedia.length / mediaPerPage);
    const mediaIndexOfLastItem = mediaCurrentPage * mediaPerPage;
    const mediaIndexOfFirstItem = mediaIndexOfLastItem - mediaPerPage;
    const paginatedMedia = sortedMedia.slice(mediaIndexOfFirstItem, mediaIndexOfLastItem);
    // --- AKHIR PERUBAHAN ---

    const handleMediaPaginationClick = (url: string | null) => {
        if (url) {
            setMediaCurrentPage(parseInt(url));
            const mediaSection = document.getElementById('media-gallery-section');
            if (mediaSection) {
                window.scrollTo({ top: mediaSection.offsetTop - 100, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const mediaPaginationLinks = [];
    mediaPaginationLinks.push({
        url: mediaCurrentPage > 1 ? String(mediaCurrentPage - 1) : null,
        label: '&laquo; Previous',
        active: false,
    });
    for (let i = 1; i <= totalMediaPages; i++) {
        mediaPaginationLinks.push({
            url: String(i),
            label: String(i),
            active: i === mediaCurrentPage,
        });
    }
    mediaPaginationLinks.push({
        url: mediaCurrentPage < totalMediaPages ? String(mediaCurrentPage + 1) : null,
        label: 'Next &raquo;',
        active: false,
    });

    const mediaGridVariants = {
        visible: {
            opacity: 1,
            transition: {
                when: 'beforeChildren',
                staggerChildren: 0.05,
            },
        },
        hidden: { opacity: 0 },
    };

    const mediaItemVariants = {
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
        hidden: { opacity: 0, y: 20 },
    };

    const isVideo = (fileName: string) => {
        if (!fileName) return false;
        const videoExtensions = ['.mp4', '.webm', '.mkv', '.avi'];
        return videoExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
    };

    if (isLoading) {
        return <AppLoading />;
    }

    return (
        <>
            <Head title={`${album.name} - Dokumentasi`} />
            <AppHeader />
            <main className="min-h-screen bg-black pt-0 text-white">
                <section className="relative overflow-hidden bg-black py-8">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-red-600/40 opacity-40 blur-[120px]" />
                        <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-white/10 opacity-10 blur-2xl" />
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="pt-12 pb-6 text-left md:pt-20">
                            <div className="mb-6 flex flex-wrap items-center text-xs md:text-sm">
                                <Link
                                    href="/"
                                    className="font-medium whitespace-nowrap text-gray-300 transition-colors duration-200 hover:text-red-400"
                                >
                                    Beranda
                                </Link>
                                <ChevronRight className="mx-2 h-4 w-4 flex-shrink-0 text-white/60" />

                                <Link
                                    href="/dokumentasi"
                                    className="font-medium whitespace-nowrap text-gray-300 transition-colors duration-200 hover:text-red-400"
                                >
                                    Dokumentasi
                                </Link>
                                <ChevronRight className="mx-2 h-4 w-4 flex-shrink-0 text-white/60" />
                                <span className="truncate font-bold text-red-500">Rincian Detail</span>
                            </div>
                            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-3xl md:text-4xl">{album.name}</h1>
                            <p className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">Galeri Kegiatan UKM POLICY</p>
                        </div>
                    </div>
                    <div className="w-full border-t border-neutral-800 px-4 sm:px-6 lg:px-8"></div>
                </section>

                <section id="media-gallery-section" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Link href="/dokumentasi" className="inline-flex items-center gap-2 text-red-500 transition-colors hover:text-red-400">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Semua Album
                        </Link>
                    </div>

                    {paginatedMedia.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={mediaGridVariants}
                            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        >
                            {paginatedMedia.map((item) => {
                                const mediaPath = `/storage/${item.thumbnail_file || item.file}`;
                                return (
                                    <motion.div
                                        key={item.id}
                                        variants={mediaItemVariants}
                                        className="group relative cursor-pointer overflow-hidden rounded-lg bg-zinc-900 shadow-lg"
                                        onClick={() => setSelectedMedia(item)}
                                    >
                                        <div className="aspect-w-1 aspect-h-1">
                                            {isVideo(item.file) ? (
                                                <video
                                                    src={mediaPath}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    muted
                                                    playsInline
                                                />
                                            ) : (
                                                <img
                                                    src={mediaPath}
                                                    alt={item.caption}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = 'https://placehold.co/400x400/111/333?text=Error';
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <Eye className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                            <p className="truncate text-sm font-medium text-white">{item.caption}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <div className="py-16 text-center text-zinc-400">
                            <p>Album ini belum memiliki foto.</p>
                        </div>
                    )}

                    {totalMediaPages > 1 && <Pagination links={mediaPaginationLinks} handlePaginationClick={handleMediaPaginationClick} />}
                </section>
            </main>
            <AppFooter />

            {/* Modal untuk Pratinjau Gambar (Lightbox) */}
            <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
                <DialogContent className="w-auto max-w-4xl border-zinc-800 bg-black p-2">
                    <button
                        onClick={() => setSelectedMedia(null)}
                        className="absolute top-3 right-3 z-10 rounded-full bg-black/20 p-1 text-white/70 transition-colors hover:bg-black/40 hover:text-white"
                        aria-label="Tutup pratinjau"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    {selectedMedia && (
                        <div className="flex flex-col items-center">
                            {isVideo(selectedMedia.file) ? (
                                <video
                                    src={`/storage/${selectedMedia.file}`}
                                    className="max-h-[75vh] w-full rounded-md object-contain"
                                    controls
                                    autoPlay
                                />
                            ) : (
                                <img
                                    src={`/storage/${selectedMedia.file}`}
                                    alt={selectedMedia.caption}
                                    className="max-h-[75vh] w-full rounded-md object-contain"
                                />
                            )}
                            {selectedMedia.caption && (
                                <div className="max-h-48 w-full overflow-y-auto p-4 text-left">
                                    <p className="text-white">{selectedMedia.caption}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AlbumShowPage;
