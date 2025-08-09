<?php

namespace App\Services;

use App\Repositories\StructureRepository;

class StructureService
{
    protected $structureRepository;

    public function __construct(StructureRepository $structureRepository)
    {
        $this->structureRepository = $structureRepository;
    }

    public function getAllStructures()
    {
        return $this->structureRepository->getAll();
    }

    public function getAllStructuresWithRelations()
    {
        return $this->structureRepository->getAllWithRelations();
    }

    public function getAllStructuresWithRelationsSorted($sort = 'desc', $periodId = null)
    {
        return $this->structureRepository->getAllWithRelationsSorted($sort, $periodId);
    }

    public function getAllDivisions()
    {
        return $this->structureRepository->getAllDivisions();
    }

    public function getAllPeriods()
    {
        return $this->structureRepository->getAllPeriods();
    }

    public function createStructure(array $data)
    {
        return $this->structureRepository->create($data);
    }

    public function updateStructure($id, array $data)
    {
        return $this->structureRepository->update($id, $data);
    }

    public function deleteStructure($id)
    {
        return $this->structureRepository->delete($id);
    }
}
