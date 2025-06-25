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
        return $this->model->withCount('media')->latest()->get();
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
}
