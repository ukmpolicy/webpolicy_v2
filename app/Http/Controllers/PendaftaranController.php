<?php

namespace App\Http\Controllers;

use App\Services\PendaftaranService;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PendaftaranController extends Controller
{
    protected $pendaftaranService;

    public function __construct(PendaftaranService $pendaftaranService)
    {
        $this->pendaftaranService = $pendaftaranService;
    }

    public function index()
    {
        try {
            $pendaftaran = $this->pendaftaranService->getAllPendaftaran();
            return Inertia::render('pendaftaran/index', [
                'pendaftarans' => $pendaftaran
            ]);
        } catch (Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memuat data: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $pendaftaran = $this->pendaftaranService->getPendaftaranById($id);
            $fields = \App\Models\RecruitmentField::all();
            
            return Inertia::render('pendaftaran/show', [
                'pendaftaran' => $pendaftaran,
                'fields' => $fields
            ]);
        } catch (Exception $e) {
            return back()->with('error', 'Data pendaftaran tidak ditemukan.');
        }
    }

    public function kuisionerIndex()
    {
        try {
            $pendaftaran = $this->pendaftaranService->getAllPendaftaran();
            return Inertia::render('pendaftaran/kuisioner-index', [
                'pendaftarans' => $pendaftaran
            ]);
        } catch (Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memuat data kuisioner: ' . $e->getMessage());
        }
    }

    public function dokumenIndex()
    {
        try {
            $pendaftaran = $this->pendaftaranService->getAllPendaftaran();
            return Inertia::render('pendaftaran/dokumen-index', [
                'pendaftarans' => $pendaftaran
            ]);
        } catch (Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memuat data dokumen: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id'               => 'required|exists:users,id',
            'period_id'             => 'required|exists:periods,id',
            'nama'                  => 'required|string|max:100',
            'nim'                   => 'required|string|max:30',
            'jurusan'               => 'required|string|max:150',
            'prodi'                 => 'required|string|max:150',
            'alamat'                => 'nullable|string|max:255',
            'tgl_lahir'             => 'nullable|date',
            'tempat_lahir'          => 'nullable|string|max:100',
            'jenis_kelamin'         => 'nullable|in:L,P',
            'agama'                 => 'nullable|string|max:50',
            'no_wa'                 => 'nullable|string|max:20',
            'email'                 => 'nullable|email|max:100',
            'soft_skill'            => 'nullable|string',
            'pengalaman_organisasi' => 'nullable|string',
            'motivasi'              => 'nullable|string',
            'motto'                 => 'nullable|string|max:255',
            // Kuisioner (teks)
            'deskripsi_diri'        => 'nullable|string',
            'alasan_bergabung'      => 'nullable|string',
            'makna_logo'            => 'nullable|string',
            'visi_misi'             => 'nullable|string',
            'sejarah_ukm'           => 'nullable|string',
            'pengetahuan_linux'     => 'nullable|string',
            // Dokumen (file upload)
            'pas_photo'             => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'sertifikat_ppkmb'      => 'nullable|file|max:5120',
            'follow_ig'             => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'follow_tiktok'         => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'follow_yt'             => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'tgl_lahir_doc'         => 'nullable|file|max:5120',
            'bukti_pembayaran'      => 'nullable|file|max:5120',
            'berkas_tambahan_1'     => 'nullable|file|max:5120',
            'berkas_tambahan_2'     => 'nullable|file|max:5120',
        ]);

        try {
            $data = $request->except([
                'pas_photo','sertifikat_ppkmb','follow_ig','follow_tiktok',
                'follow_yt','tgl_lahir_doc','bukti_pembayaran',
                'berkas_tambahan_1','berkas_tambahan_2',
            ]);

            // Simpan file dokumen satu per satu ke storage
            $fileFields = [
                'pas_photo','sertifikat_ppkmb','follow_ig','follow_tiktok',
                'follow_yt','tgl_lahir_doc','bukti_pembayaran',
                'berkas_tambahan_1','berkas_tambahan_2',
            ];

            foreach ($fileFields as $field) {
                if ($request->hasFile($field)) {
                    $data[$field] = $request->file($field)->store('pendaftaran_berkas', 'public');
                }
            }

            $this->pendaftaranService->register($data);
            return redirect()->back()->with('success', 'Pendaftaran berhasil disubmit.');
        } catch (Exception $e) {
            Log::error('Error store pendaftaran: ' . $e->getMessage());
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nama' => 'required|string|max:100',
            'nim' => 'required|string|max:30',
            'jurusan' => 'required|string|max:150',
            'prodi' => 'required|string|max:150',
            // tambahkan validasi form edit lainnya sesuai kebutuhan
        ]);

        try {
            $this->pendaftaranService->updatePendaftaran($id, $validatedData);
            return redirect()->back()->with('success', 'Data pendaftaran berhasil diupdate.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function process(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected,pending',
            'feedback' => 'nullable|string',
        ]);

        try {
            $this->pendaftaranService->processPendaftaran($id, $request->status, $request->feedback);
            return redirect()->back()->with('success', 'Status pendaftaran berhasil diperbarui.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $this->pendaftaranService->deletePendaftaran($id);
            return redirect()->back()->with('success', 'Data pendaftaran berhasil dihapus.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}
