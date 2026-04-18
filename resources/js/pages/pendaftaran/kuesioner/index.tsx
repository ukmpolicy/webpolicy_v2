import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { KuesionerTable } from '@/components/TableKuesioner/KuesionerTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

type Pertanyaan = { id: number; pertanyaan: string; is_active: boolean; urutan: number };
type FormState = Partial<Pertanyaan> & { open: boolean };

export default function PertanyaanKuesionerIndex() {
    const { pertanyaan = [] } = usePage().props as { pertanyaan: Pertanyaan[] };
    const [form, setForm] = useState<FormState>({ open: false });

    const openCreate = () => setForm({ open: true, pertanyaan: '', is_active: true, urutan: 0 });
    const openEdit = (item: Pertanyaan) => setForm({ open: true, ...item });
    const closeForm = () => setForm({ open: false });

    const handleSave = () => {
        if (!form.pertanyaan) {
            toast.error("Pertanyaan tidak boleh kosong");
            return;
        }

        if (form.id) {
            router.put(`/pertanyaan-kuesioner/${form.id}`, form, { 
                onSuccess: () => {
                    closeForm();
                    toast.success("Pertanyaan berhasil diupdate.");
                }, 
                onError: () => toast.error("Gagal mengupdate pertanyaan."),
                preserveScroll: true 
            });
        } else {
            router.post('/pertanyaan-kuesioner', form, { 
                onSuccess: () => {
                    closeForm();
                    toast.success("Pertanyaan berhasil ditambahkan.");
                }, 
                onError: () => toast.error("Gagal menambahkan pertanyaan."),
                preserveScroll: true 
            });
        }
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

                <KuesionerTable data={pertanyaan} onEdit={openEdit} />
            </div>

            {/* Modal Form Dialog */}
            <Dialog open={form.open} onOpenChange={(val) => !val && closeForm()}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{form.id ? 'Edit' : 'Tambah'} Pertanyaan</DialogTitle>
                        <DialogDescription>
                            Tuliskan pertanyaan baru atau edit pertanyaan kuesioner yang ada.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Isi Pertanyaan</label>
                            <textarea 
                                rows={3} 
                                className="w-full rounded-md border px-3 py-2 text-sm bg-background resize-none focus-visible:ring-1 focus-visible:ring-primary outline-none focus-visible:border-primary"
                                placeholder="Tulis pertanyaan..."
                                value={form.pertanyaan ?? ''} 
                                onChange={(e) => setForm({ ...form, pertanyaan: e.target.value })} 
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={!!form.is_active} 
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })} 
                                />
                                Atur sebagai Aktif
                            </label>
                            <span className="text-xs text-muted-foreground ml-2">Pertanyaan aktif akan muncul di form.</span>
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
