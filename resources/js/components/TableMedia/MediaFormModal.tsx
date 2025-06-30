import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function MediaFormModal({ open, onClose, initialData, albums, selectedAlbumId }) {
    const isEdit = !!initialData?.id;
    const [preview, setPreview] = useState<string | null>(null);
    const { data, setData, processing, errors, reset } = useForm({
        album_id: selectedAlbumId || '',
        caption: '',
        file: null,
        ...initialData,
    });

    useEffect(() => {
        if (open) {
            if (isEdit && initialData) {
                setData({
                    album_id: initialData.album_id?.toString() || selectedAlbumId || '',
                    caption: initialData.caption || '',
                    file: null,
                });
                setPreview(initialData.file ? `/storage/${initialData.file}` : null);
            } else {
                reset();
                setData('album_id', selectedAlbumId || '');
                setPreview(null);
            }
        }
        // eslint-disable-next-line
    }, [open, isEdit, initialData, selectedAlbumId]);

    useEffect(() => {
        if (data.file) {
            const objectUrl = URL.createObjectURL(data.file);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [data.file]);

    const isVideo = () => {
        if (data.file && data.file.type) return data.file.type.startsWith('video/');
        if (initialData?.mimetype) return initialData.mimetype.startsWith('video/');
        if (preview && preview.match(/\.(mp4|mov|avi)$/i)) return true;
        return false;
    };

    function handleSubmit(e) {
        e.preventDefault();

        // Validasi manual album_id
        if (!data.album_id || data.album_id === '') {
            toast.error('Album wajib dipilih');
            return;
        }

        const formData = new FormData();
        formData.append('album_id', data.album_id || selectedAlbumId || '');
        formData.append('caption', data.caption || '');
        if (data.file) {
            formData.append('file', data.file);
        }
        if (isEdit) {
            formData.append('_method', 'PUT');
        }

        Inertia.post(isEdit ? `/gallery-media/${initialData.id}` : '/gallery-media', formData, {
            forceFormData: true,
            onSuccess: () => {
                // toast.success(isEdit ? 'Berhasil edit Media' : 'Berhasil tambah Media');
                // Inertia.get('/gallery-media');
                toast.success(isEdit ? 'Media berhasil diperbarui' : 'Media Berhasil ditambahkan');
                onClose();
                reset();
                Inertia.get('/gallery-media', { album_id: data.album_id }, { preserveScroll: true });
            },
            onError: (errors) => {
                if (errors.file) {
                    toast.error(errors.file);
                } else {
                    toast.error(`Gagal ${isEdit ? 'edit' : 'tambah'} Media`);
                }
                console.error('Error:', errors);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="flex max-h-[90vh] max-w-md flex-col">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Media' : 'Tambah Media'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="custom-scrollbar -mx-4 -mt-4 mb-4 flex-1 overflow-y-auto p-4">
                    <div className="space-y-2">
                        <Label htmlFor="file">File Media</Label>
                        {preview && (
                            <div className="mb-2">
                                {isVideo() ? (
                                    <video src={preview} controls className="h-32 w-32 rounded object-cover" />
                                ) : (
                                    <img src={preview} alt="Preview" className="h-32 w-32 rounded object-cover" />
                                )}
                            </div>
                        )}
                        <Input
                            id="file"
                            type="file"
                            onChange={(e) => setData('file', e.target.files?.[0] || null)}
                            accept="image/*,video/*"
                            required={!isEdit}
                        />
                        {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                    </div>

                    {!selectedAlbumId && (
                        <div className="space-y-2">
                            <Label htmlFor="album_id">Album</Label>
                            <Select
                                value={data.album_id?.toString()}
                                onValueChange={(value) => setData('album_id', value)}
                                disabled={!!selectedAlbumId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih album" />
                                </SelectTrigger>
                                <SelectContent>
                                    {albums.map((album) => (
                                        <SelectItem key={album.id} value={album.id.toString()}>
                                            {album.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.album_id && <p className="text-sm text-red-500">{errors.album_id}</p>}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="caption">Caption</Label>
                        <Textarea
                            id="caption"
                            value={data.caption}
                            onChange={(e) => setData('caption', e.target.value)}
                            placeholder="Masukkan caption media"
                            required
                        />
                        {errors.caption && <p className="text-sm text-red-500">{errors.caption}</p>}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {isEdit ? 'Simpan Perubahan' : 'Tambah Media'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
