<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CategoryArticleController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\DivisionPlansController;
use App\Http\Controllers\HomepageController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PeriodsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\StructureController;
use App\Http\Controllers\StructureMemberController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VissionController;
use App\Http\Controllers\MissionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomepageController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })
        ->name('dashboard')
        ->middleware(['permission:dashboard']);

    // Roles Management
    Route::resource('roles', RoleController::class)->middleware(['permission:roles']);
    Route::post('roles/{role}/permissions', [RolePermissionController::class, 'updatePermissions'])
        ->name('roles.permissions.update')
        ->middleware(['permission:roles']);

    // --- TAMBAHKAN DUA ROUTE INI ---
    Route::post('/roles/{role}/invite-user', [RoleController::class, 'inviteUser'])
        ->name('roles.inviteUser')
        ->middleware(['permission:roles']);
    Route::post('/roles/{role}/remove-user', [RoleController::class, 'removeUser'])
        ->name('roles.removeUser')
        ->middleware(['permission:roles']);
    // --- AKHIR TAMBAHAN ---

    // Permissions management
    Route::resource('permissions', PermissionController::class)->middleware(['permission:permissions']);

    // Periods Management
    Route::resource('periods', PeriodsController::class)->middleware(['permission:periods']);

    // --- TAMBAHAN BARU: Route untuk Visi & Misi ---
    // Middleware 'permission:periods' digunakan karena mengelola Visi/Misi adalah bagian dari mengelola Periode.
    Route::middleware(['permission:periods'])->group(function () {
        // Vission Management
        Route::post('/periods/{period}/vissions', [VissionController::class, 'store'])->name('vissions.store');
        Route::put('/vissions/{vission}', [VissionController::class, 'update'])->name('vissions.update');
        Route::delete('/vissions/{vission}', [VissionController::class, 'destroy'])->name('vissions.destroy');

        // Mission Management
        Route::post('/periods/{period}/missions', [MissionController::class, 'store'])->name('missions.store');
        Route::put('/missions/{mission}', [MissionController::class, 'update'])->name('missions.update');
        Route::delete('/missions/{mission}', [MissionController::class, 'destroy'])->name('missions.destroy');
    });
    // --- AKHIR TAMBAHAN BARU ---

    // Member management
    Route::resource('members', MemberController::class)->middleware(['permission:members']);
    Route::post('members/{id}', [MemberController::class, 'update'])->middleware(['permission:members']);

    // Division Management
    Route::resource('divisions', DivisionController::class)->middleware(['permission:divisions']);

    // Division Plans Management
    Route::resource('division-plans', DivisionPlansController::class)->middleware(['permission:division-plans']);

    // Gallery Management
    Route::resource('gallery-album', AlbumController::class)->middleware(['permission:gallery-album']);
    Route::resource('gallery-media', MediaController::class)->middleware(['permission:gallery-media']);
    // Additional route for moving media
    Route::post('gallery-media/{id}/move', [MediaController::class, 'move'])
        ->name('gallery-media.move')
        ->middleware(['permission:gallery-media']);

        // Management Articel
    Route::resource('category-articles', CategoryArticleController::class)->middleware(['permission:gallery-media']);
    Route::resource('articles', ArticleController::class)->middleware(['permission:gallery-media']);
    // ROUTE BARU UNTUK UPLOAD GAMBAR EDITOR
    // Penting: Tambahkan middleware permission yang sama seperti resource articles
    Route::post('/articles/upload-image', [ArticleController::class, 'uploadImage'])
        ->name('articles.uploadImage')
        ->middleware(['permission:gallery-media']);

    // Structure Management
    Route::get('/structures/next-level', [StructureController::class, 'getNextLevel'])->middleware(['permission:structures']);
    Route::resource('structures', StructureController::class)->middleware(['permission:structures']);

    // Structure Member Management
    Route::get('/structure-members', [StructureMemberController::class, 'index'])
        ->name('structure-members.index')
        ->middleware(['permission:structure-members']);

    Route::post('/structure-members', [StructureMemberController::class, 'store'])
        ->name('structure-members.store')
        ->middleware(['permission:structure-members']);

    Route::post('structure-members/{id}', [StructureMemberController::class, 'update'])->middleware(['permission:structure-members']);

    Route::get('/structure-members/{id}', [StructureMemberController::class, 'show'])->middleware(['permission:structure-members']);
});
    
    //about
    Route::get('/about', function () {
    return Inertia::render('homepage/about/index');

}); 

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
