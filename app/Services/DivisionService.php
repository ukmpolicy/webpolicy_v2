<?php

namespace App\Services;

use App\Repositories\DivisionRepository;

class DivisionService
{
    protected $divisionRepository;

    public function __construct(DivisionRepository $divisionRepository)
    {
        $this->divisionRepository = $divisionRepository;
    }

    public function getAllDivisions()
    {
        return $this->divisionRepository->getAll();
    }

    public function createDivision(array $data)
    {
        return $this->divisionRepository->create($data);
    }

    public function updateDivision($id, array $data)
    {
        return $this->divisionRepository->update($id, $data);
    }

    public function deleteDivision($id)
    {
        return $this->divisionRepository->delete($id);
    }
}
