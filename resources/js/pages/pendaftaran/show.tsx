import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, FileText, User, XCircle, Clock, ZoomIn } from 'lucide-react';
import { useState } from 'react';

export default function PendaftaranShow() {
    const { pendaftaran, fields = [] } = usePage().props as any;
    
    // Group fields by type
    const kuisionerFields = fields.filter((f: any) => f.type === 'kuisioner' && f.is_active);
    const dokumenFields = fields.filter((f: any) => f.type === 'dokumen' && f.is_active);

    const [activeTab, setActiveTab] = useState<'bio' | 'kuisioner' | 'berkas'>('bio');

    const { data, setData, post, processing, errors } = useForm({
        status: pendaftaran.status || 'pending',
        feedback: pendaftaran.feedback || '',
    });

    const submitProcess = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/pendaftaran/${pendaftaran.id}/process`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'bg-green-500 hover:bg-green-600';
            case 'rejected': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-yellow-500 hover:bg-yellow-600';
        }
    };

    const DataRow = ({ label, value }: { label: string, value: any }) => (
        <div className="grid grid-cols-3 py-2 border-b dark:border-zinc-800 last:border-0">
            <div className="font-semibold text-gray-500 dark:text-gray-400">{label}</div>
            <div className="col-span-2 dark:text-zinc-200">{value || '-'}</div>
        </div>
    );

    const BerkasRow = ({ title, path }: { title: string, path: string | null }) => {
        const isImage = path?.match(/\.(jpeg|jpg|gif|png)$/) != null;

        return (
        <div className="mb-4">
            <h4 className="font-semibold mb-2 text-sm dark:text-zinc-200">{title}</h4>
            {path ? (
                <div className="rounded border bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 p-2 text-center overflow-hidden relative group">
                   {isImage ? (
                       <>
                           <img src={`/storage/${path}`} alt={title} className="max-h-48 w-full object-cover rounded" />
                           <Dialog>
                               <DialogTrigger asChild>
                                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <ZoomIn className="text-white w-8 h-8" />
                                   </div>
                               </DialogTrigger>
                               <DialogContent className="max-w-4xl p-1 bg-transparent border-none shadow-none">
                                   <img src={`/storage/${path}`} alt={title} className="w-full h-auto rounded" />
                               </DialogContent>
                           </Dialog>
                       </>
                   ) : (
                       <a href={`/storage/${path}`} target="_blank" rel="noreferrer" className="text-blue-500 dark:text-blue-400 underline flex flex-col items-center justify-center py-10">
                           <FileText className="mb-2 w-10 h-10" /> Buka / Unduh {title}
                       </a>
                   )}
                </div>
            ) : (
                <div className="rounded border bg-gray-50 dark:bg-zinc-900/50 dark:border-zinc-800 p-8 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500 italic text-sm">Tidak diunggah</span>
                </div>
            )}
        </div>
        );
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Pendaftaran', href: '/pendaftaran' },
            { title: 'Detail', href: `/pendaftaran/${pendaftaran.id}` }
        ]}>
            <Head title={`Detail Pendaftaran - ${pendaftaran.nama}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-xl font-bold">Detail Pendaftar: {pendaftaran.nama}</h1>
                        <Badge className={getStatusColor(pendaftaran.status)}>
                            {pendaftaran.status.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Kiri: Navigasi & Detail Konten */}
                    <div className="md:col-span-2 space-y-4">
                        {/* Tab Navigasi Sederhana */}
                        <div className="flex border-b dark:border-zinc-800">
                            <button
                                onClick={() => setActiveTab('bio')}
                                className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'bio' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                <User className="w-4 h-4" /> Data Diri
                            </button>
                            <button
                                onClick={() => setActiveTab('kuisioner')}
                                className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'kuisioner' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                <FileText className="w-4 h-4" /> Kuisioner
                            </button>
                            <button
                                onClick={() => setActiveTab('berkas')}
                                className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'berkas' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                <FileText className="w-4 h-4" /> Dokumen Berkas
                            </button>
                        </div>

                        {/* Konten Tabs */}
                        <Card>
                            <CardContent className="pt-6">
                                {activeTab === 'bio' && (
                                    <div className="space-y-1">
                                        <DataRow label="Nama Lengkap" value={pendaftaran.nama} />
                                        <DataRow label="NIM" value={pendaftaran.nim} />
                                        <DataRow label="Jurusan" value={pendaftaran.jurusan} />
                                        <DataRow label="Program Studi" value={pendaftaran.prodi} />
                                        <DataRow label="Jenis Kelamin" value={pendaftaran.jenis_kelamin === 'L' ? 'Laki-Laki' : pendaftaran.jenis_kelamin === 'P' ? 'Perempuan' : '-'} />
                                        <DataRow label="Agama" value={pendaftaran.agama} />
                                        <DataRow label="Tempat, Tanggal Lahir" value={`${pendaftaran.tempat_lahir || '-'}, ${pendaftaran.tgl_lahir || '-'}`} />
                                        <DataRow label="Alamat" value={pendaftaran.alamat} />
                                        <DataRow label="Nomor WA" value={pendaftaran.no_wa} />
                                        <DataRow label="Email" value={pendaftaran.email} />
                                        <DataRow label="Soft Skill" value={pendaftaran.soft_skill} />
                                        <DataRow label="Pengalaman Organisasi" value={pendaftaran.pengalaman_organisasi} />
                                        <DataRow label="Motto" value={pendaftaran.motto} />
                                        <DataRow label="Akun Submitter" value={pendaftaran.user?.name} />
                                        <DataRow label="Periode Daftar" value={pendaftaran.period?.name} />
                                    </div>
                                )}

                                {activeTab === 'kuisioner' && (
                                    <div className="space-y-6">
                                        {kuisionerFields.length > 0 ? (
                                            kuisionerFields.map((field: any, index: number) => (
                                                <div key={field.id}>
                                                    <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{index + 1}. {field.label}</div>
                                                    <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded whitespace-pre-wrap">
                                                        {pendaftaran[field.name] || <span className="italic text-gray-400">Tidak diisi</span>}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 text-gray-500 dark:text-gray-400">Tidak ada field kuisioner yang aktif.</div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'berkas' && (
                                    <div className="space-y-4">
                                        {dokumenFields.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {dokumenFields.map((field: any) => (
                                                    <BerkasRow 
                                                        key={field.id}
                                                        title={field.label} 
                                                        path={pendaftaran[field.name]} 
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 text-gray-500 dark:text-gray-400">Tidak ada field dokumen yang aktif.</div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kanan: Penilaian (Proses) */}
                    <div>
                        <Card className="sticky top-4 border-l-4 border-l-primary">
                            <CardHeader>
                                <CardTitle>Penilaian / Proses</CardTitle>
                                <CardDescription>Tentukan status kelulusan pendaftar ini.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submitProcess} className="space-y-6">
                                    <div className="space-y-3">
                                        <Label>Status Kelulusan</Label>
                                        <div className="grid grid-cols-1 gap-2 border dark:border-zinc-700 p-2 rounded-md bg-gray-50 dark:bg-zinc-800">
                                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors">
                                                <input 
                                                    type="radio" 
                                                    name="status" 
                                                    value="accepted" 
                                                    checked={data.status === 'accepted'} 
                                                    onChange={e => setData('status', e.target.value)} 
                                                    className="w-4 h-4 text-green-600 focus:ring-green-500 cursor-pointer"
                                                />
                                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
                                                <span className="font-medium text-green-700 dark:text-green-400">Accepted (Diterima)</span>
                                            </label>
                                            
                                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded border-t dark:border-zinc-700 transition-colors">
                                                <input 
                                                    type="radio" 
                                                    name="status" 
                                                    value="rejected" 
                                                    checked={data.status === 'rejected'} 
                                                    onChange={e => setData('status', e.target.value)} 
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer"
                                                />
                                                <XCircle className="w-4 h-4 text-red-600 dark:text-red-500" />
                                                <span className="font-medium text-red-700 dark:text-red-400">Rejected (Ditolak)</span>
                                            </label>
                                            
                                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded border-t dark:border-zinc-700 transition-colors">
                                                <input 
                                                    type="radio" 
                                                    name="status" 
                                                    value="pending" 
                                                    checked={data.status === 'pending'} 
                                                    onChange={e => setData('status', e.target.value)} 
                                                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 cursor-pointer"
                                                />
                                                <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                                                <span className="font-medium text-yellow-700 dark:text-yellow-400">Pending (Tunda)</span>
                                            </label>
                                        </div>
                                        {errors.status && <div className="text-sm text-red-500">{errors.status}</div>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="feedback">Feedback / Catatan Review</Label>
                                        <Textarea
                                            id="feedback"
                                            value={data.feedback}
                                            onChange={e => setData('feedback', e.target.value)}
                                            placeholder="Masukkan catatan penilaian atau alasan penerimaan/penolakan..."
                                            rows={5}
                                        />
                                        {errors.feedback && <div className="text-sm text-red-500">{errors.feedback}</div>}
                                    </div>

                                    <Button type="submit" className="w-full" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Keputusan'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
