<?php

namespace App\Services;

use App\Repositories\AlbumRepository;
use App\Repositories\MediaRepository;

class AlbumService
{
    protected $albumRepository;
    protected $mediaRepository;
        protected $mediaService;

    // public function __construct(
    //     AlbumRepository $albumRepository,
    //     MediaRepository $mediaRepository
    // ) {
    //     $this->albumRepository = $albumRepository;
    //     $this->mediaRepository = $mediaRepository;
    // }

        public function __construct(
        AlbumRepository $albumRepository,
        MediaService $mediaService // <--- Inject MediaService, BUKAN MediaRepository
    ) {
        $this->albumRepository = $albumRepository;
        $this->mediaService = $mediaService; // <--- Tetapkan MediaService
    }
    public function getAllAlbums()
    {
        return $this->albumRepository->getAll();
    }

    public function getAlbumWithMedia($id)
    {
        return $this->albumRepository->findById($id);
    }

    public function createAlbum(array $data)
    {
        return $this->albumRepository->create($data);
    }

    public function updateAlbum($id, array $data)
    {
        return $this->albumRepository->update($id, $data);
    }

    public function deleteAlbum($id)
    {
        // return $this->albumRepository->delete($id);
          $album = $this->albumRepository->findById($id); // Eager load media sudah di repositori

        if (!$album) {
            return false; // Album tidak ditemukan
        }
          // Hapus semua media yang terkait dengan album ini
        // $album->media adalah koleksi media yang sudah di-eager load oleh findById
        foreach ($album->media as $mediaItem) {
            $this->mediaService->deleteMedia($mediaItem->id); // Panggil MediaService untuk hapus setiap media
        }

        // Setelah semua media dihapus, hapus album itu sendiri
        return $this->albumRepository->delete($id);
    }

    public function getMediaByAlbum($albumId)
    {
        return $this->albumRepository->getMediaByAlbum($albumId);
    }
}
