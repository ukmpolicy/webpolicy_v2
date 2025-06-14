<?php

namespace App\Repositories;

use App\Models\Member;

class MemberRepository
{
    public function getAll()
    {
        return Member::with('period')->get();
        //  return Member::with('period')->paginate(10);
    }

    public function find($id)
    {
        return Member::with('period')->findOrFail($id);
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
}
