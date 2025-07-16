import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export function CategoryFormModal({ open, onClose, initialData }: any) {
    const isEdit = !!initialData?.id;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        ...initialData,
    });

    // Fungsi untuk menormalisasi teks: huruf kecil dan spasi tunggal
    const normalizeText = (text: string): string => {
        return text.toLowerCase().trim().replace(/\s+/g, ' ');
    };

    useEffect(() => {
        if (open) {
            if (initialData) {
                setData({
                    name: initialData.name || '',
                });
            } else {
                reset();
            }
        }
    }, [initialData, open]);

    function handleSubmit(e: any) {
        e.preventDefault();

        // Normalisasi data sebelum dikirim ke server
        const normalizedData = {
            name: normalizeText(data.name),
        };

        setData('name', normalizedData.name);

        if (isEdit) {
            put(`/category-articles/${initialData.id}`, {
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            post('/category-articles', {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Kategori Artikel' : 'Tambah Kategori Artikel'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Kategori</Label>
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
                            {isEdit ? 'Simpan Perubahan' : 'Tambah'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
