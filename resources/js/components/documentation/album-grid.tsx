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
    const imageStackPositions = [
        'top-4 left-1/2 -translate-x-1/2',
        'top-8 left-1/2 -translate-x-1/2',
        'top-12 left-1/2 -translate-x-1/2',
    ];

    const imageHoverTransforms = [
        'group-hover:-translate-x-6 group-hover:-translate-y-2 group-hover:rotate-[-8deg]',
        'group-hover:scale-105',
        'group-hover:translate-x-6 group-hover:-translate-y-2 group-hover:rotate-[8deg]',
    ];

    return (
        <section className="py-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {albums.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {albums.map((album) => (
                            <Link href={`/gallery/albums/${album.id}`} key={album.id} className="group block">
                                <div className="relative aspect-square w-full bg-zinc-900 rounded-xl overflow-hidden border-2 border-zinc-800 group-hover:border-red-500 transition-all duration-300">
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        {album.preview_media && album.preview_media.length > 0 ? (
                                            <div className="relative w-56 h-56">
                                                {album.preview_media.map((media, index) => (
                                                    <img
                                                        key={media.id}
                                                        src={`/storage/${media.thumbnail_file || media.file}`}
                                                        alt={`Preview ${index + 1}`}
                                                        className={`absolute h-40 w-40 object-cover rounded-lg border-4 border-zinc-900 shadow-lg transition-all duration-300 ease-in-out ${imageStackPositions[index] || ''} ${imageHoverTransforms[index] || ''}`}
                                                        style={{ zIndex: index }}
                                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/200x200/111/333?text=Error'; }}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                                                <Camera className="w-16 h-16 text-zinc-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 p-5">
                                        <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors duration-300">{album.name}</h3>
                                        <p className="text-sm text-zinc-300 mt-1">{album.media_count} Foto</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-zinc-400">
                        <p>Belum ada album publik yang tersedia saat ini.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AlbumGrid;
