<?php

namespace App\Http\Controllers;

use App\Models\Period;
use App\Models\Structure;
use App\Services\StructureService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class StructureController extends Controller
{
    protected $structureService;

    public function __construct(StructureService $structureService)
    {
        $this->structureService = $structureService;
    }

    public function index(Request $request)
    {
        $sort = $request->query('sort', 'desc');
        $periodId = $request->query('period_id');

        if (!$periodId) {
            $defaultPeriod = Period::where('is_active', 1)->first();
            $periodId = $defaultPeriod?->id;
        }

        $structures = $this->structureService->getAllStructure($request->all());

        return inertia('structures/index', [
            'structures' => $structures,
            'divisions' => $this->structureService->getAllDivisions(),
            'periods' => $this->structureService->getAllPeriods(),
            'sortDirection' => $sort,
            'selectedPeriodId' => $periodId,
            'activePeriod' => Period::find($periodId),
        ]);
    }

    
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:50',
                'level' => 'nullable|numeric',
                'division_id' => 'nullable|exists:divisions,id',
                'period_id' => 'required|exists:periods,id',
                'has_many_member' => 'boolean',
            ]);

            // Format name & cast level
            $validated['name'] = strtolower(preg_replace('/\s+/', ' ', trim($validated['name'])));
            $validated['level'] = isset($validated['level']) ? (float) $validated['level'] : null;

            $this->structureService->createStructure($validated);

            return redirect()->back()->with('success', 'Structure created successfully!');
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
                'name' => 'required|string|max:50',
                'level' => 'nullable|numeric',
                'division_id' => 'nullable|exists:divisions,id',
                'period_id' => 'required|exists:periods,id',
                'has_many_member' => 'boolean',
            ]);

            $validated['name'] = strtolower(preg_replace('/\s+/', ' ', trim($validated['name'])));
            $validated['level'] = isset($validated['level']) ? (float) $validated['level'] : null;

            $this->structureService->updateStructure($id, $validated);

            return redirect()->back()->with('success', 'Structure updated successfully!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function destroy($id)
    {
        $this->structureService->deleteStructure($id);

        return redirect()->back()->with('success', 'Structure deleted successfully!');
    }

    /**
     * Menghitung level berikutnya berdasarkan period dan (jika ada) division
     */
    public function getNextLevel(Request $request)
    {
        $periodId = $request->query('period_id');
        $divisionId = $request->query('division_id');

        $query = Structure::where('period_id', $periodId);

        if (!$divisionId) {
            $max = $query->whereNull('division_id')->max('level');
            $next = $max ? floor($max) + 1 : 1;
            return response()->json(['level' => number_format($next, 1)]);
        }

        $existing = $query->where('division_id', $divisionId)->get();

        if ($existing->isEmpty()) {
            $lastBase = Structure::where('period_id', $periodId)
                ->whereNull('division_id')
                ->max('level');
            $base = $lastBase ? floor($lastBase) + 1 : 1;

            $level = floatval("{$base}.1");
        } else {
            $base = floor($existing->first()->level);
            $count = $existing->count();
            $level = floatval("{$base}." . ($count + 1));
        }

        return response()->json([
            'level' => number_format($level, 1),
        ]);
    }
public function reorder(Request $request)
{
    $structures = $request->input('data', []);

    foreach ($structures as $item) {
        $structure = Structure::find($item['id']);
        if (!$structure) continue;

        $structure->update([
            'level' => $item['level']
        ]);
    }

    // return response()->json(['message' => 'Struktur berhasil diubah.']);
}


}