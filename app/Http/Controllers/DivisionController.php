<?php

namespace App\Http\Controllers;

use App\Models\Division;
use App\Services\DivisionService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class DivisionController extends Controller
{
  protected $divisionService;

    public function __construct(DivisionService $divisionService)
    {
        $this->divisionService = $divisionService;
    }

    public function index()
    {
        $divisions = $this->divisionService->getAllDivisions();
        return inertia('divisions/index', [
            'divisions' => $divisions
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:50'
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
            $validated = $request->validate([
                'name' => 'required|string|max:50|'
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
}
