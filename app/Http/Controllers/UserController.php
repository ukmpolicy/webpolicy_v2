<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{

    protected $userService;
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        try {
            // Inertia rendering logic
            $message = $this->userService->sayHello("Rizki Latiful");
            return $message;
        } catch (\Exception $e) {
            // Inertia error handling
        }
    }
}
