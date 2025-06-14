<?php

namespace App\Repositories;

use App\Models\RolePermission;

class RolePermissionRepository
{
    public function getAll()
    {
        return RolePermission::with(['role', 'permission'])->get();
    }

    public function assign($roleId, $permissionId)
    {
        return RolePermission::firstOrCreate([
            'role_id' => $roleId,
            'permission_id' => $permissionId,
        ]);
    }

    public function unassign($roleId, $permissionId)
    {
        return RolePermission::where('role_id', $roleId)
            ->where('permission_id', $permissionId)
            ->delete();
    }

    public function getByRole($roleId)
    {
        return RolePermission::where('role_id', $roleId)->with('permission')->get();
    }

    public function getByPermission($permissionId)
    {
        return RolePermission::where('permission_id', $permissionId)->with('role')->get();
    }
}