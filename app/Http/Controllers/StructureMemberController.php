<?php

namespace App\Http\Controllers;

use App\Services\StructureMemberService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StructureMemberController extends Controller
{
    protected $structureMemberService;

    public function __construct(StructureMemberService $structureMemberService)
    {
        $this->structureMemberService = $structureMemberService;
    }

    public function index(Request $request)
    {
        $periods = $this->structureMemberService->getAllPeriods();

        $periodId = $request->query('period_id');
        $structureId = $request->query('structure_id');

        if (!$periodId && $structureId) {
            $periodId = \App\Models\Structure::find($structureId)?->period_id;
        }

        if (!$periodId && $periods->count() > 0) {
            $periodId = $periods->where('is_active', 1)->first()?->id ?? $periods->first()->id;
        }

        $structures = $this->structureMemberService->getAllStructures($periodId);
        $members = $this->structureMemberService->getMembersByPeriodAndStructure($periodId, $structureId);

        return inertia('structure-members/index', [
            'data' => $members,
            'periods' => $periods,
            'structures' => $structures,
            'selectedPeriodId' => $periodId,
            'selectedStructureId' => $structureId,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'department' => 'required|string|max:255',
                'study_program' => 'required|string|max:255',
                'structure_id' => 'required|exists:structures,id',
                'picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            if ($request->hasFile('picture')) {
                $validated['picture'] = $request->file('picture')->store('structure-members', 'public');
            }

            $this->structureMemberService->createMember($validated);

            // Redirect ke halaman structure-members dengan structure_id yang dipilih
            return redirect()->route('structure-members.index', ['structure_id' => $validated['structure_id']])
                ->with('success', 'Structure Member created successfully!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }


    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'department' => 'required|string|max:255',
                'study_program' => 'required|string|max:255',
                'structure_id' => 'required|exists:structures,id',
                'picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            $member = $this->structureMemberService->getById($id);

            // Jika ada file gambar baru diupload
            if ($request->hasFile('picture')) {
                // Hapus gambar lama jika ada
                if ($member->picture && Storage::disk('public')->exists($member->picture)) {
                    Storage::disk('public')->delete($member->picture);
                }

                // Simpan gambar baru
                $validated['picture'] = $request->file('picture')->store('structure-members', 'public');
            } else {
                // Tidak ada gambar baru, gunakan gambar lama
                $validated['picture'] = $member->picture;
            }

            $this->structureMemberService->updateMember($id, $validated);

            return redirect()->route('structure-members.index')->with('success', 'Structure Member updated successfully!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }


    public function destroy($id)
    {
        $this->structureMemberService->deleteMember($id);

        return redirect()->route('structure-members.index')->with('success', 'Structure Member deleted successfully!');
    }
    public function show($id)
    {
        $member = $this->structureMemberService->getByIdWithRelations($id);

        if (!$member) {
            abort(404);
        }

        return Inertia::render('structure-members/show', [
            'structureMember' => $member,
        ]);

    }

}
