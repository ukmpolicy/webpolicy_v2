import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RoleTable } from '@/components/RoleTable';
import { RoleFormModal } from '@/components/RoleFormModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Role', href: '/roles' },
];

export default function Role() {
    const { roles = [] } = usePage().props as { roles?: any[] };
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState<{ id?: number; name: string } | null>(null);

    // Jika ingin loading saat submit, bisa setLoading(true) sebelum fetch/submit

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold">Role List</h1>
                    <Button onClick={() => {
                            setEditData(null);
                            setOpen(true);
                            }}><Plus className="w-4 m-auto" />
                            Tambah Role
                    </Button>
                </div>
                {loading ? (
                    <Skeleton className="h-40 w-full" />
                ) : (
                    <RoleTable
                        data={roles}
                        onEdit={role => {
                            setEditData(role);
                            setOpen(true);
                        }}
                    />
                )}
                <RoleFormModal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setEditData(null);
                    }}
                    initialData={editData || { name: "" }}
                />
            </div>
        </AppLayout>
    );
}
