<?php

namespace App\Repositories;

use App\Models\JenisBerkas;

class JenisBerkasRepository
{
    public function getAll()
    {
        return JenisBerkas::orderBy('urutan')->get();
    }

    public function getAllAktif()
    {
        return JenisBerkas::aktif()->get();
    }

    public function find($id)
    {
        return JenisBerkas::findOrFail($id);
    }

    public function create(array $data)
    {
        return JenisBerkas::create($data);
    }

    public function update($id, array $data)
    {
        $jenisBerkas = JenisBerkas::findOrFail($id);
        $jenisBerkas->update($data);
        return $jenisBerkas;
    }

    public function delete($id)
    {
        $jenisBerkas = JenisBerkas::findOrFail($id);
        return $jenisBerkas->delete();
    }
}
