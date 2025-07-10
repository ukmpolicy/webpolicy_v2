import { DivisionFormModal } from '@/components/TableDivision/DivisionFormModal';
import { DivisionTable } from '@/components/TableDivision/DivisionTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function DivisionIndex() {
    // Tambahkan 'activePeriod' ke destructuring props
    const { divisions = [], periods = [], selectedPeriod = '', activePeriod = null } = usePage().props;
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    return (
        <AppLayout
            // navigasi
            breadcrumbs={[
                { title: 'Division', href: '#' },
                { title: 'Division', href: '/divisions' },
            ]}
        >
            <Head title="Divisi" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Daftar Divisi</h1>
                    <Button
                        onClick={() => {
                            setEditData(null);
                            setOpen(true);
                        }}
                    >
                        <Plus className="m-auto w-4" /> Tambah Divisi
                    </Button>
                </div>

                {activePeriod && (
                    <div className="font-semibold text-green-600">
                        Periode aktif saat ini: <strong>{activePeriod.name}</strong>
                    </div>
                )}
                {/* Akhir blok periode aktif --> */}

                <DivisionTable
                    data={divisions}
                    onEdit={(division) => {
                        setEditData(division);
                        setOpen(true);
                    }}
                    periods={periods}
                    selectedPeriod={selectedPeriod}
                />
                <DivisionFormModal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setEditData(null);
                    }}
                    initialData={editData}
                    periods={periods}
                />
            </div>
        </AppLayout>
    );
}
