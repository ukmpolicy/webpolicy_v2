<?php

namespace App\Http\Controllers;

use App\Services\AlbumService;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        return redirect()->back()->with('success', 'Album created successfully');
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
        return redirect()->back()->with('success', 'Album updated successfully');
    }

    public function destroy($id)
    {
        $this->albumService->deleteAlbum($id);
        return redirect()->back()->with('success', 'Album deleted successfully');
    }
}
