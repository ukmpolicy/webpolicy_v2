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

    public function index()
    {
        $members = $this->memberService->getAllMembers();
        $periods = Period::all();

        return Inertia::render('members/index', [
            'members' => $members,
            'periods' => $periods,
            'oldInput' => session('errors') ? (object) session('errors')->getBag('default')->getMessages() : null,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'period_id' => 'required|exists:periods,id',
                'picture' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
                'name' => 'required|string|max:50',
                'nim' => 'required|string|max:50|unique:members,nim',
                'address' => 'required|string|max:255',
                'email' => 'required|email|max:50|unique:members,email',
                'department' => 'required|string|max:255',
                'study_program' => 'required|string|max:255',
                'joined_college_on' => 'required|integer',
                'graduated_college_on' => 'nullable|integer',
                'born_at' => 'nullable|string|max:50',
                'birth_date_at' => 'nullable|date',
            ]);

            $this->memberService->createMember($data);
            return redirect()->back()->with('success', 'Member created!');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput($request->except('picture'));
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'period_id' => 'required|exists:periods,id',
                'picture' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
                'name' => 'required|string|max:50',
                'nim' => ['required', 'string', 'max:50', Rule::unique('members', 'nim')->ignore($id)],
                'address' => 'required|string|max:255',
                'email' => ['required', 'email', 'max:50', Rule::unique('members', 'email')->ignore($id)],
                'department' => 'required|string|max:255',
                'study_program' => 'required|string|max:255',
                'joined_college_on' => 'required|integer',
                'graduated_college_on' => 'nullable|integer',
                'born_at' => 'nullable|string|max:50',
                'birth_date_at' => 'nullable|date',
            ]);

            $this->memberService->updateMember($id, $data);
            return redirect()->back()->with('success', 'Member updated!');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    public function destroy($id)
    {
        $this->memberService->deleteMember($id);
        return redirect()->back()->with('success', 'Member deleted!');
    }
}
