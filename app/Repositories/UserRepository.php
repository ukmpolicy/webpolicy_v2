<?php
namespace App\Repositories;

use App\Models\User;
use Exception;

/**
 * Repository hanya diprogram untuk query resource ke model. tidak
 * boleh ada logic use case di dalam repository.
 */

class UserRepository {

    public function sayHello($name = null)
    {
        if (!$name) {
            throw new Exception("User not found");
        }
        return "Hello, " . $name;
    }


    // list, single, create, update, delete 
}