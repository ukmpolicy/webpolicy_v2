import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function MemberFormModal({ open, onClose, initialData, periods, departments }) {
    const isEdit = !!initialData?.id;
    const [previewImage, setPreviewImage] = useState(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        period_id: '',
        picture: null,
        name: '',
        nim: '',
        address: '',
        email: '',
        department: '',
        study_program: '',
        joined_college_on: '',
        graduated_college_on: '',
        born_at: '',
        birth_date_at: '',
        ...initialData,
    });

    useEffect(() => {
        if (initialData) {
            setData({
                period_id: initialData.period_id || '',
                picture: null,
                name: initialData.name || '',
                nim: initialData.nim || '',
                address: initialData.address || '',
                email: initialData.email || '',
                department: initialData.department || '',
                study_program: initialData.study_program || '',
                joined_college_on: initialData.joined_college_on || '',
                graduated_college_on: initialData.graduated_college_on || '',
                born_at: initialData.born_at || '',
                birth_date_at: initialData.birth_date_at || '',
            });

            if (initialData.picture) {
                setPreviewImage(`/storage/${initialData.picture}`);
            }
        } else {
            // Reset form untuk create
            setData({
                period_id: '',
                picture: null,
                name: '',
                nim: '',
                address: '',
                email: '',
                department: '',
                study_program: '',
                joined_college_on: '',
                graduated_college_on: '',
                born_at: '',
                birth_date_at: '',
            });
            setPreviewImage(null);
        }
    }, [initialData, open]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('picture', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key === 'picture') {
                if (data[key] instanceof File || data[key] === null) {
                    formData.append(key, data[key] !== null ? data[key] : '');
                }
            } else if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const action = isEdit
            ? post(`/members/${initialData.id}`, {
                  data: formData,
                  onSuccess: () => {
                      toast.success('Member berhasil diupdate!');
                      onClose();
                  },
                  onError: (errors) => {
                      if (errors.email) {
                          toast.error('Email sudah terdaftar');
                      } else if (errors.nim) {
                          toast.error('NIM sudah terdaftar');
                      } else {
                          toast.error('Gagal mengupdate member');
                      }
                  },
                  preserveScroll: true,
                  preserveState: true,
              })
            : post('/members', {
                  data: formData,
                  onSuccess: () => {
                      toast.success('Member berhasil ditambahkan!');
                      onClose();
                      reset();
                  },
                  onError: (errors) => {
                      if (errors.email) {
                          toast.error('Email sudah terdaftar');
                      } else if (errors.nim) {
                          toast.error('NIM sudah terdaftar');
                      } else {
                          toast.error('Gagal menambahkan member');
                      }
                  },
                  preserveScroll: true,
                  preserveState: true,
              });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogTitle>{isEdit ? 'Edit Member' : 'Tambah Member'}</DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="col-span-1 space-y-2">
                            <Label htmlFor="picture">Foto Profil</Label>
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-gray-300">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                            <span className="text-gray-500">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <Input id="picture" type="file" onChange={handleImageChange} accept="image/*" className="w-full" />
                            </div>
                            {errors.picture && <p className="text-sm text-red-500">{errors.picture}</p>}
                        </div>

                        {/* Info Dasar */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="period_id">Periode</Label>
                                <Select value={data.period_id ? String(data.period_id) : ''} onValueChange={(value) => setData('period_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Periode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {periods.map((period) => (
                                            <SelectItem key={period.id} value={String(period.id)}>
                                                {' '}
                                                {period.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.period_id && <p className="text-sm text-red-500">{errors.period_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                        </div>

                        {/* NIM dan Email */}
                        <div className="space-y-2">
                            <Label htmlFor="nim">NIM</Label>
                            <Input id="nim" type="number" value={data.nim} onChange={(e) => setData('nim', e.target.value)} />
                            {errors.nim && <p className="text-sm text-red-500">{errors.nim}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* Alamat */}
                        <div className="col-span-1 space-y-2 md:col-span-2">
                            <Label htmlFor="address">Alamat</Label>
                            <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                        </div>

                        {/* Jurusan dan Prodi */}
                        <div className="space-y-2">
                            <Label htmlFor="department">Jurusan</Label>
                            <Select value={data.department} onValueChange={(value) => setData('department', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jurusan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="study_program">Program Studi</Label>
                            <Input id="study_program" value={data.study_program} onChange={(e) => setData('study_program', e.target.value)} />
                            {errors.study_program && <p className="text-sm text-red-500">{errors.study_program}</p>}
                        </div>

                        {/* Tahun Masuk dan Lulus */}
                        <div className="space-y-2">
                            <Label htmlFor="joined_college_on">Tahun Masuk</Label>
                            <Input
                                id="joined_college_on"
                                type="number"
                                value={data.joined_college_on}
                                onChange={(e) => setData('joined_college_on', e.target.value)}
                            />
                            {errors.joined_college_on && <p className="text-sm text-red-500">{errors.joined_college_on}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="graduated_college_on">Tahun Lulus</Label>
                            <Input
                                id="graduated_college_on"
                                type="number"
                                value={data.graduated_college_on || ''}
                                onChange={(e) => setData('graduated_college_on', e.target.value)}
                            />
                            {errors.graduated_college_on && <p className="text-sm text-red-500">{errors.graduated_college_on}</p>}
                        </div>

                        {/* Tempat dan Tanggal Lahir */}
                        <div className="space-y-2">
                            <Label htmlFor="born_at">Tempat Lahir</Label>
                            <Input id="born_at" value={data.born_at} onChange={(e) => setData('born_at', e.target.value)} />
                            {errors.born_at && <p className="text-sm text-red-500">{errors.born_at}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="birth_date_at">Tanggal Lahir</Label>
                            <Input
                                id="birth_date_at"
                                type="date"
                                value={data.birth_date_at ? new Date(data.birth_date_at).toISOString().split('T')[0] : ''}
                                onChange={(e) => setData('birth_date_at', e.target.value)}
                            />
                            {errors.birth_date_at && <p className="text-sm text-red-500">{errors.birth_date_at}</p>}
                        </div>
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
