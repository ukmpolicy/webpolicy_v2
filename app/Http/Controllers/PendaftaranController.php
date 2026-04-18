<?php

namespace App\Http\Controllers;

use App\Models\Period;
use App\Services\PendaftaranService;
use App\Services\JenisBerkasService;
use App\Services\PertanyaanKuesionerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controller untuk manajemen pendaftaran di DASHBOARD ADMIN.
 * Admin bisa melihat daftar pendaftar, detail, dan mengubah status.
 */
class PendaftaranController extends Controller
{
    public function __construct(
        protected PendaftaranService $pendaftaranService,
        protected JenisBerkasService $jenisBerkasService,
        protected PertanyaanKuesionerService $pertanyaanService,
    ) {}

    /**
     * Daftar semua pendaftar (admin).
     */
    public function index(Request $request)
    {
        $activePeriod = Period::where('is_active', true)->first();
        $periods      = Period::orderBy('started_at', 'desc')->get();

        $periodId = $request->query('period_id')
            ? (int) $request->query('period_id')
            : $activePeriod?->id;

        $status       = $request->query('status');
        $pendaftarans = $this->pendaftaranService->getAllPendaftaran($periodId, $status);
        $statistik    = $periodId ? $this->pendaftaranService->getStatistik($periodId) : null;

        return Inertia::render('pendaftaran/index', [
            'pendaftarans'   => $pendaftarans,
            'periods'        => $periods,
            'activePeriodId' => $periodId,
            'activePeriod'   => $activePeriod,
            'statistik'      => $statistik,
            'filterStatus'   => $status,
        ]);
    }

    /**
     * Detail satu pendaftar (admin).
     */
    public function show($id)
    {
        $pendaftaran = $this->pendaftaranService->getPendaftaran($id);

        return Inertia::render('pendaftaran/show', [
            'pendaftaran' => $pendaftaran,
        ]);
    }

    /**
     * Admin mengubah status pendaftaran (pending / accepted / rejected).
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status'   => 'required|in:pending,accepted,rejected',
            'feedback' => 'nullable|string|max:1000',
        ]);

        try {
            $this->pendaftaranService->updateStatus($id, $validated['status'], $validated['feedback'] ?? null);
            return redirect()->back()->with('success', 'Status pendaftaran berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Admin hapus data pendaftar (soft delete).
     */
    public function destroy($id)
    {
        try {
            $this->pendaftaranService->deletePendaftaran($id);
            return redirect()->back()->with('success', 'Data pendaftar berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
