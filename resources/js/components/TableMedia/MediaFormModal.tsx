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
    type MediaFormData = {
        album_id: string;
        caption: string;
        file: File | null;
    };

    const { data, setData, processing, errors, reset } = useForm<MediaFormData>({
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
                    file: null, // Penting: reset file saat membuka modal edit, agar user harus memilih ulang jika ingin mengubahnya
                });
                setPreview(initialData.file ? `/storage/${initialData.file}` : null);
            } else {
                reset(); // Reset form untuk mode tambah
                setData('album_id', selectedAlbumId || ''); // Set album_id default untuk mode tambah
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
        } else {
            setPreview(null); // Bersihkan preview jika tidak ada file yang dipilih
        }
    }, [data.file]);

    const isVideo = () => {
        // Logika ini sudah baik, tidak perlu diubah
        if (data.file && data.file.type) return data.file.type.startsWith('video/');
        if (initialData?.mimetype) return initialData.mimetype.startsWith('video/');
        if (preview && preview.match(/\.(mp4|mov|avi)$/i)) return true;
        return false;
    };

    function handleSubmit(e) {
        e.preventDefault();

        // --- VALIDASI UKURAN FILE DI FRONTEND ---
        // Ini adalah langkah pertama dan paling penting untuk memberikan feedback instan
        if (data.file && data.file instanceof File) {
            const file = data.file;
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            const maxImageSize = 2 * 1024 * 1024; // 2 MB
            const maxVideoSize = 7 * 1024 * 1024; // 7 MB

            if (isImage && file.size > maxImageSize) {
                toast.error('Ukuran file gambar melebihi batas 2 MB. Mohon unggah file yang lebih kecil.');
                return; // Hentikan proses submit
            }

            if (isVideo && file.size > maxVideoSize) {
                toast.error('Ukuran file video melebihi batas 7 MB. Mohon unggah file yang lebih kecil.');
                return; // Hentikan proses submit
            }
        }
        // --- AKHIR VALIDASI ---

        // Validasi manual album_id yang sudah ada
        if (!data.album_id || data.album_id === '') {
            toast.error('Album wajib dipilih');
            return;
        }

        // Persiapan data untuk dikirim
        const formData = new FormData();
        formData.append('album_id', data.album_id || selectedAlbumId || '');
        formData.append('caption', data.caption || '');
        if (data.file) {
            formData.append('file', data.file);
        }
        if (isEdit) {
            formData.append('_method', 'PUT'); // Penting untuk metode PUT di Laravel
        }

        // Mengirim data menggunakan Inertia
        Inertia.post(isEdit ? `/gallery-media/${initialData.id}` : '/gallery-media', formData, {
            forceFormData: true, // Pastikan Inertia mengirim sebagai FormData
            onSuccess: () => {
                toast.success(isEdit ? 'Media berhasil diperbarui' : 'Media berhasil ditambahkan');
                onClose(); // Tutup modal
                reset(); // Reset form
                // Muat ulang data di halaman tanpa reload penuh, mempertahankan filter & scroll
                Inertia.reload({ preserveScroll: true, preserveState: true });
            },
            onError: (inertiaErrors) => {
                // Menampilkan semua pesan error dari backend
                if (inertiaErrors && Object.keys(inertiaErrors).length > 0) {
                    Object.values(inertiaErrors).forEach((errorMsg) => {
                        toast.error(errorMsg);
                    });
                } else {
                    // Pesan fallback jika terjadi error tak terduga (misal server error 500)
                    toast.error(`Gagal ${isEdit ? 'memperbarui' : 'menambahkan'} media. Silakan coba lagi.`);
                }
                console.error('Error from Inertia:', inertiaErrors);
            },
        });
    }
    // function handleSubmit(e) {
    //     e.preventDefault();

    //     // Validasi manual album_id (tetap dipertahankan)
    //     if (!data.album_id || data.album_id === '') {
    //         toast.error('Album wajib dipilih');
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('album_id', data.album_id || selectedAlbumId || '');
    //     formData.append('caption', data.caption || '');
    //     if (data.file) {
    //         formData.append('file', data.file);
    //     }
    //     if (isEdit) {
    //         formData.append('_method', 'PUT'); // Penting untuk metode PUT di Laravel
    //     }

    //     Inertia.post(isEdit ? `/gallery-media/${initialData.id}` : '/gallery-media', formData, {
    //         forceFormData: true, // Pastikan Inertia mengirim sebagai FormData
    //         onSuccess: () => {
    //             toast.success(isEdit ? 'Media berhasil diperbarui' : 'Media Berhasil ditambahkan');
    //             onClose(); // Tutup modal
    //             reset(); // Reset form
    //             // Muat ulang halaman untuk menampilkan media terbaru, pertahankan scroll dan state filter
    //             Inertia.get('/gallery-media', { album_id: data.album_id }, { preserveScroll: true, preserveState: true });
    //         },
    //         onError: (inertiaErrors) => {
    //             // *** PERUBAHAN UTAMA DI SINI ***
    //             // Iterasi melalui semua error yang dikirim oleh Inertia dari Laravel
    //             if (inertiaErrors && Object.keys(inertiaErrors).length > 0) {
    //                 Object.values(inertiaErrors).forEach((errorMsg) => {
    //                     toast.error(errorMsg); // Tampilkan setiap pesan kesalahan
    //                 });
    //             } else {
    //                 // Fallback message jika tidak ada error spesifik dari Inertia (misal dari server error 500)
    //                 toast.error(`Gagal ${isEdit ? 'edit' : 'tambah'} Media. Silakan coba lagi.`);
    //             }
    //             console.error('Error from Inertia:', inertiaErrors);
    //         },
    //     });
    // }

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
                            required={!isEdit} // File wajib diisi saat tambah, tapi tidak wajib saat edit
                        />
                        {/* Menampilkan error spesifik untuk 'file' field */}
                        {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                    </div>

                    {/* Bagian ini sudah bagus, tidak perlu diubah */}
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
