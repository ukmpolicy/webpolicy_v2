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
use Intervention\Image\Image;

class ArticleController extends Controller
{
    protected $articleService;
    protected $categoryService;

    public function __construct(BlogArticleService $articleService, BlogCategoryService $categoryService)
    {
        $this->articleService = $articleService;
        $this->categoryService = $categoryService;

        // Pastikan direktori publik untuk gambar konten editor ada
        if (!Storage::disk('public')->exists('blog_content_images')) {
            Storage::disk('public')->makeDirectory('blog_content_images');
        }
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $messages = [
            'picture.dimensions' => 'Oops! Gambar terlalu besar. Pastikan lebar dan tinggi tidak melebihi 4000 piksel.',
        ];

        $validated = $request->validate(
            [
                'title' => 'required|string|max:255',
                'picture' => 'required|image|max:2048|dimensions:max_width=4000,max_height=4000', // Validasi gambar sampul
                'summary' => 'required|string|max:1000',
                'content' => 'required|string', // Konten dari editor (Markdown)
                'status' => 'required|string|in:draft,published',
                'category_ids' => 'required|array',
                'category_ids.*' => 'exists:blog_categories,id',
            ],
            $messages,
        );

        $picturePath = null;
        if ($request->hasFile('picture')) {
            $picturePath = $request->file('picture')->store('blog_pictures', 'public');
        }

        $articleData = [
            'title' => $validated['title'],
            'picture' => $picturePath,
            'summary' => $validated['summary'],
            'content' => $validated['content'],
            'author_id' => Auth::id(),
            'status' => $validated['status'],
        ];

        try {
            $article = $this->articleService->createArticle($articleData, $validated['category_ids'] ?? []);
            // Redirect ke halaman index setelah sukses
            return redirect()->route('articles.index')->with('success', 'Artikel berhasil ditambahkan.');
        } catch (\Exception $e) {
            // Hapus gambar jika ada error saat menyimpan artikel
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $article = $this->articleService->getArticleById($id);

        $messages = [
            'picture.dimensions' => 'Dimensi gambar tidak masuk akal. Lebar atau tinggi gambar sampul terlalu besar.',
            'picture.required_if' => 'Anda harus mengunggah gambar sampul baru jika menghapus yang sudah ada.',
        ];

        $pictureRules = 'nullable|image|max:2048|dimensions:max_width=4000,max_height=4000';

        // Logika validasi gambar sampul saat update
        if ($request->boolean('remove_picture')) {
            // Jika flag remove_picture dikirim (true)
            if (!$request->hasFile('picture')) {
                // Dan tidak ada gambar baru yang diupload
                // Maka gambar baru wajib ada
                $pictureRules = 'required|image|max:2048|dimensions:max_width=4000,max_height=4000';
            }
        }

        $validated = $request->validate(
            [
                'title' => 'required|string|max:255',
                'picture' => $pictureRules, // Gunakan rule yang sudah ditentukan kondisional
                'summary' => 'required|string|max:1000',
                'content' => 'required|string', // Konten dari editor (Markdown)
                'status' => 'required|string|in:draft,published',
                'category_ids' => 'required|array',
                'category_ids.*' => 'exists:blog_categories,id',
                'remove_picture' => 'boolean', // Flag ini akan menentukan apakah gambar lama dihapus
            ],
            $messages,
        );

        $articleData = [
            'title' => $validated['title'],
            'summary' => $validated['summary'],
            'content' => $validated['content'],
            'status' => $validated['status'],
        ];

        // Handle picture update logic
        if ($request->boolean('remove_picture') && $article->picture) {
            // Hapus gambar lama jika ada flag remove_picture dan gambar lama memang ada
            Storage::disk('public')->delete($article->picture);
            $articleData['picture'] = null; // Set field picture di DB menjadi null
        } elseif ($request->hasFile('picture')) {
            // Jika ada gambar baru diupload
            if ($article->picture) {
                // Hapus gambar lama jika ada
                Storage::disk('public')->delete($article->picture);
            }
            $articleData['picture'] = $request->file('picture')->store('blog_pictures', 'public');
        }

        try {
            $this->articleService->updateArticle($id, $articleData, $validated['category_ids'] ?? []);
            // Redirect ke halaman index setelah sukses
            return redirect()->route('articles.index')->with('success', 'Artikel berhasil diperbarui.');
        } catch (\Exception $e) {
            // Log::error('Error updating article ' . $id . ': ' . $e->getMessage());
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
            // Log::error('Error deleting article ' . $id . ': ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menghapus artikel. Silakan coba lagi.');
        }
    }

    /**
     * Handle image uploads from the Toast UI Editor.
     * This method will receive the image, save it, and return its URL.
     */
    public function uploadImage(Request $request)
    {
        $messages = [
            'image.max' => 'File gambar terlalu besar, tidak boleh lebih dari 2MB.', // Pesan diperbarui
            'image.image' => 'File yang diunggah harus berupa gambar.',
            'image.mimes' => 'Format gambar harus jpeg, png, jpg, atau gif.',
            // Pesan 'image.dimensions' dihapus karena aturan dimensi dihapus
        ];

        try {
            $request->validate(
                [
                    'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // <-- MAX 2MB (2048KB), BATAS DIMENSI DIHAPUS
                ],
                $messages,
            );

            $image = $request->file('image');
            $imageName = Str::uuid() . '.' . $image->getClientOriginalExtension();

            // Simpan gambar ke disk 'public' di dalam folder 'blog_content_images'
            $path = $image->storeAs('blog_content_images', $imageName, 'public');

            // Dapatkan URL publik untuk gambar tersebut
            $url = Storage::disk('public')->url($path);

            return response()->json(['url' => $url]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Log::error('Image Upload Error: ' . $e->getMessage());
            return response()->json(['error' => 'Server error during image upload.'], 500);
        }
    }
}
