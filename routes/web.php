<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\DivisionPlansController;
use App\Http\Controllers\MediaController;
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
        // })->name('dashboard')->middleware(['permission:dashboard']);
    })
        ->name('dashboard')
        ->middleware(['permission:dashboard']);

    // Role roles management
    Route::resource('roles', RoleController::class)->middleware(['permission:roles']);
    // middleware(['permission:roles']);

    // Permissions management
    Route::resource('permissions', PermissionController::class)->middleware(['permission:permissions']);
    // ->middleware(['permission:permissions']);

    // roles permissions management
    Route::post('roles/{role}/permissions', [RolePermissionController::class, 'updatePermissions'])->name('roles.permissions.update');
    // ->name('roles.permissions.update');

    // Periods management
    Route::resource('periods', PeriodsController::class)->middleware(['permission:periods']);
    // ->middleware(['permission:periods']);

    // Member management
    Route::resource('members', MemberController::class)->middleware(['permission:members']);
    //
    Route::post('members/{id}', [MemberController::class, 'update'])->middleware(['permission:members']);

    // Division management
    Route::resource('divisions', DivisionController::class)->middleware(['permission:divisions']);
    // ->middleware(['permission:divisions']);

    // Division Plans Management
    Route::resource('division-plans', DivisionPlansController::class)->middleware(['permission:division-plans']);

    // Gallery Management
    Route::resource('gallery-album', AlbumController::class)->middleware(['permission:gallery-album']);
    Route::resource('gallery-media', MediaController::class)->middleware(['permission:gallery-media']);
    // Additional route for moving media
    Route::post('gallery-media/{id}/move', [MediaController::class, 'move'])->name('gallery-media.move');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
