import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, User, FileText, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';

type Dokumen = { id: number; jenis_berkas?: { label: string }; file_path: string; original_name: string };
type Jawaban = { id: number; pertanyaan?: { pertanyaan: string }; jawaban: string };
type Pendaftaran = {
    id: number; nama: string; nim: string; email: string; jurusan: string; prodi: string;
    alamat: string; tgl_lahir: string; tempat_lahir: string; jenis_kelamin: string;
    agama: string; no_wa: string; pengalaman_organisasi: string; motivasi: string; motto: string;
    status: 'pending' | 'accepted' | 'rejected'; feedback: string; reviewed_at: string;
    created_at: string;
    period?: { name: string };
    dokumen: Dokumen[];
    jawaban: Jawaban[];
};

const statusConfig = {
    pending:  { label: 'Pending',  color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    accepted: { label: 'Diterima', color: 'bg-green-100 text-green-800',   icon: CheckCircle },
    rejected: { label: 'Ditolak',  color: 'bg-red-100 text-red-800',       icon: XCircle },
};

export default function PendaftaranShow() {
    const { pendaftaran } = usePage().props as { pendaftaran: Pendaftaran };
    const [status, setStatus] = useState(pendaftaran.status);
    const [feedback, setFeedback] = useState(pendaftaran.feedback ?? '');
    const [loading, setLoading] = useState(false);

    const handleUpdateStatus = () => {
        setLoading(true);
        router.patch(`/pendaftaran/${pendaftaran.id}/status`, { status, feedback }, {
            onFinish: () => setLoading(false),
            onSuccess: () => toast.success('Status pendaftar berhasil diperbarui!'),
            onError: () => toast.error('Gagal memperbarui status. Coba lagi.'),
        });
    };

    const sc = statusConfig[pendaftaran.status];
    const Icon = sc.icon;

    return (
        <AppLayout breadcrumbs={[
            { title: 'Pendaftaran', href: '/pendaftaran' },
            { title: pendaftaran.nama, href: `/pendaftaran/${pendaftaran.id}` },
        ]}>
            <Head title={`Detail Pendaftar — ${pendaftaran.nama}`} />
            <div className="flex flex-col gap-4 p-4">

                {/* Back + Status Header */}
                <div className="flex items-center justify-between">
                    <Link href="/pendaftaran">
                        <Button variant="outline" size="sm" className="gap-1"><ArrowLeft size={14}/> Kembali</Button>
                    </Link>
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${sc.color}`}>
                        <Icon size={13}/> {sc.label}
                    </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Data Diri */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 font-semibold"><User size={16}/> Data Diri</h2>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                {[
                                    ['Nama', pendaftaran.nama], ['NIM', pendaftaran.nim],
                                    ['Email', pendaftaran.email], ['No. WhatsApp', pendaftaran.no_wa],
                                    ['Jurusan', pendaftaran.jurusan], ['Prodi', pendaftaran.prodi],
                                    ['Alamat', pendaftaran.alamat], ['Tempat Lahir', pendaftaran.tempat_lahir],
                                    ['Tgl Lahir', pendaftaran.tgl_lahir], ['Jenis Kelamin', pendaftaran.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'],
                                    ['Agama', pendaftaran.agama], ['Periode', pendaftaran.period?.name],
                                ].map(([label, value]) => (
                                    <div key={label}>
                                        <p className="text-muted-foreground">{label}</p>
                                        <p className="font-medium">{value || '-'}</p>
                                    </div>
                                ))}
                                <div className="col-span-2">
                                    <p className="text-muted-foreground">Pengalaman Organisasi</p>
                                    <p className="font-medium whitespace-pre-wrap">{pendaftaran.pengalaman_organisasi || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-muted-foreground">Motivasi</p>
                                    <p className="font-medium whitespace-pre-wrap">{pendaftaran.motivasi || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-muted-foreground">Motto</p>
                                    <p className="font-medium">{pendaftaran.motto || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Kuesioner */}
                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 font-semibold"><MessageSquare size={16}/> Jawaban Kuesioner</h2>
                            {pendaftaran.jawaban.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum mengisi kuesioner.</p>
                            ) : (
                                <div className="space-y-4">
                                    {pendaftaran.jawaban.map((j, idx) => (
                                        <div key={j.id}>
                                            <p className="text-sm font-medium text-muted-foreground">{idx + 1}. {j.pertanyaan?.pertanyaan}</p>
                                            <p className="mt-1 text-sm whitespace-pre-wrap">{j.jawaban || <em className="text-muted-foreground">Tidak dijawab</em>}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Berkas */}
                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 font-semibold"><FileText size={16}/> Berkas Yang Diupload</h2>
                            {pendaftaran.dokumen.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada berkas yang diupload.</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {pendaftaran.dokumen.map((d) => {
                                        const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(d.file_path);
                                        return (
                                            <a
                                                key={d.id}
                                                href={`/storage/${d.file_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group flex flex-col items-center gap-2 rounded-lg border p-3 hover:bg-muted/50 hover:border-primary/50 transition-all text-center overflow-hidden"
                                            >
                                                <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded bg-muted/30">
                                                    {isImage ? (
                                                        <img
                                                            src={`/storage/${d.file_path}`}
                                                            alt={d.original_name}
                                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <FileText size={32} className="text-muted-foreground opacity-50" />
                                                    )}
                                                </div>
                                                <span className="text-xs font-medium w-full truncate" title={d.jenis_berkas?.label}>{d.jenis_berkas?.label}</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel Review Admin */}
                    <div className="space-y-4">
                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <h2 className="mb-4 font-semibold">Review Pendaftaran</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Status</label>
                                    <select
                                        className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as any)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Terima</option>
                                        <option value="rejected">Tolak</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Feedback / Catatan</label>
                                    <textarea
                                        className="w-full rounded-md border px-3 py-2 text-sm bg-background resize-none"
                                        rows={4}
                                        placeholder="Tulis catatan atau alasan keputusan..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    />
                                </div>
                                <Button className="w-full" onClick={handleUpdateStatus} disabled={loading}>
                                    {loading ? 'Menyimpan...' : 'Simpan Keputusan'}
                                </Button>
                            </div>
                            {pendaftaran.reviewed_at && (
                                <p className="mt-3 text-xs text-muted-foreground">
                                    Terakhir direview: {new Date(pendaftaran.reviewed_at).toLocaleString('id-ID')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
