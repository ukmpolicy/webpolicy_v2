<?php

namespace App\Repositories;

use App\Models\Permission;

class PermissionRepository
{
    public function getAll()
    {
        return Permission::orderBy('id')->get();
    }

    public function find($id)
    {
        return Permission::findOrFail($id);
    }

    public function create(array $data)
    {
        return Permission::create($data);
    }

    public function update($id, array $data)
    {
        $permission = Permission::findOrFail($id);
        $permission->update($data);
        return $permission;
    }

    public function delete($id)
    {
        $permission = Permission::findOrFail($id);
        return $permission->delete();
    }

    public function getAllPaginated($perPage = 20)
    {
        return Permission::orderBy('id')->paginate($perPage);
    }
}