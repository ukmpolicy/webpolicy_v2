<?php

namespace App\Services;

use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;

class RoleService
{
    protected $roleRepository;
    protected $userRepository;

    public function __construct(RoleRepository $roleRepository, UserRepository $userRepository)
    {
        $this->roleRepository = $roleRepository;
        $this->userRepository = $userRepository; // <-- tambahkan ini
    }

    public function getAllRoles()
    {
        return $this->roleRepository->getAllWithPermissions();
    }

    public function createRole(array $data)
    {
        return $this->roleRepository->create($data);
    }

    public function updateRole($id, array $data)
    {
        return $this->roleRepository->update($id, $data);
    }

    public function deleteRole($id)
    {
        return $this->roleRepository->delete($id);
    }

    public function syncPermissions($roleId, array $permissionIds)
    {
        $role = $this->roleRepository->find($roleId);
        $role->permissions()->sync($permissionIds);
    }

    public function assignOrInviteUserByEmail($roleId, $email)
    {
        $user = $this->userRepository->findByEmail($email);
        if ($user) {
            $this->userRepository->assignRole($user->id, $roleId);
        } else {
            $user = $this->userRepository->create([
                'email' => $email,
                'name' => $email,
                'password' => bcrypt(\Str::random(12)),
                'role_id' => $roleId,
            ]);
            // (Opsional) Kirim email undangan
        }
    }

    public function removeUserFromRole($roleId, $userId)
    {
        $user = $this->userRepository->find($userId);
        if ($user->role_id == $roleId) {
            $this->userRepository->assignRole($userId, null);
        }
    }
}
