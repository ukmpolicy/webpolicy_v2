<?php

namespace App\Http\Controllers;

use App\Models\Period;
use App\Models\Vission;
use App\Services\PeriodContentService;
use Illuminate\Http\Request;

class VissionController extends Controller
{
    protected $periodContentService;

    /**
     * Inject service yang relevan.
     */
    public function __construct(PeriodContentService $periodContentService)
    {
        $this->periodContentService = $periodContentService;
    }

    /**
     * Menyimpan visi baru untuk periode tertentu.
     * Laravel akan otomatis mencari Period berdasarkan {period} di URL.
     */
    public function store(Request $request, Period $period)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:255'
        ]);

        // Panggil service dengan 'type' = 'vission'
        $this->periodContentService->createContentForPeriod($period, 'vission', $validated);

        return redirect()->back()->with('success', 'Visi berhasil ditambahkan!');
    }

    /**
     * Mengubah visi yang sudah ada.
     * Laravel akan otomatis mencari Vission berdasarkan {vission} di URL.
     */
    public function update(Request $request, Vission $vission)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:255'
        ]);

        $this->periodContentService->updateContent($vission, $validated);

        return redirect()->back()->with('success', 'Visi berhasil diperbarui!');
    }

    /**
     * Menghapus visi yang sudah ada.
     */
    public function destroy(Vission $vission)
    {
        $this->periodContentService->deleteContent($vission);

        return redirect()->back()->with('success', 'Visi berhasil dihapus!');
    }
}
