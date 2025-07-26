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
            $latestPeriod = Period::latest('id')->first(); // Sesuaikan dengan field yang menandakan 'terbaru'
            $periodId = $latestPeriod?->id;
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
