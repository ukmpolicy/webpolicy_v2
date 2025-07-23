<?php

namespace App\Http\Controllers;

use App\Models\Album; // <-- 1. Tambahkan import model Album
use App\Services\PublicGalleryService;
use Inertia\Inertia;

class PublicGalleryController extends Controller
{
    protected $publicGalleryService;

    public function __construct(PublicGalleryService $publicGalleryService)
    {
        $this->publicGalleryService = $publicGalleryService;
    }

    public function index()
    {
        $publicAlbums = $this->publicGalleryService->getPubliclyVisibleAlbums();

        return Inertia::render('homepage/documentation/index', [
            'albums' => $publicAlbums,
        ]);
    }

    /**
     * 2. Tambahkan metode baru ini.
     * Menampilkan detail album publik beserta semua medianya.
     */
    public function show(Album $album)
    {
        // Pastikan album yang diakses adalah publik
        if ($album->is_private) {
            abort(404);
        }

        // Eager load semua media yang ada di dalam album ini
        $album->load('media');

        // Kirim data ke komponen Inertia baru bernama 'homepage/documentation/Show'
        return Inertia::render('homepage/documentation/show', [
            'album' => $album,
        ]);
    }
}
