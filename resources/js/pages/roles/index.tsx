import { RoleFormModal } from '@/components/RoleFormModal';
import { RolePermissionFormModal } from '@/components/RolePermissionFormModal';
import { RoleTable } from '@/components/RoleTable';
import { RoleUserFormModal } from '@/components/RoleUserModal/RoleUserFormModal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function Role() {
    // Ambil semua data yang dibutuhkan dari props, termasuk 'auth'
    const { roles = [], permissions = [], users = [], canManageUsers = false, auth } = usePage().props as any;

    // State untuk modal form Tambah/Ubah Role
    const [openFormModal, setOpenFormModal] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    const [managedRoleId, setManagedRoleId] = useState<number | null>(null);

    // State untuk mengontrol modal mana yang terbuka
    const [openPermissionModal, setOpenPermissionModal] = useState(false);
    const [openUserModal, setOpenUserModal] = useState(false);

    const managedRole = roles.find((r: any) => r.id === managedRoleId) || null;

    return (
        <AppLayout breadcrumbs={[{ title: 'Role', href: '/roles' }]}>
            <Head title="Role" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Daftar Role</h1>
                    <Button
                        onClick={() => {
                            setEditData(null);
                            setOpenFormModal(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Tambah Role
                    </Button>
                </div>

                <RoleTable
                    data={roles}
                    onEdit={(role) => {
                        setEditData(role);
                        setOpenFormModal(true);
                    }}
                    onManagePermissions={(role) => {
                        setManagedRoleId(role.id);
                        setOpenPermissionModal(true);
                    }}
                    onManageUsers={(role) => {
                        setManagedRoleId(role.id);
                        setOpenUserModal(true);
                    }}
                    canManageUsers={canManageUsers}
                />

                {/* Modal untuk Tambah/Ubah Role */}
                <RoleFormModal
                    open={openFormModal}
                    onClose={() => {
                        setOpenFormModal(false);
                        setEditData(null);
                    }}
                    initialData={editData}
                />

                {/* Render modal hanya jika ada role yang dipilih untuk dikelola */}
                {managedRole && (
                    <>
                        {/* Modal untuk Manage Permissions */}
                        <RolePermissionFormModal
                            open={openPermissionModal}
                            onClose={() => {
                                setOpenPermissionModal(false);
                                setManagedRoleId(null); // Reset ID saat ditutup
                            }}
                            role={managedRole}
                            allPermissions={permissions}
                        />

                        {/* Modal untuk Manage Users */}
                        <RoleUserFormModal
                            open={openUserModal}
                            onClose={() => {
                                setOpenUserModal(false);
                                setManagedRoleId(null); // Reset ID saat ditutup
                            }}
                            role={managedRole}
                            allUsers={users}
                            // Teruskan informasi user yang sedang login
                            currentUser={auth.user}
                        />
                    </>
                )}
            </div>
        </AppLayout>
    );
}
