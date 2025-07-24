import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export function StructureMemberFormModal({
  open,
  onClose,
  initialData,
  structures,
  selectedStructureId,
}) {
  const isEdit = !!initialData?.id;
  const [previewImage, setPreviewImage] = useState(null);
  const fileRef = useRef(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    picture: null,
    department: '',
    study_program: '',
    structure_id: '',
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setData({
        name: initialData.name || '',
        picture: null,
        department: initialData.department || '',
        study_program: initialData.study_program || '',
        structure_id: initialData.structure_id?.toString() || '',
      });
      if (initialData.picture) {
        setPreviewImage(`/storage/${initialData.picture}`);
      }
    } else {
      setData({
        name: '',
        picture: null,
        department: '',
        study_program: '',
        structure_id: String(selectedStructureId || ''),
      });
      setPreviewImage(null);
    }
  }, [initialData, open, selectedStructureId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('picture', file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
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

    if (isEdit) {
      formData.append('_method', 'PUT');
      post(`/structure-members/${initialData.id}`, {
        data: formData,
        onSuccess: () => {
          toast.success('Anggota struktur berhasil diperbarui!');
          onClose();
        },
        onError: () => toast.error('Gagal memperbarui anggota struktur.'),
        preserveScroll: true,
        preserveState: true,
      });
    } else {
      post('/structure-members', {
        data: formData,
        onSuccess: () => {
          toast.success('Anggota struktur berhasil ditambahkan!');
          onClose();
          reset();
          setPreviewImage(null);
          if (fileRef.current) fileRef.current.value = null;
        },
        onError: () => toast.error('Gagal menambahkan anggota struktur.'),
        preserveScroll: true,
        preserveState: true,
      });
    }
  };

  const selectedStructureName = structures.find(
    (s) => s.id === Number(data.structure_id)
  )?.name;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle>{isEdit ? 'Edit Anggota Struktur' : 'Tambah Anggota Struktur'}</DialogTitle>

        {errors.error && (
          <div className="rounded-md bg-red-100 border border-red-400 px-4 py-3 text-sm text-red-700 mb-4">
            {errors.error}
          </div>
        )}

  <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div className="md:col-span-2">
        <Label htmlFor="picture" className="block mb-2">Foto</Label>
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                Tidak ada gambar
              </div>
            )}
          </div>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileRef}
          />
          {errors.picture && (
            <p className="text-sm text-red-500">{errors.picture}</p>
          )}
        </div>
      </div>

      <div className="md:col-span-3 grid grid-cols-1 gap-4">
        {/* Nama */}
        <div>
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value.toLowerCase())}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Jurusan */}
        <div>
          <Label htmlFor="department">Jurusan</Label>
          <select
            id="department"
            value={data.department}
            onChange={(e) => setData('department', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Pilih Jurusan</option>
            <option value="Teknologi Informasi dan Komputer">Teknologi Informasi dan Komputer</option>
            <option value="Bisnis">Bisnis</option>
            <option value="Teknik Elektro">Teknik Elektro</option>
            <option value="Teknik Mesin">Teknik Mesin</option>
            <option value="Teknik Sipil">Teknik Sipil</option>
            <option value="Teknik Kimia">Teknik Kimia</option>
          </select>
          {errors.department && (
            <p className="text-sm text-red-500">{errors.department}</p>
          )}
        </div>

        {/* Program Studi */}
        <div>
          <Label htmlFor="study_program">Program Studi</Label>
          <Input
            id="study_program"
            value={data.study_program}
            onChange={(e) => setData('study_program', e.target.value)}
          />
          {errors.study_program && (
            <p className="text-sm text-red-500">{errors.study_program}</p>
          )}
        </div>

      </div>
    </div>

    <DialogFooter className="pt-4">
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

