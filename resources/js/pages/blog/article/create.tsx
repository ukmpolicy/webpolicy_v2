import TuiEditor from '@/components/tui-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ArticleCreate({ categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        picture: null,
        summary: '',
        content: '',
        status: 'draft',
        category_ids: [],
    });

    const page = usePage();

    const [previewPicture, setPreviewPicture] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        setData(
            'category_ids',
            selectedCategories.map((cat) => cat.value),
        );
    }, [selectedCategories]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            if (errors.picture) {
                if (typeof errors.picture === 'string') {
                    toast.error(errors.picture);
                } else if (Array.isArray(errors.picture)) {
                    errors.picture.forEach((msg) => toast.error(msg));
                }
            } else {
                Object.values(errors).forEach((errorMessage) => {
                    if (typeof errorMessage === 'string') {
                        toast.error(errorMessage);
                    } else if (Array.isArray(errorMessage)) {
                        errorMessage.forEach((msg) => toast.error(msg));
                    }
                });
            }
        }
    }, [errors]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('summary', data.summary);
        formData.append('content', data.content);
        formData.append('status', data.status);
        if (data.picture) {
            formData.append('picture', data.picture);
        }
        selectedCategories.forEach((cat) => {
            formData.append('category_ids[]', cat.value);
        });

        post('/articles', {
            body: formData,
            onSuccess: () => {
                toast.success('Artikel berhasil ditambahkan!');
                reset();
            },
            onError: (formErrors) => {
                console.error(formErrors);
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('picture', file);
            setPreviewPicture(URL.createObjectURL(file));
        } else {
            setData('picture', null);
            setPreviewPicture(null);
        }
    };

    const removeImage = () => {
        setData('picture', null);
        setPreviewPicture(null);
    };

    const categoryOptions = categories.map((cat) => ({ value: cat.id, label: cat.name }));

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Blog', href: '#' },
                { title: 'Artikel', href: '/articles' },
                { title: 'Tambah Artikel', href: '/articles/create' },
            ]}
        >
            <Head title="Tambah Artikel" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header Page Title dan Tombol Aksi untuk Desktop */}
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Tambah Artikel Baru</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Buat artikel baru untuk blog Anda.</p>
                        </div>
                    </div>
                    {/* Tombol Aksi Desktop (Hidden on mobile) */}
                    <div className="mt-4 flex hidden gap-3 md:mt-0 md:flex">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            <X className="mr-2 h-4 w-4" />
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} form="article-form">
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Artikel'}
                        </Button>
                    </div>
                </div>

                <form id="article-form" onSubmit={handleSubmit} className="flex-1">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Kolom Kiri untuk Desktop */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* 1. Upload Gambar Artikel (Urutan 1 di Mobile & Desktop Kiri) */}
                            <div className="bg-card rounded-lg border p-6 shadow-md">
                                <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">Gambar Artikel</h2>
                                <div>
                                    <Label htmlFor="picture" className="mb-2 block">
                                        Upload Gambar
                                    </Label>
                                    <input
                                        id="picture"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                                    />
                                    {errors.picture && <p className="mt-2 text-sm text-red-500">{errors.picture}</p>}

                                    {previewPicture && (
                                        <div className="relative mt-4 overflow-hidden rounded-md border">
                                            <img src={previewPicture} alt="Preview" className="h-40 w-full object-cover" />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500/80 p-0 text-white hover:bg-red-600/90"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Ini adalah tempat untuk Judul Artikel di mobile, tapi di desktop akan ada di kolom kanan. */}
                            <div className="bg-card rounded-lg border p-6 shadow-md lg:hidden">
                                <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">Informasi Dasar</h2>
                                <div className="space-y-5">
                                    <div>
                                        <Label htmlFor="title_mobile" className="mb-2 block">
                                            Judul Artikel <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title_mobile"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Masukkan judul artikel yang menarik..."
                                            className="w-full"
                                        />
                                        {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Konten Artikel (Urutan 3 di Mobile & Desktop Kiri) */}
                            <div className="bg-card rounded-lg border p-6 shadow-md">
                                <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">Konten Artikel</h2>
                                <div>
                                    <Label className="mb-2 block">
                                        Konten <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="mt-3">
                                        <TuiEditor initialValue={data.content} onChange={(val) => setData('content', val)} height="500px" />
                                    </div>
                                    {errors.content && <p className="mt-2 text-sm text-red-500">{errors.content}</p>}
                                </div>
                            </div>

                            {/* 3. Ringkasan Artikel (Urutan 4 di Mobile & Desktop Kiri) */}
                            <div className="bg-card rounded-lg border p-6 shadow-md">
                                <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">Ringkasan Artikel</h2>
                                <div>
                                    <Label htmlFor="summary" className="mb-2 block">
                                        Ringkasan
                                    </Label>
                                    <Textarea
                                        id="summary"
                                        value={data.summary}
                                        onChange={(e) => setData('summary', e.target.value)}
                                        placeholder="Ringkasan singkat yang menggambarkan isi artikel..."
                                        rows={4}
                                        className="w-full"
                                    />
                                    {errors.summary && <p className="mt-2 text-sm text-red-500">{errors.summary}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan untuk Desktop */}
                        <div className="space-y-6 lg:col-span-1">
                            {/* 1. Judul Artikel (Urutan 2 di Desktop Kanan, hidden di mobile karena sudah ada di kiri) */}
                            <div className="bg-card hidden rounded-lg border p-6 shadow-md lg:block">
                                <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">Informasi Dasar</h2>
                                <div className="space-y-5">
                                    <div>
                                        <Label htmlFor="title_desktop" className="mb-2 block">
                                            Judul Artikel <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title_desktop"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Masukkan judul artikel yang menarik..."
                                            className="w-full"
                                        />
                                        {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Kategori Artikel (Urutan 5 di Mobile & Desktop Kanan) */}
                            <div className="bg-card rounded-lg border p-6 shadow-md">
                                <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">Kategori Artikel</h2>
                                <div>
                                    <Label className="mb-2 block">Pilih Kategori</Label>
                                    <MultiSelect
                                        options={categoryOptions}
                                        selected={selectedCategories}
                                        onChange={setSelectedCategories}
                                        placeholder="Pilih satu atau lebih kategori..."
                                        className="w-full"
                                    />
                                    {errors.category_ids && <p className="mt-2 text-sm text-red-500">{errors.category_ids}</p>}
                                </div>
                            </div>

                            {/* 3. Publikasi (Urutan 6 di Mobile & Desktop Kanan) */}
                            <div className="bg-card rounded-lg border p-6 shadow-md">
                                <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">Publikasi</h2>
                                <div>
                                    <Label htmlFor="status" className="mb-2 block">
                                        Status
                                    </Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger id="status" className="w-full">
                                            <SelectValue placeholder="Pilih Status Publikasi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="mt-2 text-sm text-red-500">{errors.status}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi untuk Mobile (muncul di bawah, sembunyi di desktop) */}
                    <div className="bg-card mt-8 flex justify-end gap-3 rounded-lg border p-4 shadow-md md:hidden">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            <X className="mr-2 h-4 w-4" />
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Artikel'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
