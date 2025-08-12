import { PeriodFormModal } from '@/components/TablePeriods/PeriodFormModal';
import { PeriodTable } from '@/components/TablePeriods/PeriodTable';
import { MissionManagementModal } from '@/components/VissionMissionModal/MissionManagementModal';
import { VissionManagementModal } from '@/components/VissionMissionModal/VissionManagementModal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function Index() {
    // periods dari props akan selalu menjadi data yang paling segar setelah reload
    const { periods = [] } = usePage().props as { periods: any[] };

    // State untuk modal form Periode (Tambah/Ubah)
    const [openPeriodForm, setOpenPeriodForm] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    // --- PERUBAHAN: Simpan hanya ID, bukan seluruh objek ---
    const [managedVissionPeriodId, setManagedVissionPeriodId] = useState<number | null>(null);
    const [managedMissionPeriodId, setManagedMissionPeriodId] = useState<number | null>(null);

    // --- PERUBAHAN: Cari objek periode dari props terbaru pada setiap render ---
    // Ini memastikan modal selalu mendapatkan data yang paling segar.
    const managedPeriodForVissions = periods.find((p) => p.id === managedVissionPeriodId) || null;
    const managedPeriodForMissions = periods.find((p) => p.id === managedMissionPeriodId) || null;

    const activePeriod = periods.find((p) => p.is_active);

    return (
        <AppLayout breadcrumbs={[{ title: 'Periods', href: '/periods' }]}>
            <Head title="Periods" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-xl font-bold">Daftar Periode</h1>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                setEditData(null);
                                setOpenPeriodForm(true);
                            }}
                        >
                            <Plus className="m-auto w-4" /> Tambah Periode
                        </Button>
                    </div>
                </div>
                {activePeriod && (
                    <div className="font-semibold text-green-600">
                        Periode aktif saat ini: <strong>{activePeriod.name}</strong>
                    </div>
                )}
                <PeriodTable
                    data={periods} // Berikan data periods yang selalu segar
                    onEdit={(period) => {
                        setEditData(period);
                        setOpenPeriodForm(true);
                    }}
                    // --- PERUBAHAN: Set hanya ID saat tombol diklik ---
                    onManageVisions={(period) => setManagedVissionPeriodId(period.id)}
                    onManageMissions={(period) => setManagedMissionPeriodId(period.id)}
                />

                <PeriodFormModal
                    open={openPeriodForm}
                    onClose={() => {
                        setOpenPeriodForm(false);
                        setEditData(null);
                    }}
                    initialData={editData || { name: '', started_at: '', ended_at: '', is_active: false }}
                />

                {/* --- PERUBAHAN: Logika untuk membuka dan menutup modal --- */}
                {managedPeriodForVissions && (
                    <VissionManagementModal
                        open={!!managedVissionPeriodId}
                        onClose={() => setManagedVissionPeriodId(null)}
                        period={managedPeriodForVissions}
                    />
                )}

                {managedPeriodForMissions && (
                    <MissionManagementModal
                        open={!!managedMissionPeriodId}
                        onClose={() => setManagedMissionPeriodId(null)}
                        period={managedPeriodForMissions}
                    />
                )}
            </div>
        </AppLayout>
    );
}
