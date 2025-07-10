<?php

namespace App\Services;

use App\Repositories\BlogArticleRepository;
use App\Repositories\BlogCategoryRepository;
use Illuminate\Http\Request; // <-- PASTIKAN INI ADA

class BlogArticleService
{
    protected $articleRepository;
    protected $categoryRepository;

    public function __construct(BlogArticleRepository $articleRepository, BlogCategoryRepository $categoryRepository)
    {
        $this->articleRepository = $articleRepository;
        $this->categoryRepository = $categoryRepository;
    }

    public function getAllArticlesPaginated($perPage, $search, $categoryId)
    {
        return $this->articleRepository->getAllPaginated($perPage, $search, $categoryId);
    }

    public function getArticleById($id)
    {
        $article = $this->articleRepository->findById($id);
        return $article;
    }

    public function createArticle(array $data, array $categoryIds = [])
    {
        return $this->articleRepository->create($data, $categoryIds);
    }

    public function updateArticle($id, array $data, array $categoryIds = [])
    {
        return $this->articleRepository->update($id, $data, $categoryIds);
    }

    public function deleteArticle($id)
    {
        return $this->articleRepository->delete($id);
    }
}
