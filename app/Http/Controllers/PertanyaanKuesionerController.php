<?php

namespace App\Http\Controllers;

use App\Services\PertanyaanKuesionerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controller manajemen PERTANYAAN KUESIONER di dashboard admin.
 * Admin bisa CRUD pertanyaan yang muncul di form kuesioner pendaftaran.
 */
class PertanyaanKuesionerController extends Controller
{
    public function __construct(protected PertanyaanKuesionerService $pertanyaanService) {}

    public function index()
    {
        return Inertia::render('pendaftaran/kuesioner/index', [
            'pertanyaan' => $this->pertanyaanService->getAllPertanyaan(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pertanyaan' => 'required|string',
            'is_active'  => 'boolean',
            'urutan'     => 'nullable|integer|min:0',
        ]);

        try {
            $this->pertanyaanService->createPertanyaan($validated);
            return redirect()->back()->with('success', 'Pertanyaan berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'pertanyaan' => 'required|string',
            'is_active'  => 'boolean',
            'urutan'     => 'nullable|integer|min:0',
        ]);

        try {
            $this->pertanyaanService->updatePertanyaan($id, $validated);
            return redirect()->back()->with('success', 'Pertanyaan berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function destroy($id)
    {
        try {
            $this->pertanyaanService->deletePertanyaan($id);
            return redirect()->back()->with('success', 'Pertanyaan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
