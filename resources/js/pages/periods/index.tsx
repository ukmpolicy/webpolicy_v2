import { PeriodFormModal } from '@/components/TablePeriods/PeriodFormModal';
import { PeriodTable } from '@/components/TablePeriods/PeriodTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function Index() {
    const { periods = [] } = usePage().props as { periods: any[] };
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [search, setSearch] = useState(''); // State untuk filter

    // Filter periods berdasarkan nama
    const filteredPeriods = periods.filter((period) => period.name.toLowerCase().includes(search.toLowerCase()));

    const activePeriod = periods.find((p) => p.is_active);

    return (
        <AppLayout breadcrumbs={[{ title: 'Periods', href: '/periods' }]}>
            <Head title="Periods" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-xl font-bold">Periode List</h1>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                setEditData(null);
                                setOpen(true);
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
                    data={filteredPeriods}
                    onEdit={(period) => {
                        setEditData(period);
                        setOpen(true);
                    }}
                />

                <PeriodFormModal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setEditData(null);
                    }}
                    initialData={editData || { name: '', started_year: '', ended_year: '', is_active: false }}
                />
            </div>
        </AppLayout>
    );
}
