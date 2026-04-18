import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

type JenisBerkas = {
    id: number; nama: string; label: string; keterangan: string | null;
    is_required: boolean; is_active: boolean; urutan: number;
};

type FormState = Partial<JenisBerkas> & { open: boolean };

export default function JenisBerkasIndex() {
    const { jenisBerkas = [] } = usePage().props as { jenisBerkas: JenisBerkas[] };
    const [form, setForm] = useState<FormState>({ open: false });
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const openCreate = () => setForm({ open: true, nama: '', label: '', keterangan: '', is_required: true, is_active: true, urutan: 0 });
    const openEdit = (item: JenisBerkas) => setForm({ open: true, ...item });
    const closeForm = () => setForm({ open: false });

    const handleSave = () => {
        if (form.id) {
            router.put(`/jenis-berkas/${form.id}`, form, { onSuccess: closeForm, preserveScroll: true });
        } else {
            router.post('/jenis-berkas', form, { onSuccess: closeForm, preserveScroll: true });
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Hapus jenis berkas ini?')) return;
        router.delete(`/jenis-berkas/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Open Recruitment', href: '/pendaftaran' }, { title: 'Manajemen Dokumen', href: '/jenis-berkas' }]}>
            <Head title="Manajemen Jenis Berkas" />
            <div className="flex flex-col gap-4 p-4">

                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Manajemen Jenis Berkas</h1>
                    <Button onClick={openCreate} className="gap-1"><Plus size={15}/> Tambah Berkas</Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50 text-left">
                                    <th className="px-4 py-3 font-semibold">No</th>
                                    <th className="px-4 py-3 font-semibold">Label</th>
                                    <th className="px-4 py-3 font-semibold">Nama (Slug)</th>
                                    <th className="px-4 py-3 font-semibold">Keterangan</th>
                                    <th className="px-4 py-3 font-semibold">Wajib</th>
                                    <th className="px-4 py-3 font-semibold">Aktif</th>
                                    <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {(jenisBerkas as JenisBerkas[]).length === 0 ? (
                                    <tr><td colSpan={7} className="py-10 text-center text-muted-foreground">Belum ada jenis berkas.</td></tr>
                                ) : (
                                    (jenisBerkas as JenisBerkas[]).map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                                            <td className="px-4 py-3 font-medium">{item.label}</td>
                                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.nama}</td>
                                            <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{item.keterangan || '-'}</td>
                                            <td className="px-4 py-3">
                                                {item.is_required
                                                    ? <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Wajib</span>
                                                    : <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Opsional</span>}
                                            </td>
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
                    <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
                        <h2 className="mb-4 text-lg font-semibold">{form.id ? 'Edit' : 'Tambah'} Jenis Berkas</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Nama (Slug)</label>
                                <input className="w-full rounded-md border px-3 py-2 text-sm bg-background" placeholder="pas_photo"
                                    value={form.nama ?? ''} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Label</label>
                                <input className="w-full rounded-md border px-3 py-2 text-sm bg-background" placeholder="Pas Foto 3x4"
                                    value={form.label ?? ''} onChange={(e) => setForm({ ...form, label: e.target.value })} />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Keterangan</label>
                                <textarea rows={2} className="w-full rounded-md border px-3 py-2 text-sm bg-background resize-none"
                                    value={form.keterangan ?? ''} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} />
                            </div>
                            <div className="flex gap-4">
                                <label className="flex cursor-pointer items-center gap-2 text-sm">
                                    <input type="checkbox" checked={!!form.is_required} onChange={(e) => setForm({ ...form, is_required: e.target.checked })} />
                                    Wajib
                                </label>
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
