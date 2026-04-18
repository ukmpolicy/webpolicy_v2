<?php

namespace App\Services;

use App\Repositories\JawabanKuesionerRepository;

class JawabanKuesionerService
{
    protected $jawabanRepository;

    public function __construct(JawabanKuesionerRepository $jawabanRepository)
    {
        $this->jawabanRepository = $jawabanRepository;
    }

    public function getJawabanByPendaftaran(int $pendaftaranId)
    {
        return $this->jawabanRepository->getByPendaftaran($pendaftaranId);
    }

    /**
     * Simpan/update semua jawaban kuesioner sekaligus.
     *
     * @param int   $pendaftaranId
     * @param array $jawaban  Format: [pertanyaan_kuesioner_id => teks_jawaban]
     */
    public function simpanJawaban(int $pendaftaranId, array $jawaban): void
    {
        $this->jawabanRepository->upsertBatch($pendaftaranId, $jawaban);
    }
}
