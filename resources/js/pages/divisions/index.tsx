import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function DivisionIndex() {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    // const [division = []] = usePage().props;

    return (
        <AppLayout breadcrumbs={[{ title: 'Divisions', href: '/divisions' }]}>
            <Head title="Division" />

            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold"> Division List</h1>
                    <Button
                        onClick={() => {
                            setEditData(null);
                            setOpen(true);
                        }}
                    >
                        <Plus className="m-auto w-4" /> Tambah Division
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
