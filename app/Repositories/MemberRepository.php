<?php

namespace App\Repositories;

use App\Models\Member;

class MemberRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new Member();
    }
    public function getAll(?int $periodId = null)
    {
        $query = Member::with(['period']);

        if ($periodId) {
            $query->where('period_id', $periodId);
        }

        return $query->get();
    }

    public function find($id)
    {
        return Member::with(['period'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return Member::create($data);
    }

    public function update($id, array $data)
    {
        $member = Member::findOrFail($id);
        $member->update($data);
        return $member;
    }

    public function delete($id)
    {
        $member = Member::findOrFail($id);
        return $member->delete();
    }

    public function checkUnique($email, $nim, $excludeId = null)
    {
        $query = Member::where(function ($q) use ($email, $nim) {
            $q->where('email', $email)->orWhere('nim', $nim);
        });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->first();
    }

    public function getLatestMembers(int $limit = 5)
    {
        return Member::with(['period'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    // Metode baru: Menghitung total semua anggota
    public function countAll(): int
    {
        return Member::count();
    }

    // Metode baru: Menghitung jumlah anggota berdasarkan ID periode
    public function countByPeriod(int $periodId): int
    {
        return Member::where('period_id', $periodId)->count();
    }


    /**
     * Mengambil daftar nama dan tanggal lahir semua anggota.
     */
    public function getAllBirthdays()
    {
        return Member::select('name', 'birth_date_at')->get();
    }
}
