<?php

namespace App\Services;

use App\Repositories\DokumenPendaftaranRepository;
use Illuminate\Support\Facades\Storage;

class DokumenPendaftaranService
{
    protected $dokumenRepository;

    public function __construct(DokumenPendaftaranRepository $dokumenRepository)
    {
        $this->dokumenRepository = $dokumenRepository;
    }

    public function getDokumenByPendaftaran(int $pendaftaranId)
    {
        return $this->dokumenRepository->getByPendaftaran($pendaftaranId);
    }

    /**
     * Upload file berkas dan simpan path-nya ke database.
     * Jika sudah ada file lama untuk jenis berkas yang sama, hapus dulu.
     */
    public function uploadDokumen(int $pendaftaranId, int $jenisBerkasId, $file)
    {
        // Cek apakah sudah ada berkas sebelumnya
        $existing = $this->dokumenRepository->findByPendaftaranAndJenis($pendaftaranId, $jenisBerkasId);
        if ($existing) {
            Storage::disk('public')->delete($existing->file_path);
        }

        $path         = $file->store('pendaftaran/berkas', 'public');
        $originalName = $file->getClientOriginalName();

        return $this->dokumenRepository->upsert($pendaftaranId, $jenisBerkasId, $path, $originalName);
    }

    /**
     * Hapus satu dokumen beserta file fisiknya.
     */
    public function deleteDokumen($id)
    {
        $dokumen = \App\Models\DokumenPendaftaran::findOrFail($id);
        Storage::disk('public')->delete($dokumen->file_path);

        return $this->dokumenRepository->delete($id);
    }
}
