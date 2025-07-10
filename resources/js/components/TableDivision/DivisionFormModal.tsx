import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function DivisionFormModal({ open, onClose, initialData }) {
    const isEdit = !!initialData?.id;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        ...initialData,
    });

    useEffect(() => {
        if (initialData) {
            setData({
                name: initialData.name || '',
            });
        } else {
            reset();
        }
    }, [initialData, open]);

    function handleSubmit(e) {
        e.preventDefault();
        // Normalisasi nama sebelum submit
        const formattedData = {
            ...data,
            name: data.name.toLowerCase().replace(/\s+/g, ' ').trim(),
        };

        const action = isEdit
            ? put(`/divisions/${initialData.id}`, {
                  data: formattedData,
                  onSuccess: () => {
                      toast.success('Divisi berhasil diperbarui!');
                      onClose();
                  },
                  onError: (errors) => {
                      toast.error('Gagal memperbarui divisi.');
                  },
              })
            : post('/divisions', {
                  data: formattedData,
                  onSuccess: () => {
                      toast.success('Divisi berhasil ditambahkan!');
                      onClose();
                      reset();
                  },
                  onError: (errors) => {
                      toast.error('Gagal menambahkan divisi.');
                  },
              });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Divisi' : 'Tambah Divisi'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Divisi</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" onClick={onClose}>
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {isEdit ? 'Simpan Perubahan' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
