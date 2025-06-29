import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function AlbumFormModal({ open, onClose, initialData }) {
    const isEdit = !!initialData?.id;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        is_private: false,
        ...initialData,
    });

    useEffect(() => {
        if (open) {
            // Hanya reset/set data jika modal dibuka
            if (initialData) {
                setData({
                    name: initialData.name || '',
                    is_private: initialData.is_private || false,
                });
            } else {
                reset();
            }
        }
    }, [initialData, open]); // Tambahkan 'open' ke dependency array

    function handleSubmit(e) {
        e.preventDefault();
        const action = isEdit
            ? put(`/gallery-album/${initialData.id}`, {
                  data,
                  onSuccess: () => {
                      toast.success('Album berhasil diperbarui!');
                      onClose();
                  },
                  onError: (errors) => {
                      // Menampilkan pesan error spesifik jika ada
                      const errorMessage = errors?.name || errors?.is_private || 'Gagal memperbarui album!';
                      toast.error(errorMessage);
                  },
              })
            : post('/gallery-album', {
                  data,
                  onSuccess: () => {
                      toast.success('Album berhasil ditambahkan!');
                      onClose();
                      reset();
                  },
                  onError: (errors) => {
                      // Menampilkan pesan error spesifik jika ada
                      const errorMessage = errors?.name || errors?.is_private || 'Gagal membuat album!';
                      toast.error(errorMessage);
                  },
              });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Album' : 'Tambah Album'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Album</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch id="is_private" checked={data.is_private} onCheckedChange={(checked) => setData('is_private', checked)} />
                        <Label htmlFor="is_private">Private Album</Label>
                    </div>
                    {errors.is_private && <p className="text-sm text-red-500">{errors.is_private}</p>}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" onClick={onClose}>
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {isEdit ? 'Simpan Perubahan' : 'Tambah'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
