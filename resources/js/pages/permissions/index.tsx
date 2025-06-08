import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PermissionTable } from '@/components/PermissionTable';
import { PermissionFormModal } from '@/components/PermissionFormModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Permission', href: '/permissions' },
];

export default function Permission() {
    const { permissions } = usePage().props as { permissions?: any };
    // Ambil array data dari object pagination
    const permissionData = Array.isArray(permissions) ? permissions : permissions?.data ?? [];
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState<{ id?: number; name: string; key: string; description?: string } | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permission" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold">Permission List</h1>
                    <Button onClick={() => {
                            setEditData(null);
                            setOpen(true);
                            }}><Plus className="w-4 m-auto" />
                            Tambah Permission
                    </Button>
                </div>
                {loading ? (
                    <Skeleton className="h-40 w-full" />
                ) : (
                    <PermissionTable
                        data={permissionData}
                        onEdit={permission => {
                            setEditData(permission);
                            setOpen(true);
                        }}
                    />
                )}
                <PermissionFormModal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setEditData(null);
                    }}
                    initialData={editData || { name: "", key: "", description: "" }}
                />
            </div>
        </AppLayout>
    );
}