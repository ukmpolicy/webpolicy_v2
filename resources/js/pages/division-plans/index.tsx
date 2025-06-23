// resources/js/Pages/DivisionPlans/Index.jsx
import { DivisionPlansFormModal } from '@/components/TableDivisionPlans/DivisionPlansFormModal';
import { DivisionPlansTable } from '@/components/TableDivisionPlans/DivisionPlansTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function DivisionPlansIndex() {
    const { division_plans = [], divisions = [] } = usePage().props;

    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    return (
        <AppLayout breadcrumbs={[{ title: 'Division Plans', href: '/division-plans' }]}>
            <Head title="Division Plans" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Division Plans List</h1>
                    <Button
                        onClick={() => {
                            setEditData(null);
                            setOpen(true);
                        }}
                    >
                        <Plus className="m-auto w-4" /> Add Plan
                    </Button>
                </div>
                <DivisionPlansTable
                    data={division_plans}
                    divisions={divisions}
                    onEdit={(plan) => {
                        setEditData(plan);
                        setOpen(true);
                    }}
                />
                <DivisionPlansFormModal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setEditData(null);
                    }}
                    initialData={editData}
                    divisions={divisions}
                />
            </div>
        </AppLayout>
    );
}
