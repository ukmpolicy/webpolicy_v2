<?php

namespace App\Http\Controllers;

use App\Services\JenisBerkasService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controller manajemen JENIS BERKAS di dashboard admin.
 * Admin bisa CRUD jenis berkas yang ditampilkan di form upload pendaftaran.
 */
class JenisBerkasController extends Controller
{
    public function __construct(protected JenisBerkasService $jenisBerkasService) {}

    public function index()
    {
        return Inertia::render('pendaftaran/jenis-berkas/index', [
            'jenisBerkas' => $this->jenisBerkasService->getAllJenisBerkas(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama'        => 'required|string|max:100|unique:jenis_berkas,nama',
            'label'       => 'required|string|max:150',
            'keterangan'  => 'nullable|string',
            'is_required' => 'boolean',
            'is_active'   => 'boolean',
            'urutan'      => 'nullable|integer|min:0',
        ]);

        try {
            $this->jenisBerkasService->createJenisBerkas($validated);
            return redirect()->back()->with('success', 'Jenis berkas berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama'        => 'required|string|max:100|unique:jenis_berkas,nama,' . $id,
            'label'       => 'required|string|max:150',
            'keterangan'  => 'nullable|string',
            'is_required' => 'boolean',
            'is_active'   => 'boolean',
            'urutan'      => 'nullable|integer|min:0',
        ]);

        try {
            $this->jenisBerkasService->updateJenisBerkas($id, $validated);
            return redirect()->back()->with('success', 'Jenis berkas berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function destroy($id)
    {
        try {
            $this->jenisBerkasService->deleteJenisBerkas($id);
            return redirect()->back()->with('success', 'Jenis berkas berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
