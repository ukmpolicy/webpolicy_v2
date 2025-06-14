<?php

namespace App\Services;

use App\Repositories\RolePermissionRepository;

class RolePermissionService
{
    protected $rolePermissionRepository;

    public function __construct(RolePermissionRepository $rolePermissionRepository)
    {
        $this->rolePermissionRepository = $rolePermissionRepository;
    }

    public function getAll()
    {
        return cache()->remember('role_permissions.all', 3600, function () {
            return $this->rolePermissionRepository->getAll();
        });
    }

    public function assignPermissionToRole($roleId, $permissionId)
    {
        $result = $this->rolePermissionRepository->assign($roleId, $permissionId);
        cache()->forget('role_permissions.all');
        cache()->forget("role_permissions.role.$roleId");
        return $result;
    }

    public function unassignPermissionFromRole($roleId, $permissionId)
    {
        $result = $this->rolePermissionRepository->unassign($roleId, $permissionId);
        cache()->forget('role_permissions.all');
        cache()->forget("role_permissions.role.$roleId");
        return $result;
    }

    public function getPermissionsByRole($roleId)
    {
        return cache()->remember("role_permissions.role.$roleId", 3600, function () use ($roleId) {
            return $this->rolePermissionRepository->getByRole($roleId);
        });
    }

    public function getRolesByPermission($permissionId)
    {
        return $this->rolePermissionRepository->getByPermission($permissionId);
    }
}
