<?php

namespace App\Repositories;

use App\Models\Structure;

class StructureRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new Structure();
    }

    /**
     * Ambil semua struktur beserta relasi division dan period.
     */
    public function getAll($filter)
    {
        $structure = Structure::with('division') // Tambahkan with('division') di sini
            // ->offset(0)
            // ->limit(10)
            ->orderBy('level', 'asc');

        if (isset($filter['page'])) {
            $structure->offset(($filter['page'] - 1) * $filter['limit']);
        }

        if (isset($filter['limit'])) {
            $structure->limit($filter['limit']);
        }

        if (isset($filter['period_id'])) {
            $structure->where('period_id', $filter['period_id']);
        }

        return $structure->get();
    }

    public function getStructureByLevel($level)
    {
        return Structure::where('level', $level)->first();
    }

    /**
     * Ambil semua struktur beserta relasi division.
     */
    public function getAllWithDivision()
    {
        return Structure::with('division')->get();
    }

    /**
     * Simpan data struktur baru.
     */
    public function create(array $data)
    {
        return Structure::create($data);
    }

    /**
     * Update data struktur berdasarkan ID.
     */
    public function update($id, array $data)
    {
        $structure = Structure::findOrFail($id);
        $structure->update($data);
        return $structure;
    }

    /**
     * Hapus struktur berdasarkan ID.
     */
    public function delete($id)
    {
        $structure = Structure::findOrFail($id);
        return $structure->delete();
    }
}
