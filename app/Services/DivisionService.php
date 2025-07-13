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
    // public function __construct(DivisionRepository $divisionRepository)
    // {
    //     $this->divisionRepository = $divisionRepository;
    // }

    public function getAllDivisions($periodId = null)
    {
        return $this->divisionRepository->getAll($periodId);
    }

    public function createDivision(array $data)
    {
        // Normalisasi nama sebelum create
        $data['name'] = preg_replace('/\s+/', ' ', strtolower(trim($data['name'])));
        return $this->divisionRepository->create($data);
    }

    public function updateDivision($id, array $data)
    {
        // Normalisasi nama sebelum update
        $data['name'] = preg_replace('/\s+/', ' ', strtolower(trim($data['name'])));
        return $this->divisionRepository->update($id, $data);
    }

    public function deleteDivision($id)
    {
        return $this->divisionRepository->delete($id);
    }
}
