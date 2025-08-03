import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

// Komponen yang sudah ada dan kita gunakan kembali
import AppHeader from '@/components/homepage/app-header';
import AppFooter from '@/components/homepage/app-footer';
import AppLoading from '@/components/homepage/app-loading';
// --- PERUBAHAN: Import ikon X ---
import { ArrowLeft, Eye, X } from 'lucide-react';
import { Link } from '@inertiajs/react';
// Import komponen Dialog untuk modal pratinjau
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Definisikan tipe data untuk props agar lebih aman
interface Media {
    id: number;
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

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <AppLoading />;

    return (
        <>
            <Head title={`${album.name} - Dokumentasi`} />
            <AppHeader />
            <main className="bg-black text-white pt-24 sm:pt-28 min-h-screen">
                {/* Header Halaman */}
                <section className="relative text-center py-16 bg-zinc-900/50">
                    <div className="absolute inset-0 -z-10 pointer-events-none">
                        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-red-600/30 rounded-full blur-[120px] opacity-30" />
                    </div>
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider">{album.name}</h1>
                        <p className="mt-2 text-gray-400 text-lg">
                            Galeri Kegiatan UKM POLICY
                        </p>
                        <div className="mt-6 text-base">
                            <Link href="/gallery" className="italic text-white hover:underline">Dokumentasi</Link>
                            <span className="mx-2 text-white">/</span>
                            <span className="italic text-red-600 font-semibold">{album.name}</span>
                        </div>
                    </div>
                </section>

                {/* Konten Galeri Media */}
                <section className="py-20 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <Link href="/gallery" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke Semua Album
                            </Link>
                        </div>

                        {album.media && album.media.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {album.media.map((item) => (
                                    <div
                                      key={item.id}
                                      className="group relative bg-zinc-900 rounded-lg shadow-lg overflow-hidden cursor-pointer"
                                      onClick={() => setSelectedMedia(item)}
                                    >
                                        <div className="aspect-w-1 aspect-h-1">
                                            <img
                                                src={`/storage/${item.thumbnail_file || item.file}`}
                                                alt={item.caption}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/400x400/111/333?text=Error'; }}
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <Eye className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pointer-events-none">
                                            <p className="text-sm text-white font-medium truncate">{item.caption}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 text-zinc-400">
                                <p>Album ini belum memiliki foto.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <AppFooter />

            {/* Modal untuk Pratinjau Gambar (Lightbox) */}
            <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
                <DialogContent className="bg-black border-zinc-800 p-2 max-w-4xl w-auto">
                    {/* --- PERUBAHAN: Tambahkan tombol close yang terlihat --- */}
                    <button
                        onClick={() => setSelectedMedia(null)}
                        className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors z-10 p-1 rounded-full bg-black/20 hover:bg-black/40"
                        aria-label="Tutup pratinjau"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    {selectedMedia && (
                        <div>
                            <img
                                src={`/storage/${selectedMedia.file}`} // Gunakan gambar ukuran penuh
                                alt={selectedMedia.caption}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-md"
                            />
                            {selectedMedia.caption && (
                                <div className="p-4 text-center">
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
