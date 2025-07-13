<?php

namespace App\Repositories;

use App\Models\Division;

class DivisionRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new Division();
    }

    public function getAll($periodId = null)
    {
        // return Division::all();

        $query = Division::query();
        if($periodId){
            $query->where('period_id', $periodId);
        }

        return $query->get();
    }

    public function create(array $data)
    {
        return Division::create($data);
    }

    public function update($id, array $data)
    {
        $division = Division::findOrFail($id);
        $division->update($data);
        return $division;
    }

    public function delete($id)
    {
        $division = Division::findOrFail($id);
        return $division->delete();
    }
}
