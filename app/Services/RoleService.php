<?php

namespace App\Services;

use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;
use Illuminate\Validation\ValidationException;

class RoleService
{
    protected $roleRepository;
    protected $userRepository;

    public function __construct(RoleRepository $roleRepository, UserRepository $userRepository)
    {
        $this->roleRepository = $roleRepository;
        $this->userRepository = $userRepository;
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
        $role = $this->roleRepository->find($id);
        if ($role->users()->count() > 0) {
            throw ValidationException::withMessages([
                'general' => 'Gagal! Role ini masih digunakan oleh ' . $role->users()->count() . ' user.',
            ]);
        }
        return $this->roleRepository->delete($id);
    }

    public function syncPermissions($roleId, array $permissionIds)
    {
        $role = $this->roleRepository->find($roleId);
        $role->permissions()->sync($permissionIds);
    }

    /**
     * Menambahkan user ke role berdasarkan email.
     * Jika user tidak ada, buat user baru (sebagai undangan).
     */
    public function assignOrInviteUserByEmail($roleId, $email)
    {
        $user = $this->userRepository->findByEmail($email);
        if ($user) {
            // Jika user sudah ada di role ini, tidak perlu lakukan apa-apa
            if ($user->role_id == $roleId) {
                return;
            }
            // Jika user ada tapi di role lain, pindahkan
            $this->userRepository->assignRole($user->id, $roleId);
        } else {
            // Jika user belum ada, buat user baru
            $this->userRepository->create([
                'email' => $email,
                'name' => explode('@', $email)[0], // Ambil nama dari bagian sebelum @
                'password' => bcrypt(\Str::random(16)),
                'role_id' => $roleId,
            ]);
        }
    }

    /**
     * Menghapus user dari sebuah role (mengatur role_id menjadi null).
     */
    public function removeUserFromRole($roleId, $userId)
    {
        $user = $this->userRepository->find($userId);
        if ($user && $user->role_id == $roleId) {
            $this->userRepository->assignRole($userId, null);
        }
    }
}
