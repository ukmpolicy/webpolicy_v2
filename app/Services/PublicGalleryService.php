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
        $albums = $this->albumRepository->getPublicAlbums();

        // Tambahkan logika untuk memilih gambar sampul dari setiap album.
        // Ini membuat data yang dikirim ke frontend sudah siap pakai.
        $albums->each(function ($album) {
            // --- PERUBAHAN: Ambil 3 media pertama sebagai perwakilan ---
            // Jika media kurang dari 3, ia akan mengambil seadanya.
            $album->preview_media = $album->media->take(3);
        });

        return $albums;
    }
}
