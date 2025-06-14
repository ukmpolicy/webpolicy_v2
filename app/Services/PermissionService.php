<?php

namespace App\Services;

use App\Repositories\PermissionRepository;

class PermissionService
{
    protected $permissionRepository;

    public function __construct(PermissionRepository $permissionRepository)
    {
        $this->permissionRepository = $permissionRepository;
    }

    public function getAllPermissions()
    {
        return $this->permissionRepository->getAll();
    }

    public function getPermission($id)
    {
        return $this->permissionRepository->find($id);
    }

    public function createPermission(array $data)
    {
        return $this->permissionRepository->create($data);
    }

    public function updatePermission($id, array $data)
    {
        return $this->permissionRepository->update($id, $data);
    }

    public function deletePermission($id)
    {
        return $this->permissionRepository->delete($id);
    }

    public function getAllPermissionsPaginated($perPage = 20)
    {
        return $this->permissionRepository->getAllPaginated($perPage);
    }
}