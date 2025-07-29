<?php
namespace App\Http\Controllers;

use App\Services\MemberService;
use App\Models\Period;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    protected $memberService;

    public function __construct(MemberService $memberService)
    {
        $this->memberService = $memberService;
    }

    public function index(Request $request)
    {
        $periods = Period::all();
        $activePeriod = Period::where('is_active', 1)->first();

        $requestedPeriodId = $request->query('period_id');

        $periodIdToFilter = null;
        if ($requestedPeriodId === 'all') {
            $periodIdToFilter = null;
        } elseif ($requestedPeriodId) {
            $periodIdToFilter = (int) $requestedPeriodId;
        } else {
            $periodIdToFilter = $activePeriod?->id;
        }

        $members = $this->memberService->getAllMembers($periodIdToFilter);

        $departments = ['Teknologi Informasi dan Komputer', 'Bisnis', 'Teknik Elektro', 'Teknik Mesin', 'Teknik Sipil', 'Teknik Kimia'];

        return Inertia::render('members/index', [
            'members' => $members,
            'periods' => $periods,
            'departments' => $departments,
            'activePeriodId' => $periodIdToFilter,
            'activePeriod' => $activePeriod,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'period_id' => 'required|exists:periods,id',
                'picture' => 'required|image|max:2048',
                'name' => 'required|string|max:50',
                'nim' => 'required|string|max:50|unique:members,nim',
                'address' => 'required|string|max:255',
                'email' => 'required|email|max:50|unique:members,email',
                'department' => 'required|string',
                'study_program' => 'required|string|max:255',
                'joined_college_on' => 'required|integer',
                'graduated_college_on' => 'nullable|integer',
                'born_at' => 'required|string|max:50',
                'birth_date_at' => 'required|date',
            ]);

            $this->memberService->createMember($validated);
            return redirect()->back()->with('success', 'Member created successfully!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'period_id' => 'required|exists:periods,id',
                'picture' => 'nullable|image|max:2048',
                'name' => 'required|string|max:50',
                'nim' => 'required|numeric|unique:members,nim,' . $id,
                'address' => 'required|string|max:255',
                'email' => 'required|email|max:50|unique:members,email,' . $id,
                'department' => 'required|string',
                'study_program' => 'required|string|max:255',
                'joined_college_on' => 'required|integer',
                'graduated_college_on' => 'nullable|integer',
                'born_at' => 'required|string|max:50',
                'birth_date_at' => 'required|date',
            ]);

            $this->memberService->updateMember($id, $validated);

            return redirect()->back()->with('success', 'Member updated successfully!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()
                ->withErrors([
                    'email' => str_contains($e->getMessage(), 'Email') ? $e->getMessage() : null,
                    'nim' => str_contains($e->getMessage(), 'NIM') ? $e->getMessage() : null,
                    'error' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy($id)
    {
        $this->memberService->deleteMember($id);
        return redirect()->back()->with('success', 'Member deleted successfully!');
    }

    public function show($id)
    {
        $member = $this->memberService->getMember($id);
        return Inertia::render('members/show', [
            'member' => $member,
        ]);
    }
}
