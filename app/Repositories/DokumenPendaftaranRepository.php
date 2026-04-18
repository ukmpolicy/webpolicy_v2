<?php

namespace App\Repositories;

use App\Models\DokumenPendaftaran;

class DokumenPendaftaranRepository
{
    public function getByPendaftaran(int $pendaftaranId)
    {
        return DokumenPendaftaran::with('jenisBerkas')
            ->where('pendaftaran_id', $pendaftaranId)
            ->get();
    }

    public function findByPendaftaranAndJenis(int $pendaftaranId, int $jenisBerkasId)
    {
        return DokumenPendaftaran::where('pendaftaran_id', $pendaftaranId)
            ->where('jenis_berkas_id', $jenisBerkasId)
            ->first();
    }

    public function upsert(int $pendaftaranId, int $jenisBerkasId, string $filePath, string $originalName): DokumenPendaftaran
    {
        return DokumenPendaftaran::updateOrCreate(
            [
                'pendaftaran_id'  => $pendaftaranId,
                'jenis_berkas_id' => $jenisBerkasId,
            ],
            [
                'file_path'     => $filePath,
                'original_name' => $originalName,
            ]
        );
    }

    public function delete($id)
    {
        $dokumen = DokumenPendaftaran::findOrFail($id);
        return $dokumen->delete();
    }
}
