<?php

namespace App\Repositories;

use App\Models\StructureMember;
use Illuminate\Database\Eloquent\Collection;

class StructureMemberRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new StructureMember();
    }

    /**
     * Ambil semua structure member beserta relasi struktur
     */
    public function getAllWithStructure(): Collection
    {
        return $this->model->with('structure')->get();
    }

    /**
     * Simpan data baru structure member
     */
    public function create(array $data): StructureMember
    {
        return $this->model->create($data);
    }

    /**
     * Update structure member berdasarkan ID
     */
    public function update(int $id, array $data): StructureMember
    {
        $member = $this->model->findOrFail($id);
        $member->update($data);

        return $member;
    }

    /**
     * Hapus structure member berdasarkan ID
     */
    public function delete(int $id): bool
    {
        $member = $this->model->findOrFail($id);
        return $member->delete();
    }
        /**
     * Ambil structure member berdasarkan ID
     */
    public function find(int $id): StructureMember
    {
        return $this->model->with('structure')->findOrFail($id);
    }

}
