<?php

namespace App\Services;

use App\Models\Structure;
use App\Models\Division;
use App\Models\Period;

class StructureService
{
    public function getAllStructuresWithRelations()
    {
        return Structure::with(['division', 'period'])->get();
    }
    public function getAllStructuresWithRelationsSorted($sort = 'desc', $periodId = null)
    {
        $query = Structure::with(['division', 'period'])
            ->orderBy('level', $sort);

        if ($periodId) {
            $query->where('period_id', $periodId);
        }

        return $query->get();
    }

    public function getAllDivisions()
    {
        return Division::all();
    }

    public function getAllPeriods()
    {
        return Period::all();
    }

    public function createStructure(array $data)
    {
        return Structure::create($data);
    }

    public function updateStructure($id, array $data)
    {
        $structure = Structure::findOrFail($id);
        $structure->update($data);
        return $structure;
    }

    public function deleteStructure($id)
    {
        $structure = Structure::findOrFail($id);
        $structure->delete();
    }
    
}
