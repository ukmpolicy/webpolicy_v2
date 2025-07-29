import { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { RoleTable } from "@/components/RoleTable";
import { RoleFormModal } from "@/components/RoleFormModal";
import { RolePermissionFormModal } from "@/components/RolePermissionFormModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RoleUserFormModal } from "@/components/RoleUserModal/RoleUserFormModal";

export default function Role() {
    // Ambil semua data yang dibutuhkan dari props. 'roles' di sini akan selalu menjadi data yang paling segar.
    const { roles = [], permissions = [], users = [], canManageUsers = false } = usePage().props as any;

    // State untuk modal form Tambah/Ubah Role
    const [openFormModal, setOpenFormModal] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    // --- PERUBAHAN: Simpan hanya ID dari role yang dikelola, bukan seluruh objek ---
    const [managedRoleId, setManagedRoleId] = useState<number | null>(null);

    // State untuk mengontrol modal mana yang terbuka
    const [openPermissionModal, setOpenPermissionModal] = useState(false);
    const [openUserModal, setOpenUserModal] = useState(false);

    // --- PERUBAHAN: Cari objek role dari props 'roles' yang segar pada setiap render ---
    // Ini memastikan modal selalu mendapatkan data terbaru setelah ada perubahan.
    const managedRole = roles.find((r: any) => r.id === managedRoleId) || null;

    return (
        <AppLayout breadcrumbs={[{ title: "Role", href: "/roles" }]}>
            <Head title="Role" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold">Daftar Role</h1>
                    <Button onClick={() => { setEditData(null); setOpenFormModal(true); }}>
                        <Plus className="w-4 h-4 mr-2" /> Tambah Role
                    </Button>
                </div>

                <RoleTable
                    data={roles}
                    onEdit={role => {
                        setEditData(role);
                        setOpenFormModal(true);
                    }}
                    // --- PERUBAHAN: Saat tombol diklik, simpan hanya ID-nya ---
                    onManagePermissions={role => {
                        setManagedRoleId(role.id);
                        setOpenPermissionModal(true);
                    }}
                    onManageUsers={role => {
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
                        />
                    </>
                )}
            </div>
        </AppLayout>
    );
}
