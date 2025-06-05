<?php
namespace App\Repositories;

use App\Models\User;
use Exception;

class UserRepository {

    public function sayHello($name = null)
    {
        if (!$name) {
            throw new Exception("User not found");
        }
        return "Hello, " . $name;
    }
}