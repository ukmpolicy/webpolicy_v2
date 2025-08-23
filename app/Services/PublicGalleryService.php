<?php

namespace App\Services;

use App\Repositories\AlbumRepository;

class PublicGalleryService
{
    protected $albumRepository;

    public function __construct(AlbumRepository $albumRepository)
    {
        $this->albumRepository = $albumRepository;
    }

    /**
     * Mendapatkan semua album yang siap ditampilkan di galeri publik.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getPubliclyVisibleAlbums()
    {
        // Mendapatkan album publik dengan relasi media yang sudah diurutkan
        $albums = $this->albumRepository->getPublicAlbums();

        // Muat ulang relasi 'media' dengan pengurutan.
        // Ini memastikan preview_media adalah yang terbaru.
        $albums->load(['media' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        // Tambahkan logika untuk memilih gambar sampul dari setiap album.
        // Ini membuat data yang dikirim ke frontend sudah siap pakai.
        $albums->each(function ($album) {
            // --- PERUBAHAN: Ambil 3 media pertama sebagai perwakilan ---
            // Karena relasi sudah diurutkan, ini akan mengambil 3 media terbaru.
            $album->preview_media = $album->media->take(3);
        });

        return $albums;
    }
}
