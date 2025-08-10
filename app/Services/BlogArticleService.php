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

    public function getPublishedArticlesForHomepage($perPage = 6, $search = null, $categoryId = null)
    {
        return $this->articleRepository->getPublishedArticlesPaginated($perPage, $search, $categoryId);
    }

    public function getLatestRecommendedArticles($limit = 5, $excludeArticleId = null)
    {
        return $this->articleRepository->getLatestPublishedArticles($limit, $excludeArticleId);
    }

    public function getArticleBySlug($slug)
    {
        return $this->articleRepository->findBySlug($slug);
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

    public function getTotalArticlesCount()
    {
        return $this->articleRepository->countPublished();
    }

    public function getAllArticlesCount()
    {
        return $this->articleRepository->countAll();
    }

    public function getPublishedArticlesCount()
    {
        return $this->articleRepository->countPublished();
    }

    public function getDraftArticlesCount()
    {
        return $this->articleRepository->countDraft();
    }

    /**
     * Menambah hitungan view count dan mengambil artikel.
     */
    public function viewArticle($id)
    {
        $article = $this->articleRepository->findById($id);
        if ($article) {
            $this->articleRepository->incrementViews($id);
        }
        return $article;
    }

    /**
     * Mengambil artikel berdasarkan slug dan menambah hitungan views.
     */
    public function viewArticleBySlug($slug)
    {
        $article = $this->articleRepository->findBySlug($slug);
        if ($article) {
            $this->articleRepository->incrementViews($article->id);
        }
        return $article;
    }

    public function getPopularArticles($limit = 5)
    {
        return $this->articleRepository->getPopularArticles($limit);
    }

    public function getRelatedArticlesByCategory($categoryIds, $limit = 4, $excludeArticleId = null)
    {
        return $this->articleRepository->getRelatedArticlesByCategory($categoryIds, $limit, $excludeArticleId);
    }
}
