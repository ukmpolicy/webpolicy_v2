<?php

namespace App\Services;

use App\Models\Period;
use App\Models\Structure;
use App\Models\StructureMember;
use App\Repositories\StructureMemberRepository;
use App\Repositories\StructureRepository;

class StructureMemberService
{
    protected $structureMemberRepository;
    protected $structureRepository;

    public function __construct(
        StructureMemberRepository $structureMemberRepository,
        StructureRepository $structureRepository
    ) {
        $this->structureMemberRepository = $structureMemberRepository;
        $this->structureRepository = $structureRepository;
    }

    /**
     * Ambil semua anggota beserta struktur terkait.
     */
    public function getAllMembersWithStructure()
    {
        return $this->structureMemberRepository->getAllWithStructure();
    }

    /**
     * Ambil semua struktur (untuk dropdown).
     */
    public function getAllStructures($periodId = null)
    {
        return Structure::query()
            ->when($periodId, fn($q) => $q->where('period_id', $periodId))
            ->get();
    }

    /**
     * Ambil semua periode (untuk filter).
     */
    public function getAllPeriods()
    {
        return Period::all();
    }

    /**
     * Ambil satu anggota berdasarkan ID.
     */
    public function getById($id)
    {
        return $this->structureMemberRepository->find($id);
    }

    /**
     * Ambil satu anggota beserta relasi struktur & periodenya.
     */
    public function getByIdWithRelations($id)
    {
        return StructureMember::with(['structure.period'])->find($id);
    }

    /**
     * Ambil anggota berdasarkan periode struktur.
     */
    public function getMembersByPeriod($periodId)
    {
        return StructureMember::with(['structure.period'])
            ->whereHas('structure', function ($query) use ($periodId) {
                $query->where('period_id', $periodId);
            })
            ->get();
    }

    /**
     * Buat anggota baru, validasi jumlah anggota jika perlu.
     */
    public function createMember(array $data)
    {
        $structure = Structure::findOrFail($data['structure_id']);

        if (!$structure->has_many_member) {
            $memberCount = StructureMember::where('structure_id', $structure->id)->count();

            if ($memberCount >= 1) {
                throw new \Exception("Struktur '{$structure->name}' hanya dapat memiliki satu anggota.");
            }
        }

        return StructureMember::create($data);
    }

    /**
     * Update anggota berdasarkan ID.
     */
    public function updateMember($id, array $data)
    {
        return $this->structureMemberRepository->update($id, $data);
    }

    /**
     * Hapus anggota berdasarkan ID.
     */
    public function deleteMember($id)
    {
        return $this->structureMemberRepository->delete($id);
    }
    public function getMembersByPeriodAndStructure($periodId = null, $structureId = null)
    {
        $query = StructureMember::with(['structure.period']);

        if ($periodId) {
            $query->whereHas('structure', fn ($q) => $q->where('period_id', $periodId));
        }

        if ($structureId) {
            $query->where('structure_id', $structureId);
        }

        return $query->latest()->get();
    }
    
    public function getStructuresByPeriod($periodId = null)
    {
        $query = Structure::query();

        if ($periodId) {
            $query->where('period_id', $periodId);
        }

        return $query->get();
    }


}
