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

    public function getAllMembers(?int $periodId = null)
    {
        return $this->memberRepository->getAll($periodId);
    }

    public function getMember($id)
    {
        return $this->memberRepository->find($id);
    }

    public function createMember(array $data)
    {
        // // Validasi unik email/nim
        // $existing = $this->memberRepository->checkUnique($data['email'], $data['nim']);

        // if ($existing) {
        //     if ($existing->email === $data['email']) {
        //         throw new \Exception('Email sudah terdaftar');
        //     }
        //     if ($existing->nim === $data['nim']) {
        //         throw new \Exception('NIM sudah terdaftar');
        //     }
        // }

        // // Handle gambar
        // if (isset($data['picture'])) {
        //     $data['picture'] = $this->storeImage($data['picture']);
        // }

        // return $this->memberRepository->create($data);
        // Handle gambar
        if (isset($data['picture'])) {
            $data['picture'] = $this->storeImage($data['picture']);
        }

        return $this->memberRepository->create($data);
    }

    public function updateMember($id, array $data)
    {
        // $member = $this->memberRepository->find($id);

        // // Validasi unik email/nim
        // $existing = $this->memberRepository->checkUnique($data['email'], $data['nim'], $id);

        // if ($existing) {
        //     if ($existing->email === $data['email']) {
        //         throw new \Exception('Email sudah terdaftar');
        //     }
        //     if ($existing->nim === $data['nim']) {
        //         throw new \Exception('NIM sudah terdaftar');
        //     }
        // }

        // // Handle gambar
        // if (isset($data['picture'])) {
        //     if ($data['picture'] instanceof \Illuminate\Http\UploadedFile) {
        //         if ($member->picture) {
        //             Storage::delete($member->picture);
        //         }
        //         $data['picture'] = $this->storeImage($data['picture']);
        //     } elseif ($data['picture'] === null || $data['picture'] === '') {
        //         if ($member->picture) {
        //             Storage::delete($member->picture);
        //         }
        //         $data['picture'] = null;
        //     }
        // } else {
        //     unset($data['picture']);
        // }

        // return $this->memberRepository->update($id, $data);

        $member = $this->memberRepository->find($id);
        // Handle gambar
        if (isset($data['picture'])) {
            if ($data['picture'] instanceof \Illuminate\Http\UploadedFile) {
                if ($member->picture) {
                    Storage::delete($member->picture);
                }
                $data['picture'] = $this->storeImage($data['picture']);
            } elseif ($data['picture'] === null || $data['picture'] === '') {
                if ($member->picture) {
                    Storage::delete($member->picture);
                }
                $data['picture'] = null;
            }
        } else {
            unset($data['picture']);
        }

        return $this->memberRepository->update($id, $data);
    }
    protected function storeImage($image)
    {
        return $image->store('member_pictures', 'public');
    }

    public function deleteMember($id)
    {
        $member = $this->memberRepository->find($id);

        if ($member->picture) {
            Storage::delete($member->picture);
        }

        return $this->memberRepository->delete($id);
    }

    // Metode baru: Mendapatkan total semua anggota
    public function getTotalMembersCount(): int
    {
        return $this->memberRepository->countAll();
    }

    // Metode baru: Mendapatkan jumlah anggota berdasarkan ID periode
    public function getMembersCountByPeriod(int $periodId): int
    {
        return $this->memberRepository->countByPeriod($periodId);
    }

    /**
     * Mendapatkan daftar semua anggota beserta tanggal lahirnya.
     */
    public function getAllMembersBirthdays()
    {
        return $this->memberRepository->getAllBirthdays();
    }
}
