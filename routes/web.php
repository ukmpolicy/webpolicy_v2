<?php

use App\Http\Controllers\MemberController;
use App\Http\Controllers\PeriodsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        // $user = auth()->user();
        // if (!$user->role){
        //     return Inertia::render('welcome');
        // }
        return Inertia::render('dashboard');
    })->name('dashboard');


    // Role roles management
    Route::resource('roles', RoleController::class);

    // Permissions management
    Route::resource('permissions', PermissionController::class);

    // roles permissions management
    Route::post('roles/{role}/permissions', [RolePermissionController::class, 'updatePermissions'])->name('roles.permissions.update');

    // Periods management
    Route::resource('periods', PeriodsController:: class);

    // Member management
    Route::resource('members', MemberController:: class);


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

