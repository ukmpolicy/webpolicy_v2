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
}
