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
        // $periods = Period::withTrashed()->get(); // Pastikan semua kolom ada
        // return Inertia::render('periods/index', [
        //     'periods' => $periods,
        // ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50|unique:periods,name',
            'started_year' => 'required|integer|min:1900|max:' . (date('Y') + 10),
            'ended_year' => 'required|integer|min:1900|max:' . (date('Y') + 10),
            'is_active' => 'boolean',
        ]);

        // Ubah tahun menjadi format datetime
        $data['started_at'] = $data['started_year'] . '-01-01 00:00:00';
        $data['ended_at'] = $data['ended_year'] . '-01-01 00:00:00';

        unset($data['started_year'], $data['ended_year']);

        $this->periodService->createPeriod($data);
        return redirect()->back()->with('success', 'Periode berhasil ditambahkan!');

        // $this->periodService->createPeriod($data);
        // return redirect()->back()->with('success', 'Period created!');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => "required|string|max:50|unique:periods,name,$id",
            'started_year' => 'required|integer|min:1900|max:' . (date('Y') + 10),
            'ended_year' => 'required|integer|min:1900|max:' . (date('Y') + 10),
            'is_active' => 'boolean',
        ]);

        // Ubah tahun menjadi format datetime
        $data['started_at'] = $data['started_year'] . '-01-01 00:00:00';
        $data['ended_at'] = $data['ended_year'] . '-01-01 00:00:00';

        unset($data['started_year'], $data['ended_year']);

        $this->periodService->updatePeriod($id, $data);
        return redirect()->back()->with('success', 'Periode berhasil diperbarui!');

        // $data = $request->validate([
        //     'name' => 'required|unique:periods,name,' . $id,
        // ]);
        // $this->periodService->updatePeriod($id, $data);
        // return redirect()->back()->with('success', 'Period updated!');
    }

    public function destroy($id)
    {
        $this->periodService->deletePeriod($id);
        return redirect()->back()->with('success', 'Period deleted!');
    }
}
