<?php

use App\Http\Controllers\DivisionController;
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
;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard')->middleware(['permission:dashboard']);


    // Role roles management
    Route::resource('roles', RoleController::class)->middleware(['permission:roles']);

    // Permissions management
    Route::resource('permissions', PermissionController::class)->middleware(['permission:permissions']);

    // roles permissions management
    Route::post('roles/{role}/permissions', [RolePermissionController::class, 'updatePermissions'])->name('roles.permissions.update');

    // Periods management
    Route::resource('periods', PeriodsController::class)->middleware(['permission:periods']);

    // Member management
    Route::resource('members', MemberController::class)->middleware(['permission:members']);
    Route::post('members/{id}', [MemberController::class, 'update']);

    // Division management
    Route::resource('divisions', DivisionController::class)->middleware(['permission:divisions']);
    // User management

    Route::post('roles/{role}/invite-user', [RoleController::class, 'inviteUser'])->name('roles.inviteUser');
    Route::post('roles/{role}/remove-user', [RoleController::class, 'removeUser'])->name('roles.removeUser');



});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

