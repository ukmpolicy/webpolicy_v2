import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, Plus, FileText, Settings2 } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, useForm } from '@inertiajs/react';

export default function Settings() {
    const { title, type, fields = [] } = usePage().props as any;
    
    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);

    // Form for Add/Edit
    const form = useForm({
        type: type,
        name: '',
        label: '',
        is_required: true,
        is_active: true,
    });

    const resetForm = () => {
        form.reset();
        form.clearErrors();
        form.setData({ type: type, name: '', label: '', is_required: true, is_active: true });
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/recruitment-fields', {
            onSuccess: () => {
                setIsAddOpen(false);
                resetForm();
            }
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/recruitment-fields/${editItem.id}`, {
            onSuccess: () => {
                setEditItem(null);
                resetForm();
            }
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus field ini?')) {
            form.delete(`/recruitment-fields/${id}`);
        }
    };

    const toggleStatus = (item: any, field: 'is_active' | 'is_required', checked: boolean) => {
        form.put(`/recruitment-fields/${item.id}`, {
            data: {
                label: item.label,
                is_required: field === 'is_required' ? checked : item.is_required,
                is_active: field === 'is_active' ? checked : item.is_active,
            }
        });
    };

    const openEditDialog = (item: any) => {
        form.setData({
            type: item.type,
            name: item.name,
            label: item.label,
            is_required: item.is_required,
            is_active: item.is_active,
        });
        setEditItem(item);
    };

    return (
        <AppLayout breadcrumbs={[{ title: title, href: '#' }]}>
            <Head title={title} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">{title}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Kelola form isian dan persyaratan dokumen pelamar secara dinamis.
                        </p>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button className="shadow-md hover:shadow-lg transition-all dark:bg-primary dark:text-primary-foreground dark:hover:brightness-110">
                                <Plus className="w-4 h-4 mr-2" /> Tambah Kolom/Syarat
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tambah Kolom Baru ({type})</DialogTitle>
                                <DialogDescription>Masukkan pengaturan untuk input {type} yang baru.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAdd} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-700 dark:text-gray-300">Identifier (Tanpa Spasi, contoh: hobi_user)</Label>
                                    <Input 
                                        value={form.data.name} 
                                        onChange={e => form.setData('name', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))} 
                                        required 
                                        className="bg-gray-50 focus-visible:ring-1 focus-visible:ring-primary dark:bg-zinc-900/50"
                                    />
                                    {form.errors.name && <p className="text-red-500 text-sm">{form.errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-700 dark:text-gray-300">Label yang Tampil</Label>
                                    <Input 
                                        value={form.data.label} 
                                        onChange={e => form.setData('label', e.target.value)} 
                                        required 
                                        className="bg-gray-50 focus-visible:ring-1 focus-visible:ring-primary dark:bg-zinc-900/50"
                                    />
                                    {form.errors.label && <p className="text-red-500 text-sm">{form.errors.label}</p>}
                                </div>
                                
                                <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-lg space-y-4 border border-gray-100 dark:border-zinc-800">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Wajib Diisi (Required)</Label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Pendaftar harus mengisi form ini.</p>
                                        </div>
                                        <Switch checked={form.data.is_required} onCheckedChange={(checked) => form.setData('is_required', checked)} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Status Aktif</Label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Tampilkan form ini di halaman pendaftaran.</p>
                                        </div>
                                        <Switch checked={form.data.is_active} onCheckedChange={(checked) => form.setData('is_active', checked)} />
                                    </div>
                                </div>
                                
                                <DialogFooter className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                                    <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Batal</Button>
                                    <Button type="submit" disabled={form.processing} className="shadow-md">Simpan Konfigurasi</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Table Section */}
                <Card className="border-0 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-xl overflow-hidden">
                    <CardHeader className="bg-gray-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-gray-500" />
                            <CardTitle className="text-base font-semibold">Daftar Konfigurasi Form</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-transparent hover:bg-transparent">
                                <TableRow className="border-b border-zinc-100 dark:border-zinc-800">
                                    <TableHead className="w-16 h-12 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">#</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Identifier Internal</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Label Form</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-center text-gray-500">Atribut Wajib</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-center text-gray-500">Status Aktif</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-right pr-6 text-gray-500">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
                                                <p>Belum ada konfigurasi form/syarat dokumen yang ditambahkan.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : fields.map((item: any, i: number) => (
                                    <TableRow key={item.id} className="group hover:bg-gray-50/80 dark:hover:bg-zinc-900/80 transition-colors">
                                        <TableCell className="text-center font-medium text-gray-500">{i + 1}</TableCell>
                                        <TableCell>
                                            <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                                                {item.name}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">{item.label}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Switch 
                                                    checked={item.is_required} 
                                                    onCheckedChange={(checked) => toggleStatus(item, 'is_required', checked)} 
                                                    className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
                                                />
                                                <span className={`text-xs font-medium ${item.is_required ? 'text-zinc-900 dark:text-zinc-100' : 'text-gray-400'}`}>
                                                    {item.is_required ? 'Wajib' : 'Opsional'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Switch 
                                                    checked={item.is_active} 
                                                    onCheckedChange={(checked) => toggleStatus(item, 'is_active', checked)} 
                                                    className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
                                                />
                                                <span className={`text-xs font-medium ${item.is_active ? 'text-zinc-900 dark:text-zinc-100' : 'text-gray-400'}`}>
                                                    {item.is_active ? 'Aktif' : 'Mati'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6 space-x-1">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)} className="h-8 w-8 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                                                <Edit className="w-4 h-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                                                <Trash2 className="w-4 h-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Edit Modal */}
                <Dialog open={!!editItem} onOpenChange={(open) => { if (!open) { setEditItem(null); resetForm(); } }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Kolom Form</DialogTitle>
                            <DialogDescription>Pengaturan identifier name tidak dapat diubah setelah dibuat.</DialogDescription>
                        </DialogHeader>
                        {editItem && (
                            <form onSubmit={handleEdit} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-700 dark:text-gray-300">Identifier Internal (Tidak dapat diubah)</Label>
                                    <Input value={editItem.name} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200 dark:bg-zinc-900 shadow-inner" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-700 dark:text-gray-300">Label yang Tampil</Label>
                                    <Input 
                                        value={form.data.label} 
                                        onChange={e => form.setData('label', e.target.value)} 
                                        required 
                                        className="bg-gray-50 focus-visible:ring-1 focus-visible:ring-primary dark:bg-zinc-900/50"
                                    />
                                    {form.errors.label && <p className="text-red-500 text-sm">{form.errors.label}</p>}
                                </div>
                                
                                <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-lg space-y-4 border border-gray-100 dark:border-zinc-800">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Wajib Diisi (Required)</Label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Pendaftar harus mengisi form ini.</p>
                                        </div>
                                        <Switch checked={form.data.is_required} onCheckedChange={(checked) => form.setData('is_required', checked)} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Status Aktif</Label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Tampilkan form ini di halaman pendaftaran.</p>
                                        </div>
                                        <Switch checked={form.data.is_active} onCheckedChange={(checked) => form.setData('is_active', checked)} />
                                    </div>
                                </div>

                                <DialogFooter className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                                    <Button type="button" variant="ghost" onClick={() => { setEditItem(null); resetForm(); }}>Batal</Button>
                                    <Button type="submit" disabled={form.processing} className="shadow-md">Update Konfigurasi</Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

            </div>
        </AppLayout>
    );
}
