<?php

namespace App\Services;

use App\Repositories\PeriodRepository;

class PeriodService
{
    protected $periodRepository;

    public function __construct(PeriodRepository $periodRepository)
    {
        $this->periodRepository = $periodRepository;
    }

    /**
     * PERUBAHAN: Ganti pemanggilan ke metode baru.
     */
    public function getAllPeriodsWithRelations()
    {
        return $this->periodRepository->getAllWithRelations();
    }

    public function createPeriod(array $data)
    {
        return $this->periodRepository->create($data);
    }

    public function updatePeriod($id, array $data)
    {
        return $this->periodRepository->update($id, $data);
    }

    public function deletePeriod($id)
    {
        return $this->periodRepository->delete($id);
    }
}
