<?php

namespace App\Services;

use App\Models\Period;
use App\Models\Vission;
use App\Models\Mission;
use App\Repositories\VissionRepository;
use App\Repositories\MissionRepository;
use Illuminate\Validation\ValidationException;

class PeriodContentService
{
    protected $vissionRepository;
    protected $missionRepository;

    /**
     * Inject repository yang dibutuhkan.
     *
     * @param VissionRepository $vissionRepository
     * @param MissionRepository $missionRepository
     */
    public function __construct(VissionRepository $vissionRepository, MissionRepository $missionRepository)
    {
        $this->vissionRepository = $vissionRepository;
        $this->missionRepository = $missionRepository;
    }

    /**
     * Membuat konten baru (Visi atau Misi) untuk sebuah Periode.
     *
     * @param Period $period
     * @param string $type 'vission' or 'mission'
     * @param array $data
     * @return Vission|Mission
     */
    public function createContentForPeriod(Period $period, string $type, array $data)
    {
        // Logika Bisnis: Hanya periode aktif yang bisa ditambah kontennya.
        if (!$period->is_active) {
            throw ValidationException::withMessages([
                'content' => "Tidak dapat menambah {$type} pada periode yang tidak aktif.",
            ]);
        }

        // Proses data sebelum disimpan
        $processedData = [
            'content' => strtolower(trim($data['content'])),
        ];

        // Panggil repository yang sesuai berdasarkan tipe
        if ($type === 'vission') {
            return $this->vissionRepository->createForPeriod($period, $processedData);
        } else {
            return $this->missionRepository->createForPeriod($period, $processedData);
        }
    }

    /**
     * Mengubah konten yang sudah ada (Visi atau Misi).
     *
     * @param Vission|Mission $contentModel
     * @param array $data
     * @return bool
     */
    public function updateContent($contentModel, array $data): bool
    {
        // Logika Bisnis: Hanya konten dari periode aktif yang bisa diubah.
        if (!$contentModel->period->is_active) {
            throw ValidationException::withMessages([
                'content' => "Tidak dapat mengubah konten pada periode yang tidak aktif.",
            ]);
        }

        $processedData = [
            'content' => strtolower(trim($data['content'])),
        ];

        // Panggil repository yang sesuai berdasarkan tipe model
        if ($contentModel instanceof Vission) {
            return $this->vissionRepository->update($contentModel, $processedData);
        } else {
            return $this->missionRepository->update($contentModel, $processedData);
        }
    }

    /**
     * Menghapus konten (Visi atau Misi).
     *
     * @param Vission|Mission $contentModel
     * @return bool
     */
    public function deleteContent($contentModel): bool
    {
        // Logika Bisnis: Hanya konten dari periode aktif yang bisa dihapus.
        if (!$contentModel->period->is_active) {
            // Bisa juga melempar exception, tapi return false lebih sederhana untuk ditangani
            return false;
        }

        if ($contentModel instanceof Vission) {
            return $this->vissionRepository->delete($contentModel);
        } else {
            return $this->missionRepository->delete($contentModel);
        }
    }
}
