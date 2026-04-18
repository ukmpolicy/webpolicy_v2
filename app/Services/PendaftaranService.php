<?php

namespace App\Services;

use App\Repositories\PendaftaranRepository;
use Illuminate\Support\Facades\Auth;

class PendaftaranService
{
    protected $pendaftaranRepository;

    public function __construct(PendaftaranRepository $pendaftaranRepository)
    {
        $this->pendaftaranRepository = $pendaftaranRepository;
    }

    public function getAllPendaftaran(?int $periodId = null, ?string $status = null)
    {
        return $this->pendaftaranRepository->getAll($periodId, $status);
    }

    public function getPendaftaran($id)
    {
        return $this->pendaftaranRepository->find($id);
    }

    public function getPendaftaranByUser(int $userId, int $periodId)
    {
        return $this->pendaftaranRepository->findByUser($userId, $periodId);
    }

    /**
     * Pendaftar mengisi data diri dan submit form pendaftaran.
     */
    public function createPendaftaran(array $data)
    {
        $data['user_id'] = Auth::id();
        $data['status']  = 'pending';
        return $this->pendaftaranRepository->create($data);
    }

    /**
     * Pendaftar mengupdate data diri (selama status masih pending).
     */
    public function updatePendaftaran($id, array $data)
    {
        return $this->pendaftaranRepository->update($id, $data);
    }

    public function deletePendaftaran($id)
    {
        return $this->pendaftaranRepository->delete($id);
    }

    /**
     * Admin mengubah status pendaftaran (accept / reject).
     */
    public function updateStatus($id, string $status, ?string $feedback = null)
    {
        return $this->pendaftaranRepository->updateStatus($id, $status, $feedback);
    }

    /**
     * Statistik pendaftaran per periode untuk dashboard admin.
     */
    public function getStatistik(int $periodId): array
    {
        return $this->pendaftaranRepository->countByStatus($periodId);
    }
}
