import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';

type Pertanyaan = { id: number; pertanyaan: string; is_active: boolean; urutan: number };
type FormState = Partial<Pertanyaan> & { open: boolean };

export default function PertanyaanKuesionerIndex() {
    const { pertanyaan = [] } = usePage().props as { pertanyaan: Pertanyaan[] };
    const [form, setForm] = useState<FormState>({ open: false });

    const openCreate = () => setForm({ open: true, pertanyaan: '', is_active: true, urutan: 0 });
    const openEdit = (item: Pertanyaan) => setForm({ open: true, ...item });
    const closeForm = () => setForm({ open: false });

    const handleSave = () => {
        if (form.id) {
            router.put(`/pertanyaan-kuesioner/${form.id}`, form, { onSuccess: closeForm, preserveScroll: true });
        } else {
            router.post('/pertanyaan-kuesioner', form, { onSuccess: closeForm, preserveScroll: true });
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Hapus pertanyaan ini? Pastikan tidak ada jawaban yang terhubung.')) return;
        router.delete(`/pertanyaan-kuesioner/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Open Recruitment', href: '/pendaftaran' }, { title: 'Manajemen Kuesioner', href: '/pertanyaan-kuesioner' }]}>
            <Head title="Manajemen Kuesioner" />
            <div className="flex flex-col gap-4 p-4">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Manajemen Kuesioner</h1>
                        <p className="text-sm text-muted-foreground">Kelola pertanyaan yang muncul di form kuesioner pendaftaran.</p>
                    </div>
                    <Button onClick={openCreate} className="gap-1"><Plus size={15}/> Tambah Pertanyaan</Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50 text-left">
                                    <th className="px-4 py-3 font-semibold w-8"></th>
                                    <th className="px-4 py-3 font-semibold">No</th>
                                    <th className="px-4 py-3 font-semibold">Pertanyaan</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {(pertanyaan as Pertanyaan[]).length === 0 ? (
                                    <tr><td colSpan={5} className="py-10 text-center text-muted-foreground">Belum ada pertanyaan.</td></tr>
                                ) : (
                                    (pertanyaan as Pertanyaan[]).map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-3 py-3 text-muted-foreground"><GripVertical size={14}/></td>
                                            <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                                            <td className="px-4 py-3 max-w-lg">{item.pertanyaan}</td>
                                            <td className="px-4 py-3">
                                                {item.is_active
                                                    ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Aktif</span>
                                                    : <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">Nonaktif</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => openEdit(item)}><Pencil size={13}/></Button>
                                                    <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => handleDelete(item.id)}><Trash2 size={13}/></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            {form.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-background p-6 shadow-xl">
                        <h2 className="mb-4 text-lg font-semibold">{form.id ? 'Edit' : 'Tambah'} Pertanyaan</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Pertanyaan</label>
                                <textarea rows={3} className="w-full rounded-md border px-3 py-2 text-sm bg-background resize-none"
                                    placeholder="Tulis pertanyaan..."
                                    value={form.pertanyaan ?? ''} onChange={(e) => setForm({ ...form, pertanyaan: e.target.value })} />
                            </div>
                            <div className="flex gap-4">
                                <label className="flex cursor-pointer items-center gap-2 text-sm">
                                    <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                                    Aktif
                                </label>
                            </div>
                        </div>
                        <div className="mt-5 flex justify-end gap-2">
                            <Button variant="outline" onClick={closeForm}>Batal</Button>
                            <Button onClick={handleSave}>Simpan</Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
