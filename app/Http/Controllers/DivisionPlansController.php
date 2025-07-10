<?php

namespace App\Http\Controllers;

use App\Models\Division;
use App\Services\DivisionPlansService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DivisionPlansController extends Controller
{
    protected $divisionPlansService;

    public function __construct(DivisionPlansService $divisionPlansService)
    {
        $this->divisionPlansService = $divisionPlansService;
    }

    public function index(Request $request)
    {
        $divisionId = $request->query('division_id');
        $plans = $this->divisionPlansService->getPlansWithDivision($divisionId);
        $divisions = $this->divisionPlansService->getAllDivisions();

        return inertia('division-plans/index', [
            'division_plans' => $plans,
            'divisions' => $divisions,
            'selected_division_id' => $divisionId,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:50',
                'description' => 'nullable|string',
                'scheduled_at' => 'required|date',
                'division_id' => 'required|exists:divisions,id',
            ]);

            // Format name: lowercase dan satu spasi
            $validated['name'] = strtolower(preg_replace('/\s+/', ' ', trim($validated['name'])));

            $this->divisionPlansService->createPlan($validated);

            // Ambil data terbaru
            $plans = $this->divisionPlansService->getAllPlansWithDivision();
            $divisions = $this->divisionPlansService->getAllDivisions();

            return redirect()
                ->back()
                ->with([
                    'success' => 'Division Plan created successfully!',
                    'division_plans' => $plans, // Data terbaru
                    'divisions' => $divisions,
                ]);
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
                'name' => 'required|string|max:50',
                'description' => 'nullable|string',
                'scheduled_at' => 'required|date',
                'division_id' => 'required|exists:divisions,id',
            ]);

            // Format name: lowercase dan satu spasi
            $validated['name'] = strtolower(preg_replace('/\s+/', ' ', trim($validated['name'])));

            $this->divisionPlansService->updatePlan($id, $validated);

            // return redirect()->back()->with('success', 'Division Plan updated successfully!');
            return redirect()
                ->back()
                ->with([
                    'success' => 'Division Plan updated successfully!',
                    'division_plans' => $this->divisionPlansService->getAllPlansWithDivision(),
                    'divisions' => $this->divisionPlansService->getAllDivisions(),
                ]);
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy($id)
    {
        $this->divisionPlansService->deletePlan($id);

        $plans = $this->divisionPlansService->getAllPlansWithDivision();
        $divisions = $this->divisionPlansService->getAllDivisions();

        return redirect()
            ->back()
            ->with([
                'success' => 'Division Plan deleted successfully!',
                'division_plans' => $plans,
                'divisions' => $divisions,
            ]);
    }
}
