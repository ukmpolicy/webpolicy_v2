<?php

namespace App\Repositories;

use App\Models\BlogArticle;
use Illuminate\Support\Facades\DB;

class BlogArticleRepository
{
    protected $model;

    public function __construct(BlogArticle $model)
    {
        $this->model = $model;
    }

    public function getAllPaginated($perPage = 10, $search = null, $categoryId = null)
    {
        $query = $this->model->with(['author', 'categories']);

        if ($search) {
            $query->where('title', 'like', '%' . $search . '%')
                  ->orWhere('summary', 'like', '%' . $search . '%');
        }

        if ($categoryId) {
            $query->whereHas('categories', function ($q) use ($categoryId) {
                $q->where('blog_categories.id', $categoryId);
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function findById($id)
    {
        return $this->model->with(['author', 'categories'])->findOrFail($id);
    }

    public function create(array $data, array $categoryIds = [])
    {
        return DB::transaction(function () use ($data, $categoryIds) {
            $article = $this->model->create($data);
            if (!empty($categoryIds)) {
                $article->categories()->attach($categoryIds);
            }
            return $article;
        });
    }

    public function update($id, array $data, array $categoryIds = [])
    {
        return DB::transaction(function () use ($id, $data, $categoryIds) {
            $article = $this->model->findOrFail($id);
            $article->update($data);
            if (!empty($categoryIds)) {
                $article->categories()->sync($categoryIds); // Sync akan menambah/menghapus relasi
            } else {
                $article->categories()->detach(); // Hapus semua jika tidak ada kategori
            }
            return $article;
        });
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $article = $this->model->findOrFail($id);
            $article->delete(); // Ini akan menghapus relasi di tabel pivot berkat onDelete('cascade')
            return true;
        });
    }
}
