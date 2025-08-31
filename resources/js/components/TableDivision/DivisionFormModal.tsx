import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';

export function DivisionFormModal({ open, onClose, initialData, periods = [] }) {
    const isEdit = !!initialData?.id;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        period_id: '',
        ...initialData,
    });

    useEffect(() => {
        if (initialData) {
            // Jika dalam mode edit, set data sesuai initialData
            setData({
                name: initialData.name || '',
                description: initialData.description || '',
                period_id: initialData.period_id ? String(initialData.period_id) : '',
            });
        } else {
            // Jika dalam mode tambah, reset form
            reset();
            // *PERUBAHAN DI SINI:* Set period_id ke string kosong untuk menampilkan placeholder
            setData('period_id', '');
        }
    }, [initialData, open]); // Hapus 'periods' dari dependency array karena tidak memengaruhi inisialisasi default 'period_id'

    function handleSubmit(e) {
        e.preventDefault();

        // Normalisasi nama sebelum submit
        const formattedData = {
            ...data,
            name: data.name.toLowerCase().replace(/\s+/g, ' ').trim(),
        };

        const submitMethod = isEdit ? put : post;
        const url = isEdit ? `/divisions/${initialData.id}` : '/divisions';

        submitMethod(url, {
            data: formattedData,
            onSuccess: () => {
                toast.success(`Divisi berhasil di${isEdit ? 'perbarui' : 'tambahkan'}!`);
                onClose();
                if (!isEdit) {
                    reset();
                }
            },
            onError: (formErrors) => {
                console.error('Form Errors:', formErrors);
                toast.error(`Gagal ${isEdit ? 'memperbarui' : 'menambahkan'} divisi.`);
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
                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Tulis deskripsi divisi di sini..."
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="period_id">Periode</Label>
                        <Select value={data.period_id} onValueChange={(value) => setData('period_id', value)}>
                            <SelectTrigger>
                                {/* Placeholder "Pilih Periode" akan ditampilkan di sini */}
                                <SelectValue placeholder="Pilih Periode" />
                            </SelectTrigger>
                            <SelectContent>
                                {periods.length === 0 && (
                                    <SelectItem value="" disabled>
                                        Tidak ada periode tersedia
                                    </SelectItem>
                                )}
                                {/* Opsional: Anda bisa menambahkan opsi "Pilih Periode" eksplisit di sini */}
                                {/* <SelectItem value="">Pilih Periode</SelectItem> */}
                                {periods.map((period) => (
                                    <SelectItem key={period.id} value={String(period.id)}>
                                        {period.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.period_id && <p className="text-sm text-red-500">{errors.period_id}</p>}
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
