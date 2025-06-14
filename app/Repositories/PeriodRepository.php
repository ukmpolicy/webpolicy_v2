<?php

namespace App\Repositories;

use App\Models\Period;

class PeriodRepository
{
    public function getAll()
    {
        return Period::all();
    }

    public function create(array $data)
    {
        return Period::create($data);
    }

    public function update($id, array $data)
    {
        $period = Period::findOrFail($id);
        $period->update($data);
        return $period;
    }

    public function delete($id)
    {
        $period = Period::findOrFail($id);
        return $period->delete();
    }
}
