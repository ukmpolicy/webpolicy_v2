<?php

namespace App\Http\Controllers;

use App\Models\Period;
use App\Services\PeriodService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeriodsController extends Controller
{
    protected $periodService;

    public function __construct(PeriodService $periodService)
    {
        $this->periodService = $periodService;
    }

    public function index()
    {
        $periods = $this->periodService->getAllPeriods();
        return Inertia::render('periods/index', [
            'periods' => $periods,
        ]);
    }

    public function store(Request $request)
    {

        $data = $request->validate([
            'name' => 'required|string|max:50|unique:periods,name',
            'started_at' => 'required|date',
            'ended_at' => 'required|date|after_or_equal:started_at',
            'is_active' => 'boolean',
        ]);

        $this->periodService->createPeriod($data);
        return redirect()->back()->with('success', 'Periode berhasil ditambahkan!');


    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => "required|string|max:50|unique:periods,name,$id",
            'started_at' => 'required|date',
            'ended_at' => 'required|date|after_or_equal:started_at',
            'is_active' => 'boolean',
        ]);

        $this->periodService->updatePeriod($id, $data);
        return redirect()->back()->with('success', 'Periode berhasil diperbarui!');


    }

    public function destroy($id)
    {
        $this->periodService->deletePeriod($id);
        return redirect()->back()->with('success', 'Period deleted!');
    }
}
