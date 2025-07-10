<?php

namespace App\Services;

use App\Repositories\DivisionPlansRepository;
use App\Repositories\DivisionRepository;

class DivisionPlansService
{
    protected $divisionPlansRepository;
    protected $divisionRepository;

    public function __construct(DivisionPlansRepository $divisionPlansRepository, DivisionRepository $divisionRepository)
    {
        $this->divisionPlansRepository = $divisionPlansRepository;
        $this->divisionRepository = $divisionRepository;
    }


    public function getAllPlansWithDivision()
    {
        return $this->divisionPlansRepository->getAllWithDivision();
    }



    public function getAllDivisions()
    {
        return $this->divisionRepository->getAll();
    }

    public function createPlan(array $data)
    {
        return $this->divisionPlansRepository->create($data);
    }

    public function updatePlan($id, array $data)
    {
        return $this->divisionPlansRepository->update($id, $data);
    }

    public function deletePlan($id)
    {
        return $this->divisionPlansRepository->delete($id);
    }
}
