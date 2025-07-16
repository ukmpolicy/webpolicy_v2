<?php
namespace App\Repositories;

use App\Models\User;
use Exception;

/**
 * Repository hanya diprogram untuk query resource ke model. tidak
 * boleh ada logic use case di dalam repository.
 */

class UserRepository
{

    public function sayHello($name = null)
    {
        if (!$name) {
            throw new Exception("User not found");
        }
        return "Hello, " . $name;
    }

    public function getAll()
    {
        return User::all();
    }

    public function findByEmail($email)
    {
        return User::where('email', $email)->first();
    }

    public function assignRole($userId, $roleId)
    {
        $user = $this->find($userId);
        $user->role_id = $roleId;
        $user->save();
        return $user;
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function find($id)
    {
        return User::findOrFail($id);
    }
}
