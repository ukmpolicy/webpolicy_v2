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
    /**
     * Halaman utama pendaftaran (cek apakah periode sedang buka).
     */
    /**
     * Halaman utama pendaftaran (cek apakah periode sedang buka).
     */
    public function landing()
    {
        $period = $this->getActivePeriodOrFail();

        if ($this->shouldRedirectToRiwayat($period->id)) {
            return redirect()->route('profile.edit');
        }

        return Inertia::render('pendaftaran/landing', [
            'period'      => $period,
            'pendaftaran' => null, // Tidak perlu mengirim pendaftaran karena baru disimpan di akhir
        ]);
    }

    private function shouldRedirectToRiwayat($currentPeriodId)
    {
        $userId = Auth::id();
        $history = \App\Models\Pendaftaran::where('user_id', $userId)->get();

        if ($history->isEmpty()) {
            return false;
        }

        foreach ($history as $h) {
            if ($h->status === 'accepted') return true;
            if ($h->status === 'pending') return true;
            if ($h->period_id == $currentPeriodId) return true;
        }
        return false;
    }

    /**
     * STEP 1: Form isi data diri.
     */
    public function formDataDiri()
    {
        $period = $this->getActivePeriodOrFail();

        if ($this->shouldRedirectToRiwayat($period->id)) {
            return redirect()->route('profile.edit');
        }

        // Jika pendaftaran belum dibentuk, kita load isian dari session sebagai feedback fallback
        $draft = session('pendaftaran_draft.data_diri');

        return Inertia::render('pendaftaran/form-data-diri', [
            'period'      => $period,
            'pendaftaran' => $draft,
        ]);
    }

    /**
     * STEP 1: Simpan/update data diri (SESSIONS).
     */
    public function simpanDataDiri(Request $request)
    {
        $period = $this->getActivePeriodOrFail();
        if ($this->shouldRedirectToRiwayat($period->id)) {
            return redirect()->route('profile.edit');
        }

        $validated = $request->validate([
            'nim'                    => 'required|string|max:30',
            'nama'                   => 'required|string|max:100',
            'email'                  => 'required|email|max:100',
            'jurusan'                => 'required|string|max:150',
            'prodi'                  => 'required|string|max:150',
            'soft_skill'             => 'nullable|string|max:255',
            'alamat'                 => 'required|string|max:255',
            'tgl_lahir'              => 'required|date',
            'tempat_lahir'           => 'required|string|max:100',
            'jenis_kelamin'          => 'required|in:L,P',
            'agama'                  => 'required|string|max:50',
            'no_wa'                  => 'required|string|max:20',
            'pengalaman_organisasi'  => 'nullable|string',
            'motivasi'               => 'required|string',
            'motto'                  => 'required|string|max:255',
        ]);

        $validated['period_id'] = $period->id;
        
        session(['pendaftaran_draft.data_diri' => $validated]);

        return redirect()->route('pendaftaran.berkas')->with('success', 'Data diri diamankan. Lanjut isi berkas.');
    }

    /**
     * STEP 2: Halaman upload berkas.
     */
    public function formBerkas()
    {
        $period      = $this->getActivePeriodOrFail();

        if (!session()->has('pendaftaran_draft.data_diri')) {
             return redirect()->route('pendaftaran.data-diri')->with('error', 'Isi data diri terlebih dahulu.');
        }

        $jenisBerkas = $this->jenisBerkasService->getAllAktif();
        $dokumenDraft = session('pendaftaran_draft.berkas', []);

        // Mapping draft map string => object untuk kompatibilitas UI
        $dokumen = [];
        foreach($dokumenDraft as $jbId => $fileObj) {
            $dokumen[] = [
                'jenis_berkas_id' => $jbId,
                'file_path' => $fileObj['path'],
            ];
        }

        return Inertia::render('pendaftaran/form-berkas', [
            'pendaftaran' => [],
            'jenisBerkas' => $jenisBerkas,
            'dokumen'     => $dokumen,
        ]);
    }

    /**
     * STEP 2: Upload multiple berkas secara batch (SESSIONS/TMP).
     */
    public function uploadBerkas(Request $request)
    {
        $period = $this->getActivePeriodOrFail();

        if (!session()->has('pendaftaran_draft.data_diri')) {
             return redirect()->route('pendaftaran.data-diri')->with('error', 'Selesaikan data diri.');
        }

        try {
            $jenisBerkasList = $this->jenisBerkasService->getAllAktif();
            $draftBerkas = session('pendaftaran_draft.berkas', []);

            $docsToValidate = [];
            foreach ($jenisBerkasList as $jb) {
                $fileKey = 'berkas_' . $jb->id;
                $sudahAda = isset($draftBerkas[$jb->id]);

                if ($jb->is_required && !$sudahAda) {
                    $docsToValidate[$fileKey] = 'required|file|mimes:jpg,jpeg,png,pdf,heic,heif|max:5120';
                } else {
                    $docsToValidate[$fileKey] = 'nullable|file|mimes:jpg,jpeg,png,pdf,heic,heif|max:5120';
                }
            }

            $request->validate($docsToValidate);

            foreach ($jenisBerkasList as $jb) {
                $fileKey = 'berkas_' . $jb->id;
                if ($request->hasFile($fileKey)) {
                    $path = $request->file($fileKey)->store('pendaftaran/tmp', 'public');
                    $draftBerkas[$jb->id] = [
                        'path' => $path,
                        'originalName' => $request->file($fileKey)->getClientOriginalName()
                    ];
                }
            }
            
            session(['pendaftaran_draft.berkas' => $draftBerkas]);
            
            return redirect()->route('pendaftaran.kuesioner')->with('success', 'Berkas berhasil diamankan.');
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

        if (!session()->has('pendaftaran_draft.data_diri')) {
            return redirect()->route('pendaftaran.data-diri')->with('error', 'Isi data diri terlebih dahulu.');
        }

        $pertanyaan = $this->pertanyaanService->getAllAktif();
        $jawabanDraft = session('pendaftaran_draft.kuesioner', []);

        $jawaban = [];
        foreach($jawabanDraft as $ptId => $jawabanText) {
             $jawaban[] = [
                 'pertanyaan_kuesioner_id' => $ptId,
                 'jawaban' => $jawabanText,
             ];
        }

        return Inertia::render('pendaftaran/form-kuesioner', [
            'pendaftaran' => ['period_id' => $period->id],
            'pertanyaan'  => $pertanyaan,
            'jawaban'     => $jawaban,
        ]);
    }

    /**
     * STEP 3: Simpan final semuanya ke database
     */
    public function simpanKuesioner(Request $request)
    {
        $period      = $this->getActivePeriodOrFail();

        if (!session()->has('pendaftaran_draft.data_diri')) {
            return redirect()->route('pendaftaran.data-diri')->with('error', 'Sesi telah berakhir, ulangi data diri.');
        }

        try {
            $pertanyaanList = $this->pertanyaanService->getAllAktif();
            $jawabanToSave = [];
            $rules = [];

            foreach ($pertanyaanList as $pt) {
                $uiKey = 'jawaban_' . $pt->id;
                $rules[$uiKey] = 'required|string|min:3';
                if ($request->has($uiKey)) {
                    $jawabanToSave[$pt->id] = $request->input($uiKey);
                }
            }

            $request->validate($rules);
            
            // Simpan Ke Tabel sesungguhnya agar final & Atomik DB
            \Illuminate\Support\Facades\DB::beginTransaction();

            // 1. Data Diri
            $dataDiri = session('pendaftaran_draft.data_diri');
            $pendaftaran = $this->pendaftaranService->createPendaftaran($dataDiri);

            // 2. Transisi File Berkas
            $draftBerkas = session('pendaftaran_draft.berkas', []);
            $dokumenRepo = app(\App\Repositories\DokumenPendaftaranRepository::class);
            foreach($draftBerkas as $jenisBerkasId => $fileObj) {
                $oldPath = $fileObj['path'];
                $newPath = str_replace('pendaftaran/tmp', 'pendaftaran/berkas/final_'.$pendaftaran->id, $oldPath);
                
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists($oldPath)) {
                     \Illuminate\Support\Facades\Storage::disk('public')->move($oldPath, $newPath);
                     $dokumenRepo->upsert($pendaftaran->id, $jenisBerkasId, $newPath, $fileObj['originalName']);
                }
            }

            // 3. Kuesioner
            if(!empty($jawabanToSave)) {
                $this->jawabanService->simpanJawaban($pendaftaran->id, $jawabanToSave);
            }

            \Illuminate\Support\Facades\DB::commit();
            session()->forget('pendaftaran_draft'); // Bersihkan remahan session draft
            
            return redirect()->route('profile.edit')->with('success', 'Pendaftaran Berhasil Dikirimkan ke Sistem!');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    // ===== Helper =====

    private function getActivePeriodOrFail()
    {
        // Paksa timezone WIB agar 100% kebal dari delay Cache Timezone di cPanel/Server Hosting
        $wibNow = \Carbon\Carbon::now('Asia/Jakarta');

        $period = \App\Models\Period::where('is_active', true)
            ->where('is_open_recruitment', true)
            ->where('recruitment_started_at', '<=', $wibNow)
            ->where(function ($query) use ($wibNow) {
                $query->where('recruitment_ended_at', '>=', $wibNow)
                      ->orWhereNull('recruitment_ended_at');
            })
            ->first();

        abort_if(!$period, 404, 'Pendaftaran sedang tidak dibuka.');

        return $period;
    }
}
