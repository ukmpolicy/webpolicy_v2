<?php

namespace App\Http\Controllers;

use App\Services\DivisionService;
use App\Services\StructureMemberService;
use Illuminate\Http\Request;
use App\Models\Period;
use Inertia\Inertia;
use App\Models\Vission;
use App\Models\Mission;

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
<<<<<<<<< Temporary merge branch 1
            $periodId = Period::where('is_active', 1)->first()?->id ??
                Period::latest()->first()?->id;
=========
            $periodId = \App\Models\Period::where('name', '2024-2025')->first()?->id ?? \App\Models\Period::latest()->first()?->id;
>>>>>>>>> Temporary merge branch 2
        }

        // Ambil anggota struktural berdasarkan period ID
        $structureMembersRaw = $this->structureMemberService->getMembersByPeriod($periodId);
<<<<<<<<< Temporary merge branch 1

        // Format ulang data anggota struktural
        $structureMembers = $structureMembersRaw->map(function ($member) {
            return [
                'id' => $member->id,
                'name' => $member->name,
                'position' => $member->structure->name ?? '-',
                // 'department' => $member->department ?? '-',
                // 'study_program' => $member->study_program ?? '-',
                'picture' => $member->picture
                    ? asset('storage/' . $member->picture)
                    : null,
            ];
        });
=========
>>>>>>>>> Temporary merge branch 2

        // Format ulang data anggota struktural
        $structureMembers = $structureMembersRaw->map(function ($member) {
            return [
                'id' => $member->id,
                'name' => $member->name,
                'position' => $member->structure->name ?? '-',
                // 'department' => $member->department ?? '-',
                // 'study_program' => $member->study_program ?? '-',
                'picture' => $member->picture ? asset('storage/' . $member->picture) : null,
            ];
        });

        // Ambil visi dan misi berdasarkan period_id
        $visi = Vission::where('period_id', $periodId)->pluck('content')->first() ?? '';
        $misi = Mission::where('period_id', $periodId)->pluck('content')->toArray();

        return Inertia::render('homepage/home/index', [
            'divisions' => $divisions,
            'structureMembers' => $structureMembers,
            'visi' => $visi,
            'misi' => $misi,
        ]);
    }
}
