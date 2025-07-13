<?php

namespace App\Http\Controllers;

use App\Services\BlogArticleService;
use App\Services\BlogCategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ArticleController extends Controller
{
    protected $articleService;
    protected $categoryService;

    public function __construct(BlogArticleService $articleService, BlogCategoryService $categoryService)
    {
        $this->articleService = $articleService;
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');
        $categoryId = $request->input('category_id');

        $articles = $this->articleService->getAllArticlesPaginated($perPage, $search, $categoryId);
        $categories = $this->categoryService->getAllCategories();

        return Inertia::render('blog/article/index', [
            'articles' => $articles,
            'categories' => $categories->map(fn($cat) => ['id' => $cat->id, 'name' => $cat->name]),
            'search' => $search,
            'per_page' => (int) $perPage,
            'selected_category_id' => $categoryId ? (int) $categoryId : null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = $this->categoryService->getAllCategories();

        return Inertia::render('blog/article/create', [
            'categories' => $categories->map(fn($cat) => ['id' => $cat->id, 'name' => $cat->name]),
        ]);
    }

    public function store(Request $request)
    {
        $messages = [
            'picture.dimensions' => 'Dimensi gambar tidak masuk akal. Lebar atau tinggi gambar terlalu besar.',
        ];

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'picture' => 'required|image|max:2048|dimensions:max_width=4000,max_height=4000',
            'summary' => 'required|string|max:1000',
            'content' => 'required|string',
            'status' => 'required|string|in:draft,published',
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:blog_categories,id',
        ], $messages);

        $picturePath = null;
        if ($request->hasFile('picture')) {
            $picturePath = $request->file('picture')->store('blog_pictures', 'public');
        }

        $articleData = [
            'title' => $validated['title'],
            'picture' => $picturePath,
            'summary' => $validated['summary'],
            'content' => $validated['content'] ?? '',
            'author_id' => Auth::id(),
            'status' => $validated['status'],
        ];

        try {
            $article = $this->articleService->createArticle($articleData, $validated['category_ids'] ?? []);
            return redirect()
                ->route('articles.index', $article->id)
                ->with([
                    'success' => 'Artikel berhasil ditambahkan.',
                    'article_id' => $article->id,
                ]);
        } catch (\Exception $e) {
            if ($picturePath) {
                Storage::disk('public')->delete($picturePath);
            }
            Log::error('Error creating article: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menambahkan artikel. Silakan coba lagi.');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $article = $this->articleService->getArticleById($id);
        $categories = $this->categoryService->getAllCategories();

        return Inertia::render('blog/article/edit', [
            'article' => $article,
            'categories' => $categories->map(fn($cat) => ['id' => $cat->id, 'name' => $cat->name]),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $article = $this->articleService->getArticleById($id);

        return Inertia::render('blog/article/show', [
            'article' => $article,
        ]);
    }

    public function update(Request $request, $id)
    {
        $article = $this->articleService->getArticleById($id);

        $messages = [
            'picture.dimensions' => 'Dimensi gambar tidak masuk akal. Lebar atau tinggi gambar terlalu besar.',
            'picture.required_if' => 'Anda harus mengunggah gambar baru jika menghapus gambar yang sudah ada.', // **PESAN BARU**
        ];

        // --- BAGIAN YANG DIPERBAIKI/DITAMBAHKAN ---
        $pictureRules = 'nullable|image|max:2048|dimensions:max_width=4000,max_height=4000';

        // Jika ada remove_picture flag DAN tidak ada gambar yang diupload
        if ($request->boolean('remove_picture') && !$request->hasFile('picture')) {
             $pictureRules = 'required|image|max:2048|dimensions:max_width=4000,max_height=4000';
             // Atau bisa juga: $pictureRules = ['required', 'image', 'max:2048', 'dimensions:max_width=4000,max_height=4000'];
             // Jika pakai 'required_if' lebih simpel di rule, tapi perlu pastikan boolean 'remove_picture' terkirim
             // Alternatif: 'picture' => 'required_if:remove_picture,1|nullable|image|max:2048|dimensions:max_width=4000,max_height=4000',
             // Tapi 'required_if' ini bisa sedikit membingungkan jika gambar lama sudah ada.
             // Pendekatan if-else ini lebih eksplisit untuk kondisi Anda.
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'picture' => $pictureRules, // Gunakan rule yang sudah ditentukan kondisional
            'summary' => 'required|string|max:1000',
            'content' => 'required|string',
            'status' => 'required|string|in:draft,published',
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:blog_categories,id',
            'remove_picture' => 'boolean',
        ], $messages);
        // --- AKHIR BAGIAN YANG DIPERBAIKI/DITAMBAHKAN ---

        $articleData = [
            'title' => $validated['title'],
            'summary' => $validated['summary'],
            'content' => $validated['content'] ?? '',
            'status' => $validated['status'],
        ];

        // Handle picture update
        // Logika ini tetap sama, hanya validasinya yang berubah di atas
        if ($request->boolean('remove_picture') && $article->picture) {
            Storage::disk('public')->delete($article->picture);
            $articleData['picture'] = null;
        } elseif ($request->hasFile('picture')) {
            if ($article->picture) {
                Storage::disk('public')->delete($article->picture);
            }
            $articleData['picture'] = $request->file('picture')->store('blog_pictures', 'public');
        }

        try {
            $this->articleService->updateArticle($id, $articleData, $validated['category_ids'] ?? []);
            return redirect()
                ->route('articles.index', $id)
                ->with([
                    'success' => 'Artikel berhasil diperbarui.',
                    'article_id' => $id,
                ]);
        } catch (\Exception $e) {
            Log::error('Error updating article ' . $id . ': ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memperbarui artikel. Silakan coba lagi.');
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $this->articleService->deleteArticle($id);
            return redirect()->back()->with('success', 'Artikel berhasil dihapus.');
        } catch (\Exception $e) {
            Log::error('Error deleting article ' . $id . ': ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menghapus artikel. Silakan coba lagi.');
        }
    }
}
