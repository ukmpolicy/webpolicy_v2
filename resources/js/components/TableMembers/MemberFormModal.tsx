import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { Select } from '@radix-ui/react-select';
import React, { useEffect, useState } from 'react';

import { toast } from 'sonner';

interface MemberFormModalProps {
    open: boolean;
    onClose: () => void;
    initialData: any;
    periods: { id: number; name: string }[];
}

// Opsi Jurusan
const jurusanOptions = ['Teknologi Informasi dan Komputer', 'Bisnis', 'Teknik Elektro', 'Teknik Mesin', 'Teknik Sipil', 'Teknik Kimia'];

export function MemberFormModal({ open, onClose, initialData, periods }: MemberFormModalProps) {
    const isEdit = !!initialData?.id;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        period_id: '',
        name: '',
        nim: '',
        address: '',
        email: '',
        department: '', // Jurusan
        study_program: '', // Program Studi
        joined_college_on: '',
        graduated_college_on: '',
        born_at: '',
        birth_date_at: '',
        picture: null as File | null,
        ...initialData,
    });

    const [preview, setPreview] = useState<string | null>(initialData?.picture ? `/storage/${initialData.picture}` : null);

    // Update preview foto jika ada
    useEffect(() => {
        if (initialData?.picture) {
            setPreview(`/storage/${initialData.picture}`);
        }
    }, [initialData]);

    // Update form ketika initialData berubah
    useEffect(() => {
        Object.entries(initialData).forEach(([key, value]) => {
            if (value !== undefined) {
                setData(key as any, value);
            }
        });
    }, [initialData, setData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('picture', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const options = {
            forceFormData: true,
            onError: () => {
                toast.error('Gagal memproses member.');

                // Kosongkan hanya field yang error
                if (errors.nim) {
                    setData('nim', '');
                }

                if (errors.email) {
                    setData('email', '');
                }
            },
            onSuccess: () => {
                toast.success(isEdit ? 'Member berhasil diubah!' : 'Member berhasil ditambahkan!');
                onClose();
                reset();
                setPreview(null);
            },
        };

        if (isEdit) {
            put(`/members/${initialData.id}`, options);
        } else {
            post('/members', options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-6">
                <DialogTitle>{isEdit ? 'Edit Member' : 'Tambah Member'}</DialogTitle>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                    {/* Foto - Di atas */}
                    <div className="text-center">
                        <Label>Foto</Label>
                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                        {preview && <img src={preview} alt="Foto Preview" className="mx-auto mt-2 h-32 w-32 rounded object-cover" />}
                        <InputError message={errors.picture} />
                    </div>

                    {/* Baris Pertama */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="period_id">Periode</Label>
                            <Select value={data.period_id} onValueChange={(value) => setData('period_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Periode" />
                                </SelectTrigger>
                                <SelectContent>
                                    {periods.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.period_id} />
                        </div>

                        <div>
                            <Label>Nama</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            <InputError message={errors.name} />
                        </div>
                    </div>

                    {/* Baris Kedua */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label>NIM</Label>
                            <Input type="number" value={data.nim} onChange={(e) => setData('nim', e.target.value)} required />
                            <InputError message={errors.nim} />
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                            <InputError message={errors.email} />
                        </div>
                    </div>

                    {/* Baris Ketiga */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label>Alamat</Label>
                            <Input value={data.address} onChange={(e) => setData('address', e.target.value)} required />
                            <InputError message={errors.address} />
                        </div>

                        <div>
                            <Label>Jurusan</Label>
                            <Select value={data.department} onValueChange={(value) => setData('department', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jurusan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jurusanOptions.map((jurusan, index) => (
                                        <SelectItem key={index} value={jurusan}>
                                            {jurusan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.department} />
                        </div>
                    </div>

                    {/* Baris Keempat */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label>Program Studi</Label>
                            <Input value={data.study_program} onChange={(e) => setData('study_program', e.target.value)} required />
                            <InputError message={errors.study_program} />
                        </div>

                        <div>
                            <Label>Tahun Masuk</Label>
                            <Input
                                type="number"
                                value={data.joined_college_on}
                                onChange={(e) => setData('joined_college_on', e.target.value)}
                                required
                            />
                            <InputError message={errors.joined_college_on} />
                        </div>
                    </div>

                    {/* Baris Kelima */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label>Tahun Lulus</Label>
                            <Input
                                type="number"
                                value={data.graduated_college_on || ''}
                                onChange={(e) => setData('graduated_college_on', e.target.value)}
                            />
                            <InputError message={errors.graduated_college_on} />
                        </div>

                        <div>
                            <Label>Tempat Lahir</Label>
                            <Input value={data.born_at || ''} onChange={(e) => setData('born_at', e.target.value)} />
                            <InputError message={errors.born_at} />
                        </div>
                    </div>

                    {/* Baris Keenam */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label>Tanggal Lahir</Label>
                            <Input
                                type="date"
                                value={data.birth_date_at?.split(' ')[0] || ''}
                                onChange={(e) => setData('birth_date_at', e.target.value)}
                                required
                            />
                            <InputError message={errors.birth_date_at} />
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <DialogFooter className="mt-6 flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={onClose}>
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
