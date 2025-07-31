// src/components/documentation/album-grid.tsx
import { Link } from '@inertiajs/react';
import { Camera } from 'lucide-react';
import React from 'react';

// Definisikan tipe data
interface Media {
    id: number;
    file: string;
    thumbnail_file?: string;
}

interface Album {
    id: number;
    name: string;
    media_count: number;
    preview_media: Media[];
}

interface AlbumGridProps {
    albums: Album[];
}

const AlbumGrid: React.FC<AlbumGridProps> = ({ albums }) => {
    const imageStackPositions = ['top-4 left-1/2 -translate-x-1/2', 'top-8 left-1/2 -translate-x-1/2', 'top-12 left-1/2 -translate-x-1/2'];

    const imageHoverTransforms = [
        'group-hover:-translate-x-6 group-hover:-translate-y-2 group-hover:rotate-[-8deg]',
        'group-hover:scale-105',
        'group-hover:translate-x-6 group-hover:-translate-y-2 group-hover:rotate-[8deg]',
    ];

    // Helper function untuk mendeteksi video berdasarkan ekstensi file
    const isVideo = (fileName: string) => {
        if (!fileName) return false;
        const videoExtensions = ['.mp4', '.webm', '.mkv', '.avi'];
        return videoExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
    };

    return (
        <div className="mx-auto max-w-7xl">
            {albums.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {albums.map((album) => (
                        <Link
                            href={`/dokumentasi/albums/${album.id}`}
                            key={album.id}
                            // Mengubah kelas Link untuk menggunakan flex-col
                            className="group relative block flex flex-col overflow-hidden rounded-xl border border-transparent bg-zinc-900 shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-red-600 hover:shadow-2xl"
                        >
                            {/* Area Gambar/Pratinjau - sekarang memiliki tinggi tetap */}
                            <div className="relative h-56 w-full overflow-hidden">
                                {album.preview_media && album.preview_media.length > 0 ? (
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        <div className="relative h-56 w-56">
                                            {album.preview_media.map((media, index) => {
                                                const mediaPath = `/storage/${media.thumbnail_file || media.file}`;
                                                const commonClasses = `absolute h-40 w-40 rounded-lg border-4 border-zinc-900 object-cover shadow-lg transition-all duration-300 ease-in-out ${imageStackPositions[index] || ''} ${imageHoverTransforms[index] || ''}`;

                                                return isVideo(media.file) ? (
                                                    <video
                                                        key={media.id}
                                                        src={mediaPath}
                                                        className={commonClasses}
                                                        style={{ zIndex: index }}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                    />
                                                ) : (
                                                    <img
                                                        key={media.id}
                                                        src={mediaPath}
                                                        alt={`Preview ${index + 1}`}
                                                        className={commonClasses}
                                                        style={{ zIndex: index }}
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = 'https://placehold.co/200x200/111/333?text=Error';
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-800">
                                        <Camera className="h-16 w-16 text-zinc-600" />
                                    </div>
                                )}
                                {/* Overlay gradient di atas gambar */}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            </div>

                            {/* Area Teks - sekarang menjadi blok terpisah di bawah gambar */}
                            <div className="flex flex-grow flex-col p-6">
                                {' '}
                                {/* Menambahkan padding di sini */}
                                <h3 className="mb-2 line-clamp-2 text-xl font-bold text-white transition-colors duration-300 group-hover:text-red-500">
                                    {album.name}
                                </h3>
                                {/* Tambahkan line-clamp-2 untuk caption di mobile jika diperlukan */}
                                <p className="mt-1 line-clamp-2 text-sm text-zinc-300 sm:line-clamp-none">{album.media_count} Foto</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="py-16 text-center text-zinc-400">
                    <p>Belum ada album publik yang tersedia saat ini.</p>
                </div>
            )}
        </div>
    );
};

export default AlbumGrid;
