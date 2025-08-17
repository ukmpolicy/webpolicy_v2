<?php

namespace App\Http\Controllers;

use App\Models\Division; // Tetap ada karena DivisionController mengelola model Division
use App\Services\DivisionService;
use App\Services\PeriodService; // Import PeriodService
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class DivisionController extends Controller
{
    protected $divisionService;
    protected $periodService; // Deklarasikan properti untuk PeriodService

    // Inject kedua service di konstruktor
    public function __construct(DivisionService $divisionService, PeriodService $periodService)
    {
        $this->divisionService = $divisionService;
        $this->periodService = $periodService; // Inisialisasi PeriodService
    }

    public function index(Request $request)
    {
        $periodId = $request->query('period_id');
        $divisions = $this->divisionService->getAllDivisions($periodId);
        $periods = $this->periodService->getAllPeriods(); // Panggil PeriodService untuk mendapatkan semua periode
        $activePeriod = $this->periodService->getActivePeriod();
        return inertia('divisions/index', [
            'divisions' => $divisions,
            'periods' => $periods, // Kirim periods ke frontend
            'selectedPeriod' => $periodId, // Kirim juga selectedPeriod untuk menjaga state filter
            'activePeriod' => $activePeriod,
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Normalisasi nama: lowercase + single space
            $request->merge(['name' => $this->normalizeDivisionName($request->name)]);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:255',
                'period_id' => 'required|exists:periods,id',
            ]);

            $this->divisionService->createDivision($validated);
            return redirect()->back()->with('success', 'Division created successfully!');
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
            // Normalisasi nama: lowercase + single space
            $request->merge(['name' => $this->normalizeDivisionName($request->name)]);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:255',
                'period_id' => 'required|exists:periods,id',
            ]);

            $this->divisionService->updateDivision($id, $validated);
            return redirect()->back()->with('success', 'Division updated successfully!');
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
        $this->divisionService->deleteDivision($id);
        return redirect()->back()->with('success', 'Division deleted successfully!');
    }

    protected function normalizeDivisionName($name)
    {
        // Ubah ke lowercase dan replace multiple spaces dengan single space
        return preg_replace('/\s+/', ' ', strtolower(trim($name)));
    }
}
