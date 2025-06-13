import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface PeriodFormModalProps {
    open: boolean;
    onClose: () => void;
    initialData?: {
        id?: number;
        name: string;
        started_at: string; // format ISO: YYYY-MM-DDTHH:mm
        ended_at: string; // format ISO: YYYY-MM-DDTHH:mm
        is_active: boolean;
    };
}

export function PeriodFormModal({ open, onClose, initialData }: PeriodFormModalProps) {
    const isEdit = !!initialData?.id;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        started_at: '',
        ended_at: '',
        is_active: false,
        ...initialData,
    });

    // ✅ Update form saat initialData berubah
    useEffect(() => {
        if (initialData) {
            Object.entries(initialData).forEach(([key, value]) => {
                setData(key as any, value);
            });
        }
    }, [initialData, setData]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!data.started_at || !data.ended_at) {
            toast.error('Tanggal mulai dan berakhir harus diisi');
            return;
        }

        const start = new Date(data.started_at);
        const end = new Date(data.ended_at);

        if (start > end) {
            toast.error('Tanggal mulai tidak boleh lebih besar dari tanggal selesai');
            return;
        }

        if (isEdit) {
            put(`/periods/${initialData.id}`, {
                data,
                onSuccess: () => {
                    toast.success('Periode berhasil diubah!');
                    onClose();
                    reset();
                },
                onError: () => {
                    toast.error('Gagal mengubah periode.');
                },
            });
        } else {
            post('/periods', {
                data,
                onSuccess: () => {
                    toast.success('Periode berhasil ditambahkan!');
                    onClose();
                    reset();
                },
                onError: () => {
                    toast.error('Gagal menambahkan periode.');
                },
            });
        }
    }
    // function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    //     e.preventDefault();

    //     if (!data.started_year || !data.ended_year) {
    //         toast.error('Tahun mulai dan selesai harus diisi');
    //         return;
    //     }

    //     if (parseInt(data.started_year) > parseInt(data.ended_year)) {
    //         toast.error('Tahun mulai tidak boleh lebih besar dari tahun selesai');
    //         return;
    //     }

    //     const payload = {
    //         ...data,
    //         started_at: `${data.started_year}-01-01 00:00:00`,
    //         ended_at: `${data.ended_year}-01-01 00:00:00`,
    //     };

    //     delete payload.started_year;
    //     delete payload.ended_year;

    //     if (isEdit) {
    //         put(`/periods/${initialData.id}`, {
    //             data: payload,
    //             onSuccess: () => {
    //                 toast.success('Periode berhasil diubah!');
    //                 onClose();
    //                 reset();
    //             },
    //             onError: () => {
    //                 toast.error('Gagal mengubah periode.');
    //             },
    //         });
    //     } else {
    //         post('/periods', {
    //             data: payload,
    //             onSuccess: () => {
    //                 toast.success('Periode berhasil ditambahkan!');
    //                 onClose();
    //                 reset();
    //             },
    //             onError: () => {
    //                 toast.error('Gagal menambahkan periode.');
    //             },
    //         });
    //     }
    // }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>{isEdit ? 'Edit Periode' : 'Tambah Periode'}</DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Nama Periode</Label>
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Contoh: 2024-2025" required />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <Label>Tanggal Mulai</Label>
                        <Input
                            type="date"
                            value={data.started_at.split(' ')[0]} // Hapus waktu jika ada
                            onChange={(e) => setData('started_at', e.target.value)}
                        />
                        <InputError message={errors.started_at || errors.ended_at} />
                    </div>

                    <div>
                        <Label>Tanggal Berakhir</Label>
                        <Input type="date" value={data.ended_at?.split(' ')[0] || ''} onChange={(e) => setData('ended_at', e.target.value)} />
                        <InputError message={errors.ended_at} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                        <Label htmlFor="is_active">Status: {data.is_active ? 'Aktif' : 'Tidak Aktif'}</Label>
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
