<?php

namespace App\Repositories;

use App\Models\BlogCategory;
use Illuminate\Support\Facades\DB;

class BlogCategoryRepository
{
    protected $model;

    public function __construct(BlogCategory $model)
    {
        $this->model = $model;
    }

    public function getAll()
    {
        return $this->model->withCount('articles')->orderBy('created_at', 'asc')->get();
        // return $this->model->orderBy('created_at', 'asc')->get();
    }

    public function findById($id)
    {
        return $this->model->findOrFail($id);
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
            $category = $this->model->findOrFail($id);
            $category->update($data);
            return $category;
        });
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $category = $this->model->findOrFail($id);

            // Ambil semua artikel yang terkait kategori ini
            $articles = $category->articles;

            // Hapus semua artikel terkait
            foreach ($articles as $article) {
                $article->delete();
            }

            // Hapus kategori
            $category->delete();
            return true;
        });
    }
}
