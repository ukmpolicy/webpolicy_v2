<?php

namespace App\Http\Controllers;

use App\Services\BlogArticleService;
use App\Services\BlogCategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogPageController extends Controller
{
    protected $articleService;
    protected $categoryService;

    public function __construct(BlogArticleService $articleService, BlogCategoryService $categoryService)
    {
        $this->articleService = $articleService;
        $this->categoryService = $categoryService;
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 6);
        $search = $request->input('search');
        $categoryId = $request->input('category_id');

        // Panggil artikel yang published saja
        $articles = $this->articleService->getPublishedArticlesForHomepage($perPage, $search, $categoryId);
        $categories = $this->categoryService->getAllCategories(); // Ambil semua kategori

        return Inertia::render('homepage/blog/index', [
            'articles' => $articles,
            'categories' => $categories->map(fn($cat) => ['id' => $cat->id, 'name' => $cat->name]), // Kirim kategori juga
            'search' => $search,
            'per_page' => (int) $perPage,
            'selected_category_id' => $categoryId ? (int) $categoryId : null,
        ]);
    }

    public function show($slug)
    {
        $article = $this->articleService->viewArticleBySlug($slug);

        if (!$article || $article->status !== 'published') {
            abort(404);
        }

        // Mengambil artikel populer
        $popularArticles = $this->articleService->getPopularArticles(4);

        // Mengambil artikel terkait berdasarkan kategori yang sama
        $categoryIds = $article->categories->pluck('id')->toArray();
        $relatedArticles = $this->articleService->getRelatedArticlesByCategory($categoryIds, 4, $article->id);

        return Inertia::render('homepage/blog/show', [
            'article' => $article,
            'popularArticles' => $popularArticles,
            'relatedArticles' => $relatedArticles,
        ]);
    }
}
