<?php

namespace App\Services;

use App\Repositories\MemberRepository;
use Illuminate\Support\Facades\Storage;

class MemberService
{
    protected $memberRepository;

    public function __construct(MemberRepository $memberRepository)
    {
        $this->memberRepository = $memberRepository;
    }

    public function getAllMembers()
    {
        return $this->memberRepository->getAll();
    }

    public function getMember($id)
    {
        return $this->memberRepository->find($id);
    }

    public function createMember(array $data)
    {
        // Handle upload file terlebih dahulu
        if (isset($data['picture']) && $data['picture'] instanceof \Illuminate\Http\UploadedFile) {
            $path = $data['picture']->store('member_pictures', 'public');
            $data['picture'] = $path;
        }

        return $this->memberRepository->create($data);
    }

    public function updateMember($id, array $data)
    {
        $member = $this->memberRepository->find($id);

        if (isset($data['picture']) && $data['picture'] instanceof \Illuminate\Http\UploadedFile) {
            if ($member->picture) {
                Storage::disk('public')->delete($member->picture); // Hapus foto lama
            }
            $path = $data['picture']->store('member_pictures', 'public');
            $data['picture'] = $path;
        }

        return $this->memberRepository->update($id, $data);
    }

    public function deleteMember($id)
    {
        return $this->memberRepository->delete($id);
    }
}
