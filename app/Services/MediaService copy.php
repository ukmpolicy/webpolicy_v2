<?php

namespace App\Services;

use App\Repositories\MediaRepository;
use App\Repositories\AlbumRepository;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class MediaService
{
    protected $mediaRepository;
    protected $albumRepository;

    public function __construct(MediaRepository $mediaRepository, AlbumRepository $albumRepository)
    {
        $this->mediaRepository = $mediaRepository;
        $this->albumRepository = $albumRepository;
    }

    public function getAllMedia()
    {
        return $this->mediaRepository->getAll();
    }

    public function getMediaById($id)
    {
        return $this->mediaRepository->findById($id);
    }

    public function getMediaByAlbum($albumId)
    {
        return $this->mediaRepository->getByAlbum($albumId);
    }

    public function createMedia(array $data, $file)
    {
        //     // $filePath = $file->store('media', 'public');
        //      if ($file->getClientOriginalExtension() === 'png') {
        //     $image = Image::make($file)->encode('png');
        //     $canvas = Image::canvas($image->width(), $image->height(), '#ffffff');
        //     $canvas->insert($image);
        //     $filePath = 'media/' . uniqid() . '.png';
        //     Storage::disk('public')->put($filePath, $canvas->encode());
        // } else {
        // }
        $filePath = $file->store('media', 'public');

        $mediaData = [
            'file' => $filePath,
            'caption' => $data['caption'] ?? null,
            'mimetype' => $file->getMimeType(),
            'author_id' => auth()->id(),
            'album_id' => $data['album_id'],
        ];

        // Log::info('Creating Media:', $mediaData);

        return $this->mediaRepository->create($mediaData);
    }

    public function updateMedia($id, array $data, $file = null)
    {
        $media = $this->mediaRepository->findById($id);

        $updateData = [
            'caption' => $data['caption'],
            'album_id' => $data['album_id'],
        ];

        if ($file) {
            // Hapus file lama jika ada
            if ($media->file) {
                Storage::disk('public')->delete($media->file);
            }
            $updateData['file'] = $file->store('media', 'public');
            $updateData['mimetype'] = $file->getMimeType();
        }

        return $this->mediaRepository->update($id, $updateData);
    }

    public function deleteMedia($id)
    {
        $media = $this->mediaRepository->findById($id);
        Storage::disk('public')->delete($media->file);
        return $this->mediaRepository->delete($id);
    }

    public function moveMediaToAlbum($mediaId, $albumId)
    {
        return $this->mediaRepository->moveToAlbum($mediaId, $albumId);
    }

    public function getAllMediaQuery($mediaType = null)
    {
        $query = $this->mediaRepository->getAllQuery();
        return $this->mediaRepository->filterByType($query, $mediaType);
    }

    public function getMediaByAlbumQuery($albumId, $mediaType = null)
    {
        $query = $this->mediaRepository->getByAlbumQuery($albumId);
        return $this->mediaRepository->filterByType($query, $mediaType);
    }
}
