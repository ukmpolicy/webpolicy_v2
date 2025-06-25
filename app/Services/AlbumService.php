<?php

namespace App\Services;

use App\Repositories\AlbumRepository;
use App\Repositories\MediaRepository;

class AlbumService
{
    protected $albumRepository;
    protected $mediaRepository;

    public function __construct(
        AlbumRepository $albumRepository,
        MediaRepository $mediaRepository
    ) {
        $this->albumRepository = $albumRepository;
        $this->mediaRepository = $mediaRepository;
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
        return $this->albumRepository->delete($id);
    }

    public function getMediaByAlbum($albumId)
    {
        return $this->albumRepository->getMediaByAlbum($albumId);
    }
}
