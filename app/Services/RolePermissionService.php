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
        return $this->rolePermissionRepository->getAll();
    }

    public function assignPermissionToRole($roleId, $permissionId)
    {
        return $this->rolePermissionRepository->assign($roleId, $permissionId);
    }

    public function unassignPermissionFromRole($roleId, $permissionId)
    {
        return $this->rolePermissionRepository->unassign($roleId, $permissionId);
    }

    public function getPermissionsByRole($roleId)
    {
        return $this->rolePermissionRepository->getByRole($roleId);
    }

    public function getRolesByPermission($permissionId)
    {
        return $this->rolePermissionRepository->getByPermission($permissionId);
    }
}