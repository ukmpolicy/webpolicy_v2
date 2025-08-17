<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Services\DivisionService;
use App\Services\StructureMemberService;
use Illuminate\Http\Request;
use App\Models\Period;
use Inertia\Inertia;
use App\Models\Vission;
use App\Models\Mission;
use Carbon\Carbon;

class HomePageController extends Controller
{
    protected $divisionService;
    protected $structureMemberService;

    public function __construct(DivisionService $divisionService, StructureMemberService $structureMemberService)
    {
        $this->divisionService = $divisionService;
        $this->structureMemberService = $structureMemberService;
    }

    public function index(Request $request)
    {
        $periodId = $request->query('period_id');

        // Jika tidak ada period_id dikirim, gunakan periode aktif atau terbaru
        if (!$periodId) {
            $periodId = Period::where('is_active', 1)->first()?->id ?? Period::latest()->first()?->id;
        }

        // Ambil divisi berdasarkan periode
        $divisions = $this->divisionService->getAllDivisions($periodId);

        // Ambil anggota struktural berdasarkan period ID
        $structureMembersRaw = $this->structureMemberService->getMembersByPeriod($periodId);

        // Format ulang data anggota struktural
        $structureMembers = $structureMembersRaw->map(function ($member) {
            return [
                'id' => $member->id,
                'name' => $member->name,
                'position' => $member->structure->name ?? '-',
                'picture' => $member->picture ? asset('storage/' . $member->picture) : null,
            ];
        });

        // Ambil visi dan misi berdasarkan period_id
        $visi = Vission::where('period_id', $periodId)->pluck('content')->toArray();
        $misi = Mission::where('period_id', $periodId)->pluck('content')->toArray();

        // --- LOGIKA NOTIFIKASI ULANG TAHUN UNTUK HEADER ---
        $isBirthday = false;
        $memberName = null;
        $user = auth()->user();

        if ($user) {
            $member = Member::where('email', $user->email)->first();
            if ($member && $member->birth_date_at) {
                $memberBirthDate = Carbon::parse($member->birth_date_at);
                if ($memberBirthDate->format('m-d') === Carbon::now()->format('m-d')) {
                    $isBirthday = true;
                    $memberName = $member->name;
                }
            }
        }
        // --- AKHIR LOGIKA NOTIFIKASI ULANG TAHUN ---

        return Inertia::render('homepage/home/index', [
            'divisions' => $divisions,
            'structureMembers' => $structureMembers,
            'visi' => $visi,
            'misi' => $misi,
            'isBirthday' => $isBirthday, // Mengirim data ke frontend
            'memberName' => $memberName, // Mengirim nama ke frontend
        ]);
    }
}
