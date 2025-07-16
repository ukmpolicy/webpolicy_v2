<?php

namespace App\Http\Controllers;

use App\Services\AlbumService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AlbumController extends Controller
{
    protected $albumService;

    public function __construct(AlbumService $albumService)
    {
        $this->albumService = $albumService;
    }

    public function index()
    {
        $albums = $this->albumService->getAllAlbums();
        return Inertia::render('gallery/album/index', ['albums' => $albums]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'is_private' => 'boolean',
        ]);

        $album = $this->albumService->createAlbum($validated);
        return redirect()->back()->with('success', 'Album Berhasil ditambahkan');
    }

    public function show($id)
    {
        $album = $this->albumService->getAlbumWithMedia($id);
        return Inertia::render('gallery/album/show', ['album' => $album]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'is_private' => 'boolean',
        ]);

        $album = $this->albumService->updateAlbum($id, $validated);
        return redirect()->back()->with('success', 'Album berhasil diperbarui');
    }

    public function destroy($id)
    {
        // $this->albumService->deleteAlbum($id);
        // return redirect()->back()->with('success', 'Album berhasil dihapus');
          try {
            $this->albumService->deleteAlbum($id);
            return redirect()->back()->with('success', 'Album dan semua medianya berhasil dihapus.');
        } catch (\Exception $e) {
            Log::error('Gagal menghapus album ID ' . $id . ': ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menghapus album. Terjadi kesalahan server.');
        }
    }
}
