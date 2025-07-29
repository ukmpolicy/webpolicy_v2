<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function find($id)
    {
        return User::findOrFail($id);
    }

    public function findByEmail($email)
    {
        return User::where('email', $email)->first();
    }

    public function getAll()
    {
        return User::all();
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function assignRole($userId, $roleId)
    {
        $user = $this->find($userId);
        $user->role_id = $roleId;
        return $user->save();
    }
}
