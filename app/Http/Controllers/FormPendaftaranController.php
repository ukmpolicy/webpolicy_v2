<?php

namespace App\Http\Controllers;

use App\Models\Period;
use App\Services\PendaftaranService;
use App\Services\JenisBerkasService;
use App\Services\DokumenPendaftaranService;
use App\Services\PertanyaanKuesionerService;
use App\Services\JawabanKuesionerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controller untuk HALAMAN USER (publik yang sudah login).
 * Menangani alur: daftar → upload berkas → isi kuesioner.
 */
class FormPendaftaranController extends Controller
{
    public function __construct(
        protected PendaftaranService $pendaftaranService,
        protected JenisBerkasService $jenisBerkasService,
        protected DokumenPendaftaranService $dokumenService,
        protected PertanyaanKuesionerService $pertanyaanService,
        protected JawabanKuesionerService $jawabanService,
    ) {}

    /**
     * Halaman utama pendaftaran (cek apakah periode sedang buka).
     */
    public function landing()
    {
        $period = Period::where('is_open_recruitment', true)
            ->where('recruitment_started_at', '<=', now())
            ->where('recruitment_ended_at', '>=', now())
            ->first();

        if (!$period) {
            return Inertia::render('pendaftaran/tutup');
        }

        $user          = Auth::user();
        $pendaftaran   = $this->pendaftaranService->getPendaftaranByUser($user->id, $period->id);

        return Inertia::render('pendaftaran/landing', [
            'period'       => $period,
            'pendaftaran'  => $pendaftaran,
        ]);
    }

    /**
     * STEP 1: Form isi data diri.
     */
    public function formDataDiri()
    {
        $period = $this->getActivePeriodOrFail();
        $user          = Auth::user();
        $pendaftaran   = $this->pendaftaranService->getPendaftaranByUser($user->id, $period->id);

        return Inertia::render('pendaftaran/form-data-diri', [
            'period'      => $period,
            'pendaftaran' => $pendaftaran,
        ]);
    }

    /**
     * STEP 1: Simpan/update data diri.
     */
    public function simpanDataDiri(Request $request)
    {
        $period = $this->getActivePeriodOrFail();
        $userId = Auth::id();

        $validated = $request->validate([
            'nim'                    => 'required|string|max:30',
            'nama'                   => 'required|string|max:100',
            'email'                  => 'required|email|max:100',
            'jurusan'                => 'required|string|max:150',
            'prodi'                  => 'required|string|max:150',
            'alamat'                 => 'nullable|string|max:255',
            'tgl_lahir'              => 'nullable|date',
            'tempat_lahir'           => 'nullable|string|max:100',
            'jenis_kelamin'          => 'nullable|in:L,P',
            'agama'                  => 'nullable|string|max:50',
            'no_wa'                  => 'nullable|string|max:20',
            'pengalaman_organisasi'  => 'nullable|string',
            'motivasi'               => 'nullable|string',
            'motto'                  => 'nullable|string|max:255',
        ]);

        $validated['period_id'] = $period->id;

        try {
            $existing = $this->pendaftaranService->getPendaftaranByUser($userId, $period->id);

            if ($existing) {
                $this->pendaftaranService->updatePendaftaran($existing->id, $validated);
            } else {
                $this->pendaftaranService->createPendaftaran($validated);
            }

            return redirect()->route('pendaftaran.berkas')->with('success', 'Data diri berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * STEP 2: Halaman upload berkas.
     */
    public function formBerkas()
    {
        $period      = $this->getActivePeriodOrFail();
        $pendaftaran = $this->pendaftaranService->getPendaftaranByUser(Auth::id(), $period->id);

        if (!$pendaftaran) {
            return redirect()->route('pendaftaran.data-diri')->with('error', 'Isi data diri terlebih dahulu.');
        }

        $jenisBerkas = $this->jenisBerkasService->getAllAktif();
        $dokumen     = $this->dokumenService->getDokumenByPendaftaran($pendaftaran->id);

        return Inertia::render('pendaftaran/form-berkas', [
            'pendaftaran' => $pendaftaran,
            'jenisBerkas' => $jenisBerkas,
            'dokumen'     => $dokumen,
        ]);
    }

    /**
     * STEP 2: Upload satu berkas.
     */
    public function uploadBerkas(Request $request)
    {
        $period      = $this->getActivePeriodOrFail();
        $pendaftaran = $this->pendaftaranService->getPendaftaranByUser(Auth::id(), $period->id);

        abort_if(!$pendaftaran, 403, 'Pendaftaran tidak ditemukan.');

        $validated = $request->validate([
            'jenis_berkas_id' => 'required|exists:jenis_berkas,id',
            'file'            => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB
        ]);

        try {
            $this->dokumenService->uploadDokumen(
                $pendaftaran->id,
                $validated['jenis_berkas_id'],
                $request->file('file')
            );
            return redirect()->back()->with('success', 'Berkas berhasil diupload.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * STEP 3: Halaman isi kuesioner.
     */
    public function formKuesioner()
    {
        $period      = $this->getActivePeriodOrFail();
        $pendaftaran = $this->pendaftaranService->getPendaftaranByUser(Auth::id(), $period->id);

        if (!$pendaftaran) {
            return redirect()->route('pendaftaran.data-diri')->with('error', 'Isi data diri terlebih dahulu.');
        }

        $pertanyaan = $this->pertanyaanService->getAllAktif();
        $jawaban    = $this->jawabanService->getJawabanByPendaftaran($pendaftaran->id);

        return Inertia::render('pendaftaran/form-kuesioner', [
            'pendaftaran' => $pendaftaran,
            'pertanyaan'  => $pertanyaan,
            'jawaban'     => $jawaban,
        ]);
    }

    /**
     * STEP 3: Simpan semua jawaban kuesioner.
     */
    public function simpanKuesioner(Request $request)
    {
        $period      = $this->getActivePeriodOrFail();
        $pendaftaran = $this->pendaftaranService->getPendaftaranByUser(Auth::id(), $period->id);

        abort_if(!$pendaftaran, 403, 'Pendaftaran tidak ditemukan.');

        $validated = $request->validate([
            'jawaban'   => 'required|array',
            'jawaban.*' => 'nullable|string',
        ]);

        try {
            $this->jawabanService->simpanJawaban($pendaftaran->id, $validated['jawaban']);
            return redirect()->route('pendaftaran.selesai')->with('success', 'Kuesioner berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Halaman konfirmasi setelah semua step selesai.
     */
    public function selesai()
    {
        $period      = $this->getActivePeriodOrFail();
        $pendaftaran = $this->pendaftaranService->getPendaftaranByUser(Auth::id(), $period->id);

        return Inertia::render('pendaftaran/selesai', [
            'pendaftaran' => $pendaftaran,
        ]);
    }

    // ===== Helper =====

    private function getActivePeriodOrFail()
    {
        $period = Period::where('is_open_recruitment', true)
            ->where('recruitment_started_at', '<=', now())
            ->where('recruitment_ended_at', '>=', now())
            ->first();

        abort_if(!$period, 404, 'Pendaftaran sedang tidak dibuka.');

        return $period;
    }
}
