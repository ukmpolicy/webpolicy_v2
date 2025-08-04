import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Komponen yang sudah ada dan kita gunakan kembali
import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import AppLoading from '@/components/homepage/app-loading';
import Pagination from '@/components/homepage/blog/Pagination';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ChevronRight, Eye, X } from 'lucide-react';

interface Media {
    id: number;
    file: string;
    caption: string;
    thumbnail_file?: string;
}

interface Album {
    id: number;
    name: string;
    media: Media[];
}

interface AlbumShowPageProps {
    album: Album;
}

const AlbumShowPage: React.FC<AlbumShowPageProps> = ({ album }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState<number | null>(null);
    const [mediaCurrentPage, setMediaCurrentPage] = useState(1);
    const mediaPerPage = 12;

    const activeMediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setMediaCurrentPage(1);
    }, [album.id]);

    const sortedMedia = [...(album.media || [])].sort((a, b) => {
        const idA = typeof a.id === 'number' ? a.id : parseInt(String(a.id), 10);
        const idB = typeof b.id === 'number' ? b.id : parseInt(String(b.id), 10);
        return idB - idA;
    });

    const totalMediaPages = Math.ceil(sortedMedia.length / mediaPerPage);
    const mediaIndexOfLastItem = mediaCurrentPage * mediaPerPage;
    const mediaIndexOfFirstItem = mediaIndexOfLastItem - mediaPerPage;
    const paginatedMedia = sortedMedia.slice(mediaIndexOfFirstItem, mediaIndexOfLastItem);

    const handleMediaPaginationClick = useCallback((url: string | null) => {
        if (url) {
            setMediaCurrentPage(parseInt(url));
            const mediaSection = document.getElementById('media-gallery-section');
            if (mediaSection) {
                window.scrollTo({ top: mediaSection.offsetTop - 100, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, []);

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

    const fadeInSlideUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

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

    const openLightbox = useCallback(
        (item: Media) => {
            const index = paginatedMedia.findIndex((m) => m.id === item.id);
            if (index !== -1) {
                setSelectedMedia(item);
                setCurrentMediaIndex(index);
            }
        },
        [paginatedMedia],
    );

    const closeLightbox = useCallback(() => {
        setSelectedMedia(null);
        setCurrentMediaIndex(null);
    }, []);

    const handleNextMedia = useCallback(() => {
        if (currentMediaIndex !== null && currentMediaIndex < paginatedMedia.length - 1) {
            const nextIndex = currentMediaIndex + 1;
            setSelectedMedia(paginatedMedia[nextIndex]);
            setCurrentMediaIndex(nextIndex);
        }
    }, [currentMediaIndex, paginatedMedia]);

    const handlePrevMedia = useCallback(() => {
        if (currentMediaIndex !== null && currentMediaIndex > 0) {
            const prevIndex = currentMediaIndex - 1;
            setSelectedMedia(paginatedMedia[prevIndex]);
            setCurrentMediaIndex(prevIndex);
        }
    }, [currentMediaIndex, paginatedMedia]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (selectedMedia) {
                if (event.key === 'ArrowRight') {
                    handleNextMedia();
                } else if (event.key === 'ArrowLeft') {
                    handlePrevMedia();
                } else if (event.key === 'Escape') {
                    closeLightbox();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedMedia, handleNextMedia, handlePrevMedia, closeLightbox]);

    useEffect(() => {
        if (selectedMedia && activeMediaRef.current) {
            if (isVideo(selectedMedia.file)) {
                (activeMediaRef.current as HTMLVideoElement).play().catch((error) => console.log('Autoplay prevented:', error));
            } else {
                const prevVideo = activeMediaRef.current as HTMLVideoElement;
                if (prevVideo && typeof prevVideo.pause === 'function') {
                    prevVideo.pause();
                }
            }
        }
    }, [selectedMedia]);

    if (isLoading) {
        return <AppLoading />;
    }

    const hasPrev = currentMediaIndex !== null && currentMediaIndex > 0;
    const hasNext = currentMediaIndex !== null && currentMediaIndex < paginatedMedia.length - 1;

    return (
        <>
            <Head title={`${album.name} - Dokumentasi`} />
            <AppHeader />
            <main className="min-h-screen bg-black pt-0 text-white">
                <motion.section initial="hidden" animate="visible" variants={fadeInSlideUp} className="relative overflow-hidden bg-black py-8">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-red-600/40 opacity-40 blur-[120px]" />
                        <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-white/10 opacity-10 blur-2xl" />
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="pt-12 pb-6 text-left md:pt-20">
                            <motion.div variants={textVariants} className="mb-6 flex flex-wrap items-center text-xs md:text-sm">
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
                                <motion.span variants={textVariants} className="truncate font-bold text-red-500">
                                    Rincian Detail
                                </motion.span>
                            </motion.div>
                            <motion.h1
                                variants={textVariants}
                                className="mb-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-3xl md:text-4xl"
                            >
                                {album.name}
                            </motion.h1>
                            <motion.p variants={textVariants} className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                                Galeri Kegiatan UKM POLICY
                            </motion.p>
                        </div>
                    </div>
                    <div className="w-full border-t border-neutral-800 px-4 sm:px-6 lg:px-8"></div>
                </motion.section>

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
                                        onClick={() => openLightbox(item)}
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

            {/* MODAL UNTUK PRATINJAU GAMBAR/VIDEO (LIGHTBOX FINAL) */}
            <Dialog open={!!selectedMedia} onOpenChange={closeLightbox}>
                <DialogContent className="/* Ukuran modal: XL di desktop, 95% tinggi. Ini responsive */ !fixed relative !top-[50%] !left-[50%] flex max-h-[95vh] max-w-screen-xl !-translate-x-1/2 !-translate-y-1/2 flex-col justify-between overflow-hidden rounded-lg bg-black p-0 shadow-2xl">
                    {/* DialogTitle untuk aksesibilitas (dibaca screen reader, disembunyikan visual) */}
                    <DialogTitle className="sr-only">Pratinjau Media</DialogTitle>

                    {/* Area Utama Media (Gambar/Video) */}
                    {/* Ini adalah kontainer untuk gambar/video.
                        - flex-grow: Mengambil ruang sebanyak mungkin.
                        - flex items-center justify-center: Memusatkan gambar/video di tengah kontainer ini.
                        - w-full h-full: Memastikan kontainer mengisi penuh ruangnya.
                        - p-4: Padding di sekitar gambar/video di dalam kontainer hitam.
                    */}
                    <div className="relative flex h-full w-full flex-grow items-center justify-center p-4">
                        {selectedMedia && (
                            <>
                                {isVideo(selectedMedia.file) ? (
                                    <video
                                        ref={activeMediaRef as React.RefObject<HTMLVideoElement>}
                                        src={`/storage/${selectedMedia.file}`}
                                        // Kontrol tinggi gambar/video responsif:
                                        // - max-h-[65vh]: Di mobile/tablet, max 65% tinggi viewport untuk beri ruang caption.
                                        // - md:max-h-[75vh]: Di tablet, sedikit lebih tinggi.
                                        // - lg:max-h-[85vh]: Di desktop, max 85% tinggi viewport agar caption tetap terlihat jelas.
                                        className="max-h-[65vh] max-w-full rounded-md object-contain md:max-h-[75vh] lg:max-h-[85vh]"
                                        controls
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                ) : (
                                    <img
                                        ref={activeMediaRef as React.RefObject<HTMLImageElement>}
                                        src={`/storage/${selectedMedia.file}`}
                                        alt={selectedMedia.caption}
                                        className="max-h-[65vh] max-w-full rounded-md object-contain md:max-h-[75vh] lg:max-h-[85vh]"
                                    />
                                )}
                            </>
                        )}

                        {/* Tombol Navigasi Kiri - Diposisikan di samping media, di dalam padding modal */}
                        {hasPrev && (
                            <button
                                onClick={handlePrevMedia}
                                className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-r-lg bg-white/10 p-3 text-white transition-colors duration-200 hover:bg-white/20 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:outline-none lg:rounded-full lg:px-4" /* Styling responsif: bulat di desktop, hanya sisi kanan di mobile */
                                aria-label="Previous media"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                        )}

                        {/* Tombol Navigasi Kanan - Diposisikan di samping media, di dalam padding modal */}
                        {hasNext && (
                            <button
                                onClick={handleNextMedia}
                                className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-l-lg bg-white/10 p-3 text-white transition-colors duration-200 hover:bg-white/20 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:outline-none lg:rounded-full lg:px-4" /* Styling responsif: bulat di desktop, hanya sisi kiri di mobile */
                                aria-label="Next media"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        )}
                    </div>

                    {/* Caption Media - Selalu di bagian bawah modal */}
                    <div className="max-h-24 w-full flex-shrink-0 overflow-y-auto px-4 py-2 text-left text-sm text-zinc-300">
                        {selectedMedia?.caption && <p>{selectedMedia.caption}</p>}
                    </div>

                    {/* Tombol Tutup Modal (X) - Di posisi kanan atas MODAL secara keseluruhan */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-0 right-0 z-40 rounded-tr-lg rounded-bl-lg bg-white/10 p-3 text-white transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:outline-none" /* Desain terintegrasi dengan sudut modal */
                        aria-label="Tutup pratinjau"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AlbumShowPage;
