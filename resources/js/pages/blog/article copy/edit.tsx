import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head, useForm, usePage } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ArticleEdit({ article, categories }: any) {
    const { data, setData, post, processing, errors } = useForm({
        title: article.title || '',
        picture: null as File | null,
        summary: article.summary || '',
        content: article.content || '',
        status: article.status || 'draft',
        category_ids: article.categories?.map((cat: any) => cat.id) || [],
        _method: 'PUT',
        remove_picture: false,
    });

    const page = usePage();

    const [previewPicture, setPreviewPicture] = useState<string | null>(article.picture ? `/storage/${article.picture}` : null);
    const [selectedCategories, setSelectedCategories] = useState<any[]>(
        article.categories?.map((cat: any) => ({ value: cat.id, label: cat.name })) || [],
    );

    useEffect(() => {
        setData(
            'category_ids',
            selectedCategories.map((cat: any) => cat.value),
        );
    }, [selectedCategories]);

    // --- BAGIAN YANG DIPERBAIKI/DITAMBAHKAN ---
    useEffect(() => {
        // Memastikan `errors` ada dan memiliki properti yang valid sebelum mengulanginya
        if (errors && Object.keys(errors).length > 0) {
            // Prioritaskan pesan error gambar jika ada
            if (errors.picture) {
                // Pastikan errors.picture adalah string atau array of strings
                if (typeof errors.picture === 'string') {
                    toast.error(errors.picture);
                } else if (Array.isArray(errors.picture)) {
                    errors.picture.forEach((msg: string) => toast.error(msg));
                }
            } else {
                // Tampilkan error lain jika ada
                Object.values(errors).forEach((errorMessage) => {
                    if (typeof errorMessage === 'string') {
                        toast.error(errorMessage);
                    } else if (Array.isArray(errorMessage)) {
                        errorMessage.forEach((msg: string) => toast.error(msg));
                    }
                });
            }
        }
    }, [errors]); // Dependency array harus mencakup 'errors'
    // --- AKHIR BAGIAN YANG DIPERBAIKI/DITAMBAHKAN ---

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in data) {
            // Kita tidak menyertakan 'picture' di loop ini karena akan ditambahkan secara kondisional
            // dan kita juga mengecualikan '_method' karena akan ditambahkan terpisah.
            // Memastikan data[key] bukan null sebelum append
            if (key !== 'picture' && key !== 'category_ids' && key !== '_method' && data[key as keyof typeof data] !== null) {
                formData.append(key, String(data[key as keyof typeof data])); // Konversi ke string secara eksplisit
            }
        }

        if (data.picture) {
            formData.append('picture', data.picture);
        }
        if (data.remove_picture) {
            formData.append('remove_picture', '1');
        }

        // Pastikan category_ids terisi sebelum melakukan foreach
        selectedCategories.forEach((cat: any) => {
            formData.append('category_ids[]', cat.value);
        });

        formData.append('_method', 'PUT');

        post(`/articles/${article.id}`, {
            body: formData,
            onSuccess: (response: any) => {
                toast.success('Artikel berhasil diperbarui!');
                // Pastikan 'response?.props?.article?.id' ini benar-benar ada jika Anda ingin menggunakannya
                const articleId = response?.props?.article?.id || response?.props?.flash?.article_id; // Menambahkan fallback untuk flash data
                if (articleId) {
                    Inertia.visit(`/articles/${articleId}`);
                } else {
                    Inertia.visit('/articles');
                }
            },
            onError: (formErrors) => {
                console.error(formErrors);
                // Pesan toast akan dihandle oleh useEffect di atas, tidak perlu di sini lagi
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('picture', file);
            setData('remove_picture', false); // Jika mengupload baru, pastikan flag hapus mati
            setPreviewPicture(URL.createObjectURL(file));
        } else {
            setData('picture', null);
            setPreviewPicture(article.picture && !data.remove_picture ? `/storage/${article.picture}` : null);
        }
    };

    const removeImage = () => {
        setData('picture', null);
        setData('remove_picture', true);
        setPreviewPicture(null);
    };

    const categoryOptions = categories.map((cat: any) => ({ value: cat.id, label: cat.name }));

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Blog', href: '#' },
                { title: 'Artikel', href: '/articles' },
                { title: 'Edit Artikel', href: `/articles/${article.id}/edit` },
            ]}
        >
            <Head title={`Edit: ${article.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header Page Title dan Tombol Kembali */}
                <div className="mb-4 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Artikel</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Perbarui artikel: {article.title}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-1">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column (2/3 width) - Konten Utama (Gambar, Judul, Ringkasan, Konten) */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* 1. Gambar Artikel (Upload Gambar) - Dipindahkan ke sini */}
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

                            {/* 2. Judul & 3. Ringkasan (digabung dalam Informasi Dasar) */}
                            <div className="bg-card rounded-lg border p-6 shadow-md">
                                <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">Informasi Dasar</h2>
                                <div className="space-y-5">
                                    {/* Judul */}
                                    <div>
                                        <Label htmlFor="title" className="mb-2 block">
                                            Judul Artikel <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Masukkan judul artikel yang menarik..."
                                            className="w-full"
                                        />
                                        {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
                                    </div>

                                    {/* Ringkasan */}
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

                            {/* 5. Konten */}
                            <div className="bg-card rounded-lg border p-6 shadow-md">
                                <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">Konten Artikel</h2>
                                <div>
                                    <Label className="mb-2 block">
                                        Konten (MDX) <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="mt-3" data-color-mode="light">
                                        <MDEditor
                                            value={data.content}
                                            onChange={(val) => setData('content', val || '')}
                                            preview="edit"
                                            height={500}
                                            className="md-editor-custom"
                                        />
                                    </div>
                                    {errors.content && <p className="mt-2 text-sm text-red-500">{errors.content}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Right Column (1/3 width) - Pengaturan Tambahan (Kategori, Status) */}
                        <div className="space-y-6 lg:col-span-1">
                            {/* 4. Kategori */}
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

                            {/* 6. Status Publikasi */}
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

                    {/* Tombol Aksi di Bawah Form (paling bawah) */}
                    <div className="bg-card mt-8 flex justify-end gap-3 rounded-lg border p-4 shadow-md">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            <X className="mr-2 h-4 w-4" />
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
