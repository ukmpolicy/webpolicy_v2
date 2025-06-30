<?php

namespace App\Services;

use App\Repositories\MediaRepository;
use App\Repositories\AlbumRepository;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager; // Import untuk Intervention Image v3
use Intervention\Image\Drivers\Gd\Driver; // Driver GD untuk v3 (sesuaikan jika pakai Imagick)
use Illuminate\Support\Str;

class MediaService
{
    protected $mediaRepository;
    protected $albumRepository;
    protected $imageManager; // Properti baru untuk ImageManager

    public function __construct(MediaRepository $mediaRepository, AlbumRepository $albumRepository)
    {
        $this->mediaRepository = $mediaRepository;
        $this->albumRepository = $albumRepository;
        // Inisialisasi ImageManager dengan driver yang Anda gunakan (GD atau Imagick)
        $this->imageManager = new ImageManager(new Driver()); // Menggunakan GD sebagai driver
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
        $originalFileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $originalFilePath = 'media/originals/' . $originalFileName; // Simpan file asli di folder 'originals'

        // Simpan file asli
        Storage::disk('public')->put($originalFilePath, file_get_contents($file));

        $mimetype = $file->getMimeType();
        $thumbnailPath = null;

        // Buat thumbnail jika itu gambar
        if (str_starts_with($mimetype, 'image/')) {
            $thumbnailFileName = 'thumb_' . Str::uuid() . '.webp'; // Gunakan format webp untuk optimasi ukuran
            $thumbnailRelativePath = 'media/thumbnails/' . $thumbnailFileName;
            $thumbnailFullPath = Storage::disk('public')->path($thumbnailRelativePath);

            // Pastikan direktori thumbnail ada
            Storage::disk('public')->makeDirectory('media/thumbnails');

            // Resize dan kompres gambar untuk thumbnail (Intervention Image v3 syntax)
            $this->imageManager->read(Storage::disk('public')->path($originalFilePath))
                ->cover(300, 200) // fit() diganti dengan cover() atau resize()
                ->toWebp(80) // encode() diganti dengan toWebp() atau toJpeg()
                ->save($thumbnailFullPath);

            $thumbnailPath = $thumbnailRelativePath;
        }

        $mediaData = [
            'file' => $originalFilePath,
            'thumbnail_file' => $thumbnailPath, // Simpan path thumbnail
            'caption' => $data['caption'] ?? null,
            'mimetype' => $mimetype,
            'author_id' => auth()->id(),
            'album_id' => $data['album_id'],
        ];

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
            // Hapus file lama (original dan thumbnail) jika ada
            if ($media->file) {
                Storage::disk('public')->delete($media->file);
            }
            if ($media->thumbnail_file && $media->thumbnail_file !== $media->file) {
                Storage::disk('public')->delete($media->thumbnail_file);
            }

            $originalFileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $originalFilePath = 'media/originals/' . $originalFileName;
            Storage::disk('public')->put($originalFilePath, file_get_contents($file));

            $mimetype = $file->getMimeType();
            $thumbnailPath = null;

            if (str_starts_with($mimetype, 'image/')) {
                $thumbnailFileName = 'thumb_' . Str::uuid() . '.webp';
                $thumbnailRelativePath = 'media/thumbnails/' . $thumbnailFileName;
                $thumbnailFullPath = Storage::disk('public')->path($thumbnailRelativePath);
                Storage::disk('public')->makeDirectory('media/thumbnails');

                // Resize dan kompres gambar untuk thumbnail (Intervention Image v3 syntax)
                $this->imageManager->read(Storage::disk('public')->path($originalFilePath))
                    ->cover(300, 200)
                    ->toWebp(80)
                    ->save($thumbnailFullPath);

                $thumbnailPath = $thumbnailRelativePath;
            }

            $updateData['file'] = $originalFilePath;
            $updateData['thumbnail_file'] = $thumbnailPath;
            $updateData['mimetype'] = $mimetype;
        }

        return $this->mediaRepository->update($id, $updateData);
    }

    public function deleteMedia($id)
    {
        $media = $this->mediaRepository->findById($id);
        if ($media->file) {
            Storage::disk('public')->delete($media->file); // Hapus original
        }
        if ($media->thumbnail_file && $media->thumbnail_file !== $media->file) { // Hapus thumbnail jika berbeda
            Storage::disk('public')->delete($media->thumbnail_file);
        }
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
