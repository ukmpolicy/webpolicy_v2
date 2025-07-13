<?php

namespace App\Repositories;

use App\Models\MediaFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MediaRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new MediaFile();
    }

    public function getAll()
    {
        return $this->model
            ->with(['album', 'author'])
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function findById($id)
    {
        return $this->model->with(['album', 'author'])->findOrFail($id);
    }

    public function getByAlbum($albumId)
    {
        return $this->model
            ->where('album_id', $albumId)
            ->with(['album', 'author'])
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $media = $this->model->create($data);
            return $media;
        });
    }

    public function update($id, array $data, $file = null)
    {
        $media = $this->model->findOrFail($id);
        $media->update($data);
        return $media;
    }
    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $media = $this->model->findOrFail($id);
            // Hapus file dari storage sebelum menghapus record di DB
            if ($media->file && Storage::disk('public')->exists($media->file)) {
                Storage::disk('public')->delete($media->file);
            }
            if ($media->thumbnail_file && $media->thumbnail_file !== $media->file && Storage::disk('public')->exists($media->thumbnail_file)) {
                Storage::disk('public')->delete($media->thumbnail_file);
            }
            $media->delete();
            return true;
        });
    }

    public function moveToAlbum($mediaId, $albumId)
    {
        return DB::transaction(function () use ($mediaId, $albumId) {
            $media = $this->model->findOrFail($mediaId);
            $media->album_id = $albumId;
            $media->save();
            return $media;
        });
    }

    public function filterByType($query, $type = null)
    {
        if ($type === 'image') {
            return $query->where('mimetype', 'like', 'image/%');
        } elseif ($type === 'video') {
            return $query->where('mimetype', 'like', 'video/%');
        }
        return $query; // Mengembalikan query tanpa filter tipe media jika $type bukan 'image' atau 'video'
    }

    public function getAllQuery()
    {
        // Pastikan 'thumbnail_file' dan kolom penting lainnya ada di select
        return $this->model->select('id', 'file', 'thumbnail_file', 'caption', 'mimetype', 'album_id', 'author_id', 'created_at')->with([
            'album' => function ($query) {
                $query->select('id', 'name'); // Hanya ambil id dan name
            },
            'author' => function ($query) {
                $query->select('id', 'name'); // Hanya ambil id dan name
            },
        ]);
    }

    public function getByAlbumQuery($albumId)
    {
        // Pastikan 'thumbnail_file' dan kolom penting lainnya ada di select
        return $this->model
            ->where('album_id', $albumId)
            ->select('id', 'file', 'thumbnail_file', 'caption', 'mimetype', 'album_id', 'author_id', 'created_at')
            ->with([
                'album' => function ($query) {
                    $query->select('id', 'name');
                },
                'author' => function ($query) {
                    $query->select('id', 'name');
                },
            ]);
    }
}
