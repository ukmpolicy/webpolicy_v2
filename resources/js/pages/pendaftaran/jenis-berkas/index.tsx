import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { JenisBerkasTable } from '@/components/TableJenisBerkas/JenisBerkasTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

type JenisBerkas = {
    id: number; nama: string; label: string; keterangan: string | null;
    is_required: boolean; is_active: boolean; urutan: number;
};

type FormState = Partial<JenisBerkas> & { open: boolean };

export default function JenisBerkasIndex() {
    const { jenisBerkas = [] } = usePage().props as { jenisBerkas: JenisBerkas[] };
    const [form, setForm] = useState<FormState>({ open: false });

    const openCreate = () => setForm({ open: true, nama: '', label: '', keterangan: '', is_required: true, is_active: true, urutan: 0 });
    const openEdit = (item: JenisBerkas) => setForm({ open: true, ...item });
    const closeForm = () => setForm({ open: false });

    const handleSave = () => {
        if (!form.nama || !form.label) {
            toast.error('Nama (slug) dan Label wajib diisi.');
            return;
        }

        if (form.id) {
            router.put(`/jenis-berkas/${form.id}`, form, {
                onSuccess: () => { closeForm(); toast.success('Jenis berkas berhasil diupdate.'); },
                onError: () => toast.error('Gagal mengupdate jenis berkas.'),
                preserveScroll: true,
            });
        } else {
            router.post('/jenis-berkas', form, {
                onSuccess: () => { closeForm(); toast.success('Jenis berkas berhasil ditambahkan.'); },
                onError: () => toast.error('Gagal menambahkan jenis berkas.'),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Open Recruitment', href: '/pendaftaran' }, { title: 'Manajemen Dokumen', href: '/jenis-berkas' }]}>
            <Head title="Manajemen Jenis Berkas" />
            <div className="flex flex-col gap-4 p-4">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Manajemen Jenis Berkas</h1>
                        <p className="text-sm text-muted-foreground">Kelola dokumen/berkas yang wajib diunggah oleh pendaftar.</p>
                    </div>
                    <Button onClick={openCreate} className="gap-1"><Plus size={15}/> Tambah Berkas</Button>
                </div>

                <JenisBerkasTable data={jenisBerkas} onEdit={openEdit} />
            </div>

            {/* Modal Form Dialog */}
            <Dialog open={form.open} onOpenChange={(val) => !val && closeForm()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{form.id ? 'Edit' : 'Tambah'} Jenis Berkas</DialogTitle>
                        <DialogDescription>
                            Tentukan jenis dokumen/berkas yang diperlukan pendaftar.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Nama Identifier (Slug)</label>
                            <input
                                className="w-full rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="Contoh: pas_photo"
                                value={form.nama ?? ''}
                                disabled={!!form.id}
                                onChange={(e) => setForm({ ...form, nama: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Huruf kecil, tanpa spasi. Tidak bisa diubah setelah dibuat.</p>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Label Tampilan</label>
                            <input
                                className="w-full rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="Contoh: Pas Foto 3x4"
                                value={form.label ?? ''}
                                onChange={(e) => setForm({ ...form, label: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Keterangan (Opsional)</label>
                            <textarea
                                rows={2}
                                className="w-full rounded-md border px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="Deskripsi atau instruksi tambahan..."
                                value={form.keterangan ?? ''}
                                onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-6">
                            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300"
                                    checked={!!form.is_required}
                                    onChange={(e) => setForm({ ...form, is_required: e.target.checked })}
                                />
                                Wajib Diunggah
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300"
                                    checked={!!form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                />
                                Status Aktif
                            </label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={closeForm}>Batal</Button>
                        <Button onClick={handleSave}>Simpan Data</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
