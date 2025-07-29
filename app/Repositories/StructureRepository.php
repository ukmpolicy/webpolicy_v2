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
     * Ambil semua struktur (tanpa relasi).
     */
    public function getAll()
    {
        return Structure::all();
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
