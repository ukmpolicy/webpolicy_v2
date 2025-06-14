<?php
namespace App\Services;

use App\Repositories\UserRepository;

/**
 * Service hanya diprogram untuk melakukan logic use case. Tidak
 * diperuntuk untuk menangani http request maupun response.
 */

class UserService {
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function sayHello($name)
    {
        return $this->userRepository->sayHello($name);
    }

    public function hasPermission($user, $key)
    {
        if (!$user->role) return false;
        return $user->role->permissions->contains('key', $key);
    }

    public function assignRole($user, $roleId)
    {
        $user->role_id = $roleId;
        $user->save();
        return $user;
    }
}
