<?php

namespace App\Repositories;

use App\Models\JawabanKuesioner;

class JawabanKuesionerRepository
{
    public function getByPendaftaran(int $pendaftaranId)
    {
        return JawabanKuesioner::with('pertanyaan')
            ->where('pendaftaran_id', $pendaftaranId)
            ->get();
    }

    public function upsertBatch(int $pendaftaranId, array $jawaban): void
    {
        // $jawaban = [pertanyaan_kuesioner_id => jawaban_text, ...]
        foreach ($jawaban as $pertanyaanId => $teks) {
            JawabanKuesioner::updateOrCreate(
                [
                    'pendaftaran_id'          => $pendaftaranId,
                    'pertanyaan_kuesioner_id' => $pertanyaanId,
                ],
                [
                    'jawaban' => $teks,
                ]
            );
        }
    }

    public function deleteByPendaftaran(int $pendaftaranId)
    {
        return JawabanKuesioner::where('pendaftaran_id', $pendaftaranId)->delete();
    }
}
