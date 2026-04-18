<?php

namespace App\Repositories;

use App\Models\PertanyaanKuesioner;

class PertanyaanKuesionerRepository
{
    public function getAll()
    {
        return PertanyaanKuesioner::orderBy('urutan')->get();
    }

    public function getAllAktif()
    {
        return PertanyaanKuesioner::aktif()->get();
    }

    public function find($id)
    {
        return PertanyaanKuesioner::findOrFail($id);
    }

    public function create(array $data)
    {
        return PertanyaanKuesioner::create($data);
    }

    public function update($id, array $data)
    {
        $pertanyaan = PertanyaanKuesioner::findOrFail($id);
        $pertanyaan->update($data);
        return $pertanyaan;
    }

    public function delete($id)
    {
        $pertanyaan = PertanyaanKuesioner::findOrFail($id);
        return $pertanyaan->delete();
    }
}
