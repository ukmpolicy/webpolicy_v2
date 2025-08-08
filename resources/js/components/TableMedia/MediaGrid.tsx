import { Button } from '@/components/ui/button';
import { Inertia } from '@inertiajs/inertia';
import { Pencil, Trash2 } from 'lucide-react';

export function MediaGrid({ media, onEdit, onPreview, onDelete, onMove }) {
    const filteredMedia = media.data || [];
    const paginationLinks = media.links || [];

    const goToPage = (url) => {
        if (url) {
            Inertia.get(url, {}, { preserveScroll: true });
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {filteredMedia.length === 0 ? (
                    <div className="col-span-full py-16 text-center text-gray-400">
                        <span className="text-4xl">📁</span>
                        <div className="mt-2">Belum ada media yang ditemukan.</div>
                    </div>
                ) : (
                    filteredMedia.map((item) => (
                        <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-xl border bg-white shadow-lg transition hover:shadow-2xl dark:bg-zinc-900"
                        >
                            <div className="flex h-52 w-full cursor-pointer items-center justify-center bg-gray-100" onClick={() => onPreview(item)}>
                                {item.mimetype.startsWith('image/') ? (
                                    <img
                                        src={`/storage/${item.thumbnail_file || item.file}`}
                                        alt={item.caption || 'Media'}
                                        className="h-full w-full object-cover transition group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : item.mimetype.startsWith('video/') ? (
                                    <video
                                        src={`/storage/${item.thumbnail_file || item.file}`}
                                        className="h-full w-full object-cover transition group-hover:scale-105"
                                        muted
                                        playsInline
                                        preload="none"
                                    />
                                ) : (
                                    <div className="text-gray-400">Tidak dapat ditampilkan</div>
                                )}
                            </div>
                            <span className="absolute top-2 left-2 rounded bg-blue-600 px-2 py-0.5 text-xs text-white shadow">
                                {item.album?.name || '-'}
                            </span>
                            <div className="absolute top-2 right-2 flex gap-2">
                                <Button
                                    size="icon"
                                    className="bg-white/80 hover:bg-blue-100 dark:bg-zinc-800 dark:hover:bg-blue-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(item);
                                    }}
                                >
                                    <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </Button>
                                <Button
                                    size="icon"
                                    className="bg-white/80 hover:bg-yellow-100 dark:bg-zinc-800 dark:hover:bg-yellow-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMove({ id: item.id, album_id: String(item.album_id) });
                                    }}
                                    title="Pindah Album"
                                >
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                        <path
                                            d="M8 17l4 4 4-4m-4-5v9M20 12a8 8 0 11-16 0 8 8 0 0116 0z"
                                            stroke="#eab308"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </Button>
                                <Button
                                    size="icon"
                                    className="bg-white/80 hover:bg-red-100 dark:bg-zinc-800 dark:hover:bg-red-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(item.id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </Button>
                            </div>
                            <div className="p-4">
                                <div className="truncate font-semibold">
                                    {item.caption || <span className="text-gray-400 italic">Tanpa caption</span>}
                                </div>
                                <div className="mt-1 text-xs text-gray-400">Dibuat: {new Date(item.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {paginationLinks.length > 3 && (
                <div className="mt-6 flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Menampilkan {media.from || 0} sampai {media.to || 0} dari {media.total || 0} media
                    </span>
                    <div className="flex gap-2">
                        {paginationLinks.map((link, index) => (
                            <Button
                                key={index}
                                onClick={() => goToPage(link.url)}
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
        </>
    );
}
