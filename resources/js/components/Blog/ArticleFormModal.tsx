import { useForm } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MultiSelect } from '../ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

export function ArticleFormModal({ open, onClose, initialData, categories }) {
    const isEdit = !!initialData?.id;

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [previewPicture, setPreviewPicture] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        picture: null,
        summary: '',
        content: '',
        status: 'draft', // default status
        category_ids: [],
        _method: isEdit ? 'put' : 'post', // Penting untuk Inertia file uploads dengan PUT
        remove_picture: false, // Tambahan untuk menghapus gambar
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                setData({
                    title: initialData.title || '',
                    picture: null, // Gambar akan di-handle terpisah
                    summary: initialData.summary || '',
                    content: initialData.content || '',
                    status: initialData.status || 'draft',
                    category_ids: initialData.categories?.map((cat) => cat.id) || [],
                    _method: 'put',
                    remove_picture: false,
                });
                // Set preview gambar jika ada
                setPreviewPicture(initialData.picture ? `/storage/${initialData.picture}` : null);
                // Set multi-select categories
                setSelectedCategories(initialData.categories?.map((cat) => ({ value: cat.id, label: cat.name })) || []);
            } else {
                reset();
                setPreviewPicture(null);
                setSelectedCategories([]);
            }
        }
    }, [initialData, open]);

    useEffect(() => {
        setData(
            'category_ids',
            selectedCategories.map((cat) => cat.value),
        );
    }, [selectedCategories]);

    function handleSubmit(e) {
        e.preventDefault();

        // Pastikan picture dikirim sebagai File atau null, bukan string URL
        const formData = new FormData();
        for (const key in data) {
            if (key !== 'picture' && key !== 'category_ids' && key !== '_method') {
                formData.append(key, data[key]);
            }
        }
        if (data.picture) {
            formData.append('picture', data.picture);
        }
        data.category_ids.forEach((id) => formData.append('category_ids[]', id));
        formData.append('_method', isEdit ? 'put' : 'post');

        const submitAction = isEdit
            ? post(`/articles/${initialData.id}`, formData, {
                  onSuccess: () => {
                      toast.success('Artikel berhasil diperbarui!');
                      onClose();
                  },
                  onError: (errors) => {
                      const errorMessage = Object.values(errors).join('\n') || 'Gagal memperbarui artikel!';
                      toast.error(errorMessage);
                  },
              })
            : post('/articles', formData, {
                  onSuccess: () => {
                      toast.success('Artikel berhasil ditambahkan!');
                      onClose();
                      reset();
                  },
                  onError: (errors) => {
                      const errorMessage = Object.values(errors).join('\n') || 'Gagal membuat artikel!';
                      toast.error(errorMessage);
                  },
              });
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('picture', file);
        if (file) {
            setPreviewPicture(URL.createObjectURL(file));
        } else {
            setPreviewPicture(initialData?.picture ? `/storage/${initialData.picture}` : null);
        }
        setData('remove_picture', false); // Jika memilih gambar baru, jangan hapus yang lama
    };

    const handleRemovePicture = () => {
        setData('picture', null);
        setData('remove_picture', true);
        setPreviewPicture(null);
    };

    const categoryOptions = categories.map((cat) => ({ value: cat.id, label: cat.name }));

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Artikel' : 'Tambah Artikel'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Artikel</Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="picture">Gambar Artikel (opsional)</Label>
                        <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
                        {previewPicture && (
                            <div className="relative mt-2 h-32 w-32 rounded-md border p-1">
                                <img src={previewPicture} alt="Preview" className="h-full w-full rounded-sm object-cover" />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                    onClick={handleRemovePicture}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        {errors.picture && <p className="text-sm text-red-500">{errors.picture}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="summary">Ringkasan Artikel</Label>
                        <Textarea id="summary" value={data.summary} onChange={(e) => setData('summary', e.target.value)} rows={3} />
                        {errors.summary && <p className="text-sm text-red-500">{errors.summary}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Konten Artikel (MDX)</Label>
                        {/* MD Editor */}
                        <MDEditor
                            value={data.content}
                            onChange={(newValue) => setData('content', newValue || '')}
                            height={400}
                            preview="edit" // Tampilkan editor dan preview secara berdampingan
                            className="dark:text-white"
                        />
                        {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categories">Kategori</Label>
                        {/* Anda perlu mengimplementasikan komponen MultiSelect ini */}
                        {/* Contoh sederhana untuk MultiSelect: */}
                        <MultiSelect
                            options={categoryOptions}
                            selected={selectedCategories}
                            onChange={setSelectedCategories}
                            placeholder="Pilih Kategori..."
                        />
                        {errors.category_ids && <p className="text-sm text-red-500">{errors.category_ids}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draf</SelectItem>
                                <SelectItem value="published">Terbit</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
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
