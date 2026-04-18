<?php

namespace App\Http\Controllers;

use App\Models\Period;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Ambil periode aktif. Jika tidak ada, ambil periode terbaru.
     */
    private function getActivePeriod()
    {
        return Period::where('is_active', true)->latest()->first()
            ?? Period::latest()->first();
    }

    public function openRecruitmentTimeline()
    {
        $period = $this->getActivePeriod();

        return Inertia::render('pendaftaran/timeline', [
            'period'       => $period,
            'teaser_time'  => $period?->recruitment_teaser_at?->format('Y-m-d\TH:i'),
            'start_time'   => $period?->recruitment_started_at?->format('Y-m-d\TH:i'),
            'end_time'     => $period?->recruitment_ended_at?->format('Y-m-d\TH:i'),
            'description'  => $period?->recruitment_description,
            'quota'        => $period?->recruitment_quota,
            'is_open'      => $period?->is_open_recruitment ?? false,
        ]);
    }

    public function updateOpenRecruitmentTimeline(Request $request)
    {
        $request->validate([
            'teaser_time' => 'required|date',
            'start_time'  => 'required|date|after:teaser_time',
            'end_time'    => 'required|date|after:start_time',
            'description' => 'nullable|string|max:1000',
            'quota'       => 'nullable|integer|min:1',
        ]);

        $period = $this->getActivePeriod();

        if (!$period) {
            return back()->withErrors(['period' => 'Tidak ada periode aktif. Buat periode terlebih dahulu.']);
        }

        $period->update([
            'is_open_recruitment'    => true,
            'recruitment_teaser_at'  => $request->teaser_time,
            'recruitment_started_at' => $request->start_time,
            'recruitment_ended_at'   => $request->end_time,
            'recruitment_description'=> $request->description,
            'recruitment_quota'      => $request->quota,
        ]);

        return back()->with('success', 'Waktu pendaftaran berhasil diperbarui.');
    }
}
