<?php

namespace App\Http\Controllers;

use App\Models\RecruitmentField;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecruitmentFieldController extends Controller
{
    public function indexKuisioner()
    {
        $fields = RecruitmentField::where('type', 'kuisioner')->get();
        return Inertia::render('pendaftaran/settings', [
            'type' => 'kuisioner',
            'title' => 'Pengaturan Form Kuisioner',
            'fields' => $fields
        ]);
    }

    public function indexDokumen()
    {
        $fields = RecruitmentField::where('type', 'dokumen')->get();
        return Inertia::render('pendaftaran/settings', [
            'type' => 'dokumen',
            'title' => 'Pengaturan Dokumen Berkas',
            'fields' => $fields
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:kuisioner,dokumen',
            'name' => 'required|string|unique:recruitment_fields,name|regex:/^[a-z0-9_]+$/',
            'label' => 'required|string',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
        ]);

        RecruitmentField::create($validated);

        return redirect()->back()->with('success', 'Field berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $field = RecruitmentField::findOrFail($id);
        
        $validated = $request->validate([
            'label' => 'required|string',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $field->update($validated);

        return redirect()->back()->with('success', 'Field berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $field = RecruitmentField::findOrFail($id);
        $field->delete();

        return redirect()->back()->with('success', 'Field berhasil dihapus.');
    }
}
