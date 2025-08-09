<?php

namespace App\Repositories;

use App\Models\Structure;
use App\Models\Division;
use App\Models\Period;

class StructureRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new Structure();
    }

    /**
     * Ambil semua struktur (tanpa relasi).
     */
    public function getAll()
    {
        return $this->model->all();
    }

    /**
     * Ambil semua struktur dengan relasi division & period.
     */
    public function getAllWithRelations()
    {
        return $this->model->with(['division', 'period'])->get();
    }

    /**
     * Ambil semua struktur dengan relasi dan sorting berdasarkan level.
     * Bisa difilter berdasarkan period_id.
     */
    public function getAllWithRelationsSorted($sort = 'desc', $periodId = null)
    {
        $query = $this->model->with(['division', 'period'])
                             ->orderBy('level', $sort);

        if ($periodId) {
            $query->where('period_id', $periodId);
        }

        return $query->get();
    }

    /**
     * Ambil semua division.
     */
    public function getAllDivisions()
    {
        return Division::all();
    }

    /**
     * Ambil semua period.
     */
    public function getAllPeriods()
    {
        return Period::all();
    }

    /**
     * Simpan data struktur baru.
     */
    public function create(array $data)
    {
        return $this->model->create($data);
    }

    /**
     * Update data struktur berdasarkan ID.
     */
    public function update($id, array $data)
    {
        $structure = $this->model->findOrFail($id);
        $structure->update($data);
        return $structure;
    }

    /**
     * Hapus struktur berdasarkan ID.
     */
    public function delete($id)
    {
        $structure = $this->model->findOrFail($id);
        return $structure->delete();
    }
}
