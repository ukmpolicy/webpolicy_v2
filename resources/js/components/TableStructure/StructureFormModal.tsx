import { Button } from '@/components/ui/button';
import {
    Dialog, DialogClose, DialogContent, DialogFooter,
    DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function StructureFormModal({ open, onClose, initialData, divisions = [], periods = [] }) {
    const isEdit = !!initialData?.id;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        level: '',
        division_id: '',
        period_id: '',
        has_many_member: 0,
        ...initialData,
    });

    useEffect(() => {
        if (initialData) {
            setData({
                name: initialData.name || '',
                level: initialData.level?.toString() || '',
                division_id: initialData.division_id?.toString() || '',
                period_id: initialData.period_id?.toString() || '',
                has_many_member: Number(initialData.has_many_member ?? 0)
            });
        } else {
            reset();
        }
    }, [initialData, open]);

    useEffect(() => {
        if (!isEdit && data.period_id && data.level === '') {
            fetchNextLevel(data.period_id, data.division_id || null);
        }
    }, [data.period_id, data.division_id]);

    useEffect(() => {
    if (!isEdit && open && data.period_id) {
        fetchNextLevel(data.period_id, data.division_id || null);
    }
    }, [open]);


    async function fetchNextLevel(period_id: string, division_id: string | null) {
        try {
            const query = new URLSearchParams({ period_id });
            if (division_id) query.append('division_id', division_id);

            const res = await fetch(`/structures/next-level?${query.toString()}`);
            const json = await res.json();

            console.log('Level hasil fetch:', json.level); 

            setData('level', json.level ?? '');
        } catch (err) {
            console.error('Gagal mengambil level', err);
        }
    }


    function handleSubmit(e) {
        e.preventDefault();

        const action = isEdit
            ? put(`/structures/${initialData.id}`, {
                  data,
                  onSuccess: () => {
                      toast.success('Struktur berhasil diperbarui!');
                      onClose();
                  },
                  onError: () => toast.error('Gagal memperbarui struktur!'),
              })
            : post('/structures', {
                  data,
                  onSuccess: () => {
                      toast.success('Struktur berhasil ditambahkan!');
                      onClose();
                      reset();
                  },
                  onError: () => toast.error('Gagal menambahkan struktur!'),
              });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Struktur' : 'Tambah Struktur'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Struktur</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/*
                    <div className="space-y-2">
                        <Label htmlFor="level">Level</Label>
                        <Input
                        id="level"
                        name="level"
                        type="text"
                        value={data.level}
                        readOnly
                        className="bg-gray-100 cursor-not-allowed"
                        />
                        {errors.level && <p className="text-sm text-red-500">{errors.level}</p>}
                    </div>
                    */}

                    <div className="space-y-2">
                        <Label htmlFor="division_id">Divisi</Label>
                        <Select value={data.division_id} onValueChange={(val) => setData('division_id', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih divisi" />
                            </SelectTrigger>
                            <SelectContent>
                                {divisions.map((d) => (
                                    <SelectItem key={d.id} value={d.id.toString()}>
                                        {d.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.division_id && <p className="text-sm text-red-500">{errors.division_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="period_id">Periode</Label>
                        <Select value={data.period_id} onValueChange={(val) => setData('period_id', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih periode" />
                            </SelectTrigger>
                            <SelectContent>
                                {periods.map((p) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.period_id && <p className="text-sm text-red-500">{errors.period_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="has_many_member">Banyak Anggota?</Label>
                        <Select
                            value={data.has_many_member?.toString()}
                            onValueChange={(val) => setData('has_many_member', Number(val))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih opsi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Ya</SelectItem>
                                <SelectItem value="0">Tidak</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.has_many_member && (
                            <p className="text-sm text-red-500">{errors.has_many_member}</p>
                        )}
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
