import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Inertia } from '@inertiajs/inertia';
import { X } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

export function MediaModals({ preview, setPreview, deleteId, setDeleteId, moveData, setMoveData, albums }) {
    const previewRef = useRef(null);

    return (
        <>
            {preview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div ref={previewRef} className="relative w-fit max-w-2xl rounded-xl bg-white p-4 shadow-lg dark:bg-zinc-900">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={() => setPreview(null)}>
                            <X className="h-6 w-6" />
                        </button>
                        <div className="flex flex-col items-center p-4">
                            {preview.mimetype.startsWith('image/') ? (
                                <img src={`/storage/${preview.file}`} alt={preview.caption || 'Media'} className="mb-4 max-h-[50vh] w-auto rounded" />
                            ) : preview.mimetype.startsWith('video/') ? (
                                <video src={`/storage/${preview.file}`} controls className="mb-4 max-h-[50vh] w-auto rounded" />
                            ) : (
                                <div className="text-gray-400">Tidak dapat ditampilkan</div>
                            )}
                            <div className="max-h-[150px] w-full overflow-y-auto px-4 pt-2 pb-4 text-left text-lg leading-snug font-bold">
                                {preview.caption || <span className="text-gray-400 italic">Tanpa caption</span>}
                            </div>
                            <div className="mt-1 text-sm text-gray-500">Album: {preview.album?.name || '-'}</div>
                            <div className="mt-1 text-xs text-gray-400">Dibuat: {new Date(preview.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            )}

            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus Media?</DialogTitle>
                    </DialogHeader>
                    <div className="mb-4 text-gray-600">Apakah Anda yakin ingin menghapus media ini? Tindakan ini tidak dapat dibatalkan.</div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDeleteId(null)}>
                            Batal
                        </Button>
                        <Button
                            onClick={() => {
                                Inertia.delete(`/gallery-media/${deleteId}`, {
                                    onSuccess: () => {
                                        toast.success('Berhasil hapus Media');
                                        setDeleteId(null);
                                    },
                                    onError: () => toast.error('Gagal hapus Media'),
                                });
                            }}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!moveData} onOpenChange={() => setMoveData(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Pindah Album</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!moveData) return;
                            Inertia.post(
                                `/gallery-media/${moveData.id}/move`,
                                { album_id: moveData.album_id },
                                {
                                    onSuccess: () => {
                                        toast.success('Media berhasil dipindahkan');
                                        setMoveData(null);
                                    },
                                    onError: (err) => {
                                        toast.error(err?.album_id || 'Gagal memindahkan media');
                                    },
                                },
                            );
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-medium">Pilih Album Tujuan</label>
                            <Select
                                value={moveData?.album_id || ''}
                                onValueChange={(val) => setMoveData(moveData ? { ...moveData, album_id: val } : null)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Album" />
                                </SelectTrigger>
                                <SelectContent className="max-h-48 overflow-y-auto">
                                    {albums.map((album) => (
                                        <SelectItem key={album.id} value={String(album.id)}>
                                            {album.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="secondary" type="button" onClick={() => setMoveData(null)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={!moveData?.album_id}>
                                Pindahkan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
