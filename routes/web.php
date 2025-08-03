<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\BlogPageController;
use App\Http\Controllers\CategoryArticleController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\DivisionPlansController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PeriodsController;
use App\Http\Controllers\PublicGalleryController;
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

/*
|--------------------------------------------------------------------------
| Halaman Publik
|--------------------------------------------------------------------------
*/

Route::get('/', [HomePageController::class, 'index'])->name('home');

Route::get('/about', function () {
    return Inertia::render('homepage/about/index');
})->name('about');

Route::get('/berita', [BlogPageController::class, 'index'])->name('blog.index');
Route::get('/berita/{slug}', [BlogPageController::class, 'show'])->name('blog.show');

Route::get('/gallery', [PublicGalleryController::class, 'index'])->name('public.gallery');
Route::get('/gallery/albums/{album}', [PublicGalleryController::class, 'show'])->name('public.gallery.album.show');

Route::get('/contact', function () {
    return Inertia::render('homepage/contact/index');
})->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

/*
|--------------------------------------------------------------------------
| Halaman Admin (Butuh Login)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('roles', RoleController::class);
    Route::post('roles/{role}/permissions', [RolePermissionController::class, 'updatePermissions'])->name('roles.permissions.update');
    Route::post('/roles/{role}/invite-user', [RoleController::class, 'inviteUser'])->name('roles.inviteUser');
    Route::post('/roles/{role}/remove-user', [RoleController::class, 'removeUser'])->name('roles.removeUser');

    Route::resource('permissions', PermissionController::class);
    Route::resource('periods', PeriodsController::class);

    Route::group([], function () {
        Route::post('/periods/{period}/vissions', [VissionController::class, 'store'])->name('vissions.store');
        Route::put('/vissions/{vission}', [VissionController::class, 'update'])->name('vissions.update');
        Route::delete('/vissions/{vission}', [VissionController::class, 'destroy'])->name('vissions.destroy');

        Route::post('/periods/{period}/missions', [MissionController::class, 'store'])->name('missions.store');
        Route::put('/missions/{mission}', [MissionController::class, 'update'])->name('missions.update');
        Route::delete('/missions/{mission}', [MissionController::class, 'destroy'])->name('missions.destroy');
    });

    Route::resource('members', MemberController::class);
    Route::post('members/{id}', [MemberController::class, 'update']);

    Route::resource('divisions', DivisionController::class);
    Route::resource('division-plans', DivisionPlansController::class);

    Route::resource('gallery-album', AlbumController::class);
    Route::resource('gallery-media', MediaController::class);
    Route::post('gallery-media/{id}/move', [MediaController::class, 'move'])->name('gallery-media.move');

    Route::resource('category-articles', CategoryArticleController::class);
    Route::resource('articles', ArticleController::class);
    Route::post('/articles/upload-image', [ArticleController::class, 'uploadImage'])->name('articles.uploadImage');

    Route::get('/structures/next-level', [StructureController::class, 'getNextLevel']);
    Route::resource('structures', StructureController::class);
    Route::post('/structures/reorder', [StructureController::class, 'reorder'])->name('structures.reorder');

    Route::get('/structure-members', [StructureMemberController::class, 'index'])->name('structure-members.index');
    Route::post('/structure-members', [StructureMemberController::class, 'store'])->name('structure-members.store');
    Route::post('structure-members/{id}', [StructureMemberController::class, 'update']);
    Route::get('/structure-members/{id}', [StructureMemberController::class, 'show']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
