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
use App\Http\Controllers\StructureController;
use App\Http\Controllers\StructureMemberController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard')->middleware(['permission:dashboard']);

    // Roles Management
    Route::resource('roles', RoleController::class)->middleware(['permission:roles']);
    Route::post('roles/{role}/permissions', [RolePermissionController::class, 'updatePermissions'])
        ->name('roles.permissions.update')
        ->middleware(['permission:roles']);

    // Permissions Management
    Route::resource('permissions', PermissionController::class)->middleware(['permission:permissions']);

    // Periods Management
    Route::resource('periods', PeriodsController::class)->middleware(['permission:periods']);

    // Member Management
    Route::resource('members', MemberController::class)->middleware(['permission:members']);
    Route::post('members/{id}', [MemberController::class, 'update'])->middleware(['permission:members']);

    // Division Management
    Route::resource('divisions', DivisionController::class)->middleware(['permission:divisions']);

    // Division Plans Management
    Route::resource('division-plans', DivisionPlansController::class)->middleware(['permission:division-plans']);

    // Gallery Management
    Route::resource('gallery-album', AlbumController::class)->middleware(['permission:gallery-album']);
    Route::resource('gallery-media', MediaController::class)->middleware(['permission:gallery-media']);
    Route::post('gallery-media/{id}/move', [MediaController::class, 'move'])
        ->name('gallery-media.move')
        ->middleware(['permission:gallery-media']);

    // Structure Management
    Route::get('/structures/next-level', [StructureController::class, 'getNextLevel'])
        ->middleware(['permission:structures']);
    Route::resource('structures', StructureController::class)->middleware(['permission:structures']);

    // Structure Member Management 
    Route::get('/structure-members', [StructureMemberController::class, 'index'])
        ->name('structure-members.index')
        ->middleware(['permission:structure-members']);

    Route::post('/structure-members', [StructureMemberController::class, 'store'])
        ->name('structure-members.store')
        ->middleware(['permission:structure-members']);

    Route::post('structure-members/{id}', [StructureMemberController::class, 'update'])
        ->middleware(['permission:structure-members']);

    Route::get('/structure-members/{id}', [StructureMemberController::class, 'show'])
        ->middleware(['permission:structure-members']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
