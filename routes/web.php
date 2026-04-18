<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\BlogPageController;
use App\Http\Controllers\CategoryArticleController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
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
use App\Http\Controllers\ProfileUserController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\PendaftaranController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Halaman Publik
|--------------------------------------------------------------------------
*/

// Grup rute publik yang akan dilindungi jika email belum diverifikasi
Route::middleware(['email.public.verified'])->group(function () {
    // Home page route (Beranda)
    Route::get('/', [HomePageController::class, 'index'])->name('home');

    // About
    Route::get('/about', function () {
        return Inertia::render('homepage/about/index');
    })->name('about');

    // Berita (Blog)
    Route::get('/berita', [BlogPageController::class, 'index'])->name('blog.index');
    Route::get('/berita/{slug}', [BlogPageController::class, 'show'])->name('blog.show');

    // Galeri
    Route::get('/dokumentasi', [PublicGalleryController::class, 'index'])->name('public.dokumentasi');
    Route::get('/dokumentasi/albums/{album}', [PublicGalleryController::class, 'show'])->name('public.dokumentasi.album.show');

    // Kontak
    Route::get('/kontak', function () {
        return Inertia::render('homepage/contact/index');
    })->name('contact');
    Route::post('/kontak', [ContactController::class, 'send'])->name('contact.send');
});

// Logout (tetap di luar grup agar bisa diakses dari halaman verify-email)
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

/*
|--------------------------------------------------------------------------
| Halaman Admin (Butuh Login)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard monitoring
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard')
        ->middleware('permission:dashboard');

    // Rute untuk Halaman Profile User
    Route::get('/profile', [ProfileUserController::class, 'index'])->name('profile.edit');
    Route::patch('/profile', [ProfileUserController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileUserController::class, 'destroy'])->name('profile.destroy');

    // Roles Management
    Route::resource('roles', RoleController::class)->middleware('permission:roles');
    Route::post('roles/{role}/permissions', [RolePermissionController::class, 'updatePermissions'])
        ->name('roles.permissions.update')
        ->middleware('permission:roles');

    // Invite/Remove User from Role
    Route::post('/roles/{role}/invite-user', [RoleController::class, 'inviteUser'])
        ->name('roles.inviteUser')
        ->middleware('permission:roles');
    Route::post('/roles/{role}/remove-user', [RoleController::class, 'removeUser'])
        ->name('roles.removeUser')
        ->middleware('permission:roles');

    // Permissions management
    Route::resource('permissions', PermissionController::class)->middleware('permission:permissions');

    // Periods Management
    Route::resource('periods', PeriodsController::class)->middleware('permission:periods');

    // Visi & Misi Management (dianggap bagian dari manajemen periode)
    Route::middleware('permission:periods')->group(function () {
        Route::post('/periods/{period}/vissions', [VissionController::class, 'store'])->name('vissions.store');
        Route::put('/vissions/{vission}', [VissionController::class, 'update'])->name('vissions.update');
        Route::delete('/vissions/{vission}', [VissionController::class, 'destroy'])->name('vissions.destroy');

        Route::post('/periods/{period}/missions', [MissionController::class, 'store'])->name('missions.store');
        Route::put('/missions/{mission}', [MissionController::class, 'update'])->name('missions.update');
        Route::delete('/missions/{mission}', [MissionController::class, 'destroy'])->name('missions.destroy');
    });

    // Rute untuk mengimpor member
    Route::post('/members/import', [MemberController::class, 'import'])->name('members.import');

    // Rute untuk mengunduh template import member (Tambahan baru)
    Route::get('/members/download-template/{type?}', [MemberController::class, 'downloadTemplate'])
        ->name('members.download-template')
        ->middleware('permission:members');
    // Rute untuk ekspor member
    Route::get('members/export/{type}', [MemberController::class, 'export'])
        ->name('members.export')
        ->middleware('permission:members');
    // ...

    // Member management
    Route::resource('members', MemberController::class)->middleware('permission:members');
    Route::post('members/{id}', [MemberController::class, 'update'])->middleware('permission:members');

    // // Rute Import yang baru ditambahkan
    // Route::post('members/import', [MemberController::class, 'import'])
    //     ->name('members.import')
    //     ->middleware('permission:members');

    // Division Management
    Route::resource('divisions', DivisionController::class)->middleware('permission:divisions');

    // Division Plans Management
    Route::resource('division-plans', DivisionPlansController::class)->middleware('permission:division-plans');

    // Gallery Management
    Route::resource('gallery-album', AlbumController::class)->middleware('permission:gallery-album');
    Route::resource('gallery-media', MediaController::class)->middleware('permission:gallery-media');
    Route::post('gallery-media/{id}/move', [MediaController::class, 'move'])
        ->name('gallery-media.move')
        ->middleware('permission:gallery-media');

    // Article Management
    Route::resource('category-articles', CategoryArticleController::class)->middleware('permission:category-articles');
    Route::resource('articles', ArticleController::class)->middleware('permission:articles');
    Route::post('/articles/upload-image', [ArticleController::class, 'uploadImage'])
        ->name('articles.uploadImage')
        ->middleware('permission:articles');

    // Structure Management
    Route::get('/structures/next-level', [StructureController::class, 'getNextLevel'])->middleware('permission:structures');
    Route::resource('structures', StructureController::class)->middleware('permission:structures');
    Route::post('/structures/reorder', [StructureController::class, 'reorder'])
        ->name('structures.reorder')
        ->middleware('permission:structures');

    // Structure Member Management
    Route::get('/structure-members', [StructureMemberController::class, 'index'])
        ->name('structure-members.index')
        ->middleware('permission:structure-members');
    Route::post('/structure-members', [StructureMemberController::class, 'store'])
        ->name('structure-members.store')
        ->middleware('permission:structure-members');
    Route::post('structure-members/{id}', [StructureMemberController::class, 'update'])->middleware('permission:structure-members');
    Route::get('/structure-members/{id}', [StructureMemberController::class, 'show'])->middleware('permission:structure-members');

    // Pendaftaran
    Route::resource('pendaftaran', PendaftaranController::class)->except(['create', 'edit']);
    Route::post('pendaftaran/{id}/process', [PendaftaranController::class, 'process'])->name('pendaftaran.process');
    Route::get('kuisioner', [\App\Http\Controllers\RecruitmentFieldController::class, 'indexKuisioner'])->name('kuisioner.index');
    Route::get('dokumen-berkas', [\App\Http\Controllers\RecruitmentFieldController::class, 'indexDokumen'])->name('dokumen.index');
    Route::resource('recruitment-fields', \App\Http\Controllers\RecruitmentFieldController::class)->only(['store', 'update', 'destroy']);
    // Timeline & Setting
    Route::get('open-recruitment-timeline', [\App\Http\Controllers\SettingController::class, 'openRecruitmentTimeline'])->name('pendaftaran.timeline');
    Route::post('open-recruitment-timeline', [\App\Http\Controllers\SettingController::class, 'updateOpenRecruitmentTimeline']);

});

// require __DIR__ . '/settings.php'; // TIDAK DIGUNAKAN LAGI
require __DIR__ . '/auth.php';


// Rute fallback untuk halaman not found (Tambahan baru)
Route::fallback(function () {
    return Inertia::render('not-found');
});
