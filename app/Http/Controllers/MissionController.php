<?php

namespace App\Http\Controllers;

use App\Models\Period;
use App\Models\Mission;
use App\Services\PeriodContentService;
use Illuminate\Http\Request;

class MissionController extends Controller
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
     * Menyimpan misi baru untuk periode tertentu.
     */
    public function store(Request $request, Period $period)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:255'
        ]);

        // Panggil service dengan 'type' = 'mission'
        $this->periodContentService->createContentForPeriod($period, 'mission', $validated);

        return redirect()->back()->with('success', 'Misi berhasil ditambahkan!');
    }

    /**
     * Mengubah misi yang sudah ada.
     */
    public function update(Request $request, Mission $mission)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:255'
        ]);

        $this->periodContentService->updateContent($mission, $validated);

        return redirect()->back()->with('success', 'Misi berhasil diperbarui!');
    }

    /**
     * Menghapus misi yang sudah ada.
     */
    public function destroy(Mission $mission)
    {
        $this->periodContentService->deleteContent($mission);

        return redirect()->back()->with('success', 'Misi berhasil dihapus!');
    }
}
