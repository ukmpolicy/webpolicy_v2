import { StructureFormModal } from '@/components/TableStructure/StructureFormModal';
import { StructureTable } from '@/components/TableStructure/StructureTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function StructureIndex() {
const { structures = [], divisions = [], periods = [], sortDirection = 'desc' } = usePage().props;

    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Structure', href: '#' },
                { title: 'Structure', href: '/structures' },
            ]}
        >
            <Head title="Struktur" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Daftar Struktur Organisasi</h1>
                    <Button
                        onClick={() => {
                            setEditData(null);
                            setOpen(true);
                        }}
                    >
                        <Plus className="m-auto w-4" /> Tambah Struktur
                    </Button>
                </div>
                <StructureTable
                    data={structures}
                    onEdit={(structure) => {
                        setEditData(structure);
                        setOpen(true);
                    }}
                    sortDirection={sortDirection}
                />

                <StructureFormModal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setEditData(null);
                    }}
                    initialData={editData}
                    divisions={divisions}
                    periods={periods}
                />
            </div>
        </AppLayout>
    );
}
