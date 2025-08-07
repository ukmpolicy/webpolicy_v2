<?php

namespace App\Repositories;

use App\Models\Album;
use Illuminate\Support\Facades\DB;

class AlbumRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new Album();
    }

    public function getAll()
    {
        return $this->model->withCount('media')->orderBy('created_at', 'asc')->get();
    }

    /**
     * PERUBAHAN: Tambahkan metode baru untuk mengambil album publik.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getPublicAlbums()
    {
        return $this->model
            ->where('is_private', false) // Filter hanya album yang tidak privat
            ->withCount('media') // Tetap hitung jumlah media
            ->with('media') // Eager load media untuk mengambil gambar sampul
            ->latest() // Urutkan dari yang terbaru
            ->get();
    }

    public function findById($id)
    {
        return $this->model->with('media')->findOrFail($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            return $this->model->create($data);
        });
    }

    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $album = $this->model->findOrFail($id);
            $album->update($data);
            return $album;
        });
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $album = $this->model->findOrFail($id);
            $album->delete();
            return true;
        });
    }

    public function getMediaByAlbum($albumId)
    {
        return $this->model->findOrFail($albumId)->media()->latest()->get();
    }

    /**
     * Menghitung total semua album.
     */
    public function countAll()
    {
        return Album::count();
    }

    /**
     * Menghitung jumlah album yang bersifat publik (is_private = false).
     */
    public function countPublic()
    {
        return Album::where('is_private', false)->count();
    }

    /**
     * Menghitung jumlah album yang bersifat privat (is_private = true).
     */
    public function countPrivate()
    {
        return Album::where('is_private', true)->count();
    }
}
