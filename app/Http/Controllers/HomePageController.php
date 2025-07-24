<?php

namespace App\Http\Controllers;

use App\Services\DivisionService;
use App\Services\StructureMemberService;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

        // Ambil divisi berdasarkan periode (jika diperlukan)
        $divisions = $this->divisionService->getAllDivisions($periodId);

        // Ambil periode default (jika tidak disediakan)
        if (!$periodId) {
            $periodId = \App\Models\Period::where('name', '2024-2025')->first()?->id ?? \App\Models\Period::latest()->first()?->id;
        }

        // Ambil anggota struktural berdasarkan period ID
        $structureMembersRaw = $this->structureMemberService->getMembersByPeriod($periodId);

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

        return Inertia::render('homepage/home/index', [
            'divisions' => $divisions,
            'structureMembers' => $structureMembers,
        ]);
    }
}
