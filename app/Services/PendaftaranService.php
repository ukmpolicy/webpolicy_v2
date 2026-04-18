<?php

namespace App\Services;

use App\Repositories\PendaftaranRepository;
use Illuminate\Support\Facades\DB;
use Exception;

class PendaftaranService
{
    protected $pendaftaranRepository;

    public function __construct(PendaftaranRepository $pendaftaranRepository)
    {
        $this->pendaftaranRepository = $pendaftaranRepository;
    }

    public function getAllPendaftaran()
    {
        return $this->pendaftaranRepository->getAll();
    }

    public function getPendaftaranById($id)
    {
        return $this->pendaftaranRepository->getById($id);
    }

    public function getPendaftaranByUserId($userId)
    {
        return $this->pendaftaranRepository->getByUserId($userId);
    }

    public function getPendaftaranByPeriodId($periodId)
    {
        return $this->pendaftaranRepository->getByPeriodId($periodId);
    }

    public function register(array $data)
    {
        // Cek double register berdasarkan user_id atau nim dalam satu periode
        $exists = $this->pendaftaranRepository->checkExists(
            $data['user_id'], $data['nim'], $data['period_id']
        );

        if ($exists) {
            throw new Exception('User atau NIM sudah terdaftar pada periode ini.');
        }

        return DB::transaction(function () use ($data) {
            return $this->pendaftaranRepository->create($data);
        });
    }

    public function updatePendaftaran($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            return $this->pendaftaranRepository->update($id, $data);
        });
    }

    public function processPendaftaran($id, $status, $feedback = null)
    {
        if (!in_array($status, ['accepted', 'rejected', 'pending'])) {
            throw new Exception("Status tidak valid.");
        }

        return DB::transaction(function () use ($id, $status, $feedback) {
            return $this->pendaftaranRepository->updateStatus($id, $status, $feedback);
        });
    }

    public function deletePendaftaran($id)
    {
        return DB::transaction(function () use ($id) {
            return $this->pendaftaranRepository->delete($id);
        });
    }

    public function getTotalApplicantsCount($periodId = null)
    {
        if ($periodId) {
            return \App\Models\Pendaftaran::where('period_id', $periodId)->count();
        }
        return \App\Models\Pendaftaran::count();
    }

    public function getPendingApplicantsCount($periodId = null)
    {
        $query = \App\Models\Pendaftaran::where('status', 'pending');
        if ($periodId) {
            $query->where('period_id', $periodId);
        }
        return $query->count();
    }
}
