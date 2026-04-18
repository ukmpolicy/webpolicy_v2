import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Pendaftaran = {
    id: number;
    nama: string;
    nim: string;
    email: string;
    jurusan: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    period?: { name: string };
};

type Statistik = {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
};

const statusConfig = {
    pending:  { label: 'Pending',  color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
    accepted: { label: 'Diterima', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',   icon: CheckCircle },
    rejected: { label: 'Ditolak',  color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',           icon: XCircle },
};

export default function PendaftaranIndex() {
    const { pendaftarans = [], periods = [], activePeriodId = null, activePeriod = null, statistik = null, filterStatus = '' } =
        usePage().props as {
            pendaftarans: Pendaftaran[];
            periods: { id: number; name: string }[];
            activePeriodId: number | null;
            activePeriod: { name: string } | null;
            statistik: Statistik | null;
            filterStatus: string;
        };

    const [selectedPeriod, setSelectedPeriod] = useState<string>(activePeriodId?.toString() ?? '');
    const [selectedStatus, setSelectedStatus] = useState<string>(filterStatus ?? '');

    const handleFilter = (period: string, status: string) => {
        router.get('/pendaftaran', { period_id: period, status }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Hapus data pendaftar ini?')) return;
        router.delete(`/pendaftaran/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Open Recruitment', href: '/pendaftaran' }, { title: 'Pendaftaran', href: '/pendaftaran' }]}>
            <Head title="Manajemen Pendaftaran" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Manajemen Pendaftaran</h1>
                        {activePeriod && (
                            <p className="text-sm text-muted-foreground">
                                Periode aktif: <strong>{activePeriod.name}</strong>
                            </p>
                        )}
                    </div>
                </div>

                {/* Statistik Cards */}
                {statistik && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            { label: 'Total',    value: statistik.total,    color: 'text-blue-600' },
                            { label: 'Pending',  value: statistik.pending,  color: 'text-yellow-600' },
                            { label: 'Diterima', value: statistik.accepted, color: 'text-green-600' },
                            { label: 'Ditolak',  value: statistik.rejected, color: 'text-red-600' },
                        ].map((s) => (
                            <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm">
                                <p className="text-sm text-muted-foreground">{s.label}</p>
                                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filter */}
                <div className="flex flex-wrap gap-3 rounded-xl border bg-card p-4">
                    <select
                        className="rounded-md border px-3 py-2 text-sm bg-background"
                        value={selectedPeriod}
                        onChange={(e) => { setSelectedPeriod(e.target.value); handleFilter(e.target.value, selectedStatus); }}
                    >
                        <option value="">Semua Periode</option>
                        {(periods as { id: number; name: string }[]).map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <select
                        className="rounded-md border px-3 py-2 text-sm bg-background"
                        value={selectedStatus}
                        onChange={(e) => { setSelectedStatus(e.target.value); handleFilter(selectedPeriod, e.target.value); }}
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Diterima</option>
                        <option value="rejected">Ditolak</option>
                    </select>
                </div>

                {/* Tabel */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50 text-left">
                                    <th className="px-4 py-3 font-semibold">#</th>
                                    <th className="px-4 py-3 font-semibold">Nama</th>
                                    <th className="px-4 py-3 font-semibold">NIM</th>
                                    <th className="px-4 py-3 font-semibold">Email</th>
                                    <th className="px-4 py-3 font-semibold">Jurusan</th>
                                    <th className="px-4 py-3 font-semibold">Periode</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 font-semibold">Tanggal Daftar</th>
                                    <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {pendaftarans.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-10 text-center text-muted-foreground">
                                            Belum ada data pendaftar.
                                        </td>
                                    </tr>
                                ) : (
                                    pendaftarans.map((item, idx) => {
                                        const sc = statusConfig[item.status];
                                        const Icon = sc.icon;
                                        return (
                                            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                                                <td className="px-4 py-3 font-medium">{item.nama}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{item.nim}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{item.email}</td>
                                                <td className="px-4 py-3">{item.jurusan}</td>
                                                <td className="px-4 py-3">{item.period?.name ?? '-'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${sc.color}`}>
                                                        <Icon size={11} />
                                                        {sc.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/pendaftaran/${item.id}`}>
                                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                                                <Eye size={14} />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
