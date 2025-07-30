<?php

namespace App\Http\Controllers;

use App\Services\MediaService;
use App\Services\AlbumService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Validation\Rule; // Tambahkan ini jika belum ada

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
            'selected_album_id' => $albumId,
            'search' => $search,
            'per_page' => $perPage,
            'media_type' => $mediaType,
        ]);
    }

    public function store(Request $request)
    {
         $validated = $request->validate(
            [
                'album_id' => 'required|exists:albums,id',
                'caption' => 'required|string',
                'file' => [
                    'required',
                    'file',
                    'mimes:jpg,jpeg,png,mp4,mkv,avi', // Aturan MIME umum
                    // Custom validation closure untuk ukuran file
                    function ($attribute, $value, $fail) {
                        $mimetype = $value->getMimeType();
                        $fileSize = $value->getSize(); // Ukuran file dalam bytes

                        $maxImageSize = 2 * 1024 * 1024; // 2 MB dalam bytes
                        $maxVideoSize = 7 * 1024 * 1024; // 7 MB dalam bytes

                        if (str_starts_with($mimetype, 'image/')) {
                            if ($fileSize > $maxImageSize) {
                                $fail("Ukuran file gambar melebihi batas 2 MB. Mohon unggah file yang lebih kecil.");
                            }
                        } elseif (str_starts_with($mimetype, 'video/')) {
                            if ($fileSize > $maxVideoSize) {
                                $fail("Ukuran file video melebihi batas 7 MB. Mohon unggah file yang lebih kecil.");
                            }
                        }
                    },
                ],
            ],
            [
                'file.mimes' => 'Format file tidak didukung. Harap unggah gambar (JPG, JPEG, PNG) atau video (MP4, MKV, AVI).',
            ],
        );

        $validated['caption'] = strtolower(trim($validated['caption']));

        $this->mediaService->createMedia($validated, $request->file('file'));

        return redirect()->back()->with('success', 'Media Berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
         $rules = [
            'album_id' => 'required|exists:albums,id',
            'caption' => 'required|string',
        ];

        $messages = [
            'file.mimes' => 'Format file tidak didukung. Harap unggah gambar (JPG, JPEG, PNG) atau video (MP4, MKV, AVI).',
        ];

        if ($request->hasFile('file')) {
            $rules['file'] = [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,mp4,mkv,avi',
                function ($attribute, $value, $fail) {
                    $mimetype = $value->getMimeType();
                    $fileSize = $value->getSize(); // Ukuran file dalam bytes

                    $maxImageSize = 2 * 1024 * 1024; // 2 MB dalam bytes
                    $maxVideoSize = 7 * 1024 * 1024; // 7 MB dalam bytes

                    if (str_starts_with($mimetype, 'image/')) {
                        if ($fileSize > $maxImageSize) {
                            $fail("Ukuran file gambar melebihi batas 2 MB. Mohon unggah file yang lebih kecil.");
                        }
                    } elseif (str_starts_with($mimetype, 'video/')) {
                        if ($fileSize > $maxVideoSize) {
                            $fail("Ukuran file video melebihi batas 7 MB. Mohon unggah file yang lebih kecil.");
                        }
                    }
                },
            ];
        } else {
            $rules['file'] = 'nullable';
        }

        $validated = $request->validate($rules, $messages);

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
