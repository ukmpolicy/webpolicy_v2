<?php

namespace App\Repositories;

use App\Models\DivisionPlan;

class DivisionPlansRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new DivisionPlan();
    }

    public function getAllWithDivision()
    {
        return DivisionPlan::with('division')->get();
    }

    public function create(array $data)
    {
        return DivisionPlan::create($data);
    }

    public function getWithDivision($divisionId = null)
    {
        $query = DivisionPlan::with('division');
        if ($divisionId) {
            $query->where('division_id', $divisionId);
        }
        return $query->get();
    }

    public function update($id, array $data)
    {
        $plan = DivisionPlan::findOrFail($id);
        $plan->update($data);
        return $plan;
    }

    public function delete($id)
    {
        $plan = DivisionPlan::findOrFail($id);
        return $plan->delete();
    }
}
