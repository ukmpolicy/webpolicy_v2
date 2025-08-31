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
use App\Models\Structure;
use Illuminate\Support\Collection;

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

        if (!$periodId) {
            $periodId = Period::where('is_active', 1)->first()?->id ?? Period::latest()->first()?->id;
        }

        $divisions = $this->divisionService->getAllDivisions($periodId);

        // Ambil struktur yang sudah diurutkan berdasarkan level, dengan filter has_many_member = false
        $structuresWithMembers = Structure::with('structureMembers')
            ->where('period_id', $periodId)
            ->where('has_many_member', false)
            ->orderBy('level', 'asc')
            ->get();

        // Kumpulkan semua anggota dari setiap struktur
        $structureMembers = collect();
        foreach ($structuresWithMembers as $structure) {
            foreach ($structure->structureMembers as $member) {
                // Tambahkan posisi dari nama struktur
                $member->position = $structure->name;
                $structureMembers->push($member);
            }
        }

        // Format ulang data anggota struktural
        $formattedMembers = $structureMembers->map(function ($member) {
            return [
                'id' => $member->id,
                'name' => $member->name,
                'position' => $member->position,
                'picture' => $member->picture ? asset('storage/' . $member->picture) : null,
            ];
        });
      
        // Ambil visi dan misi berdasarkan period_id
        $visi = Vission::where('period_id', $periodId)->pluck('content')->toArray();
        $misi = Mission::where('period_id', $periodId)->pluck('content')->toArray();

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

        return Inertia::render('homepage/home/index', [
            'divisions' => $divisions,
            'structureMembers' => $formattedMembers,
            'visi' => $visi,
            'misi' => $misi,
            'isBirthday' => $isBirthday,
            'memberName' => $memberName,
        ]);
    }
}
