<?php

namespace App\Http\Controllers;

use App\Services\MediaService;
use App\Services\AlbumService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MediaController extends Controller
{
    protected $mediaService;
    protected $albumService;

    public function __construct(MediaService $mediaService, AlbumService $albumService)
    {
        $this->mediaService = $mediaService;
        $this->albumService = $albumService;
    }

    public function index(Request $request)
    {
        $albumId = $request->query('album_id');
        $search = $request->query('search');
        $perPage = $request->query('per_page', 5);
        $mediaType = $request->query('media_type');

        $query = $albumId
            ? $this->mediaService->getMediaByAlbumQuery($albumId, $mediaType)
            : $this->mediaService->getAllMediaQuery($mediaType);

        if ($search) {
            $query->where('caption', 'like', '%' . $search . '%');
        }

        $media = $query->latest()->paginate($perPage)->withQueryString();

        $albums = $this->albumService->getAllAlbums();
        return Inertia::render('gallery/media/index', [
            'media' => $media,
            'albums' => $albums,
            'selected_album_id' => $albumId, // Penting: Kirim kembali ID album yang dipilih
            'search' => $search,
            'per_page' => $perPage,
            'media_type' => $mediaType, // Penting: Kirim kembali tipe media yang dipilih
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'album_id' => 'required|exists:albums,id',
                'caption' => 'required|string',
                'file' => 'required|file|mimes:jpg,jpeg,png,mp4,mkv,avi|max:10240',
            ],
            [
                'file.mimes' => 'Format file tidak didukung. Harap unggah gambar (JPG, JPEG, PNG) atau video (MP4, MKV, AVI).',
                'file.max' => 'Ukuran file melebihi batas 10 MB. Mohon unggah file yang lebih kecil.',
            ],
        );

        $validated['caption'] = strtolower(trim($validated['caption']));

        $this->mediaService->createMedia($validated, $request->file('file'));

        return redirect()->back()->with('success', 'Media Berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate(
            [
                'album_id' => 'required|exists:albums,id',
                'caption' => 'required|string',
                'file' => 'nullable|file|mimes:jpg,jpeg,png,mp4,mkv,avi|max:10240',
            ],
            [
                'file.mimes' => 'Format file tidak didukung. Harap unggah gambar (JPG, JPEG, PNG) atau video (MP4, MKV, AVI).',
                'file.max' => 'Ukuran file melebihi batas 10 MB. Mohon unggah file yang lebih kecil.',
            ],
        );

        $validated['caption'] = strtolower(trim($validated['caption']));
        $file = $request->hasFile('file') ? $request->file('file') : null;

        $this->mediaService->updateMedia($id, $validated, $file);

        return redirect()->back()->with('success', 'Media berhasil diperbarui');
    }

    public function destroy($id)
    {
        $this->mediaService->deleteMedia($id);
        return redirect()->back()->with('success', 'Media berhasil dihapus');
    }

    public function move(Request $request, $id)
    {
        $validated = $request->validate([
            'album_id' => 'required|exists:albums,id',
        ]);

        $this->mediaService->moveMediaToAlbum($id, $validated['album_id']);
        return redirect()->back()->with('success', 'Media berhasil dipindahkan');
    }
}
