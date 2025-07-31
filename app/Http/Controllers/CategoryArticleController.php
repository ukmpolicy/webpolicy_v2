<?php

namespace App\Http\Controllers;

use App\Services\BlogCategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log; // Gunakan Log untuk debugging

class CategoryArticleController extends Controller
{
    protected $categoryService;

    public function __construct(BlogCategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = $this->categoryService->getAllCategories();
        return Inertia::render('blog/category/index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:blog_categories,name',
        ]);

        // Normalisasi data: huruf kecil dan spasi tunggal
        $validated['name'] = $this->normalizeText($validated['name']);

        try {
            $this->categoryService->createCategory($validated);
            return redirect()->back()->with('success', 'Kategori Artikel berhasil ditambahkan.');
        } catch (\Exception $e) {
            // Log::error('Error creating category: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menambahkan kategori. Silakan coba lagi.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:blog_categories,name,' . $id,
        ]);

        // Normalisasi data: huruf kecil dan spasi tunggal
        $validated['name'] = $this->normalizeText($validated['name']);

        try {
            $this->categoryService->updateCategory($id, $validated);
            return redirect()->back()->with('success', 'Kategori Artikel berhasil diperbarui.');
        } catch (\Exception $e) {
            // Log::error('Error updating category ' . $id . ': ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memperbarui kategori. Silakan coba lagi.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $this->categoryService->deleteCategory($id);
            return redirect()->back()->with('success', 'Kategori Artikel berhasil dihapus.');
        } catch (\Exception $e) {
            // Log::error('Error deleting category ' . $id . ': ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menghapus kategori. Pastikan tidak ada artikel yang terhubung.');
        }
    }

    /**
     * Normalize text: lowercase and single spaces
     */
    private function normalizeText($text)
    {
        return trim(preg_replace('/\s+/', ' ', strtolower($text)));
    }
}
