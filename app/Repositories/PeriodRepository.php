<?php

namespace App\Repositories;

use App\Models\Period;

class PeriodRepository
{
    /**
     * Mengambil semua periode dasar.
     */
    public function getAll()
    {
        return Period::orderBy('started_at', 'desc')->get();
    }

    /**
     * PERUBAHAN: Mengambil semua periode dengan relasi Visi dan Misi.
     * Ini akan menyelesaikan masalah tampilan data.
     */
    public function getAllWithRelations()
    {
        // Eager load relasi 'vissions' dan 'missions'
        return Period::with(['vissions', 'missions'])->orderBy('started_at', 'desc')->get();
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
