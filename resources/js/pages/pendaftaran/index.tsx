import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { PendaftaranTable } from '@/components/TablePendaftaran/PendaftaranTable';

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
                <PendaftaranTable 
                    data={pendaftarans} 
                    onView={(id) => router.visit(`/pendaftaran/${id}`)}
                />
            </div>
        </AppLayout>
    );
}
