<?php

namespace App\Http\Controllers;

use App\Models\Period;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controller khusus untuk mengatur waktu jadwal Open Recruitment pada periode yang sedang aktif.
 */
class PengaturanWaktuController extends Controller
{
    public function index()
    {
        // Ambil periode yang sedang aktif
        $activePeriod = Period::where('is_active', true)->first();

        return Inertia::render('pendaftaran/pengaturan-waktu', [
            'activePeriod' => $activePeriod,
        ]);
    }

    public function update(Request $request)
    {
        $activePeriod = Period::where('is_active', true)->first();

        if (!$activePeriod) {
            return redirect()->back()->withErrors(['error' => 'Tidak ada periode yang aktif. Silakan aktifkan satu periode terlebih dahulu di menu Kepengurusan > Periode.']);
        }

        $validated = $request->validate([
            'is_open_recruitment'         => 'boolean',
            'recruitment_announcement_at' => 'nullable|date',
            'recruitment_started_at'      => 'nullable|date',
            'recruitment_ended_at'        => 'nullable|date',
            'recruitment_description'     => 'nullable|string',
        ]);

        try {
            $activePeriod->update($validated);
            return redirect()->back()->with('success', 'Pengaturan jadwal pendaftaran berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
