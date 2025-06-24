import { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { RoleTable } from "@/components/RoleTable";
import { RoleFormModal } from "@/components/RoleFormModal";
import { RolePermissionFormModal } from "@/components/RolePermissionFormModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import { Inertia } from "@inertiajs/inertia";
import { RoleUserFormModal } from "@/components/RoleUserModal/RoleUserFormModal";

export default function Role() {
  const { roles = [], permissions = [], users = [] } = usePage().props as any;
  const [open, setOpen] = useState(false);
  const [openManage, setOpenManage] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [manageRoleId, setManageRoleId] = useState<number | null>(null);
  const [ openManageUsers, setOpenManageUsers ] = useState(false);
  const [manageRoleUsersId, setManageRoleUsersId] = useState<number | null>(null);


  const manageRole = roles.find((r: any) => r.id === manageRoleId) || null;
  const manageRoleUsers = roles.find((r: any) => r.id === manageRoleUsersId) || null;

  return (
    <AppLayout breadcrumbs={[{ title: "Role", href: "/roles" }]}>
      <Head title="Role" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Role List</h1>
          <Button onClick={() => { setEditData(null); setOpen(true); }}>
            <Plus className="w-4 m-auto" /> Tambah Role
          </Button>
        </div>
        <RoleTable
          data={roles}
          onEdit={role => { setEditData(role); setOpen(true); }}
          onManagePermissions={role => { setManageRoleId(role.id); setOpenManage(true); }}
          onManageUsers={role => { setManageRoleUsersId(role.id); setOpenManageUsers(true); }}
        />
        <RoleUserFormModal
          open={openManageUsers}
          onClose={() => { setOpenManageUsers(false); setManageRoleUsersId(null); }}
          role={manageRoleUsers}
          allUsers={users}
        />
        <RoleFormModal
          open={open}
          onClose={() => { setOpen(false); setEditData(null); }}
          initialData={editData || { name: "" }}
        />
        <RolePermissionFormModal
          open={openManage}
          onClose={() => { setOpenManage(false); setManageRoleId(null); }}
          role={manageRole}
          allPermissions={permissions}
        />
      </div>
    </AppLayout>
  );
}
