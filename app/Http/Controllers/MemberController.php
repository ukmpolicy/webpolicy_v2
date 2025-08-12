<?php
namespace App\Http\Controllers;

use App\Http\Requests\MemberImportRequest;
use App\Http\Requests\MemberStoreRequest;
use App\Imports\MembersImportWithPeriod;
use App\Services\MemberService;
use App\Models\Period;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\MembersExport;
use App\Imports\MembersImport;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Validators\ValidationException as ExcelValidationException;
use Illuminate\Validation\ValidationException as LaravelValidationException;
use Maatwebsite\Excel\HeadingRowImport;

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
            'errors_import' => session('errors_import', []), // Meneruskan errors import ke view
        ]);
    }

    // Metode store baru, menggunakan MemberStoreRequest
    public function store(MemberStoreRequest $request)
    {
        try {
            $validated = $request->validated();
            $this->memberService->createMember($validated);

            return redirect()->back()->with('success', 'Member created successfully!');
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
                'no_wa' => 'required|max:20',
                'department' => 'required|string',
                'study_program' => 'required|string|max:255',
                'joined_college_on' => 'required|integer',
                'graduated_college_on' => 'nullable|integer',
                'born_at' => 'required|string|max:50',
                'birth_date_at' => 'required|date',
            ]);

            $this->memberService->updateMember($id, $validated);

            return redirect()->back()->with('success', 'Member updated successfully!');
        } catch (LaravelValidationException $e) {
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

    public function export(Request $request, string $type)
    {
        // ... (kode export tidak berubah)
        $requestedPeriodId = $request->query('period_id');
        $periodIdToFilter = null;
        $periodName = 'Semua Periode'; // Nilai default

        if ($requestedPeriodId !== 'all' && $requestedPeriodId) {
            $periodIdToFilter = (int) $requestedPeriodId;
            $period = Period::find($periodIdToFilter);
            if ($period) {
                $periodName = $period->name;
            }
        }

        $cleanPeriodName = str_replace(['/', '\\', ' '], '_', $periodName);

        if ($type === 'excel') {
            return Excel::download(new MembersExport($periodIdToFilter, $periodName), "members-{$cleanPeriodName}.xlsx");
        }

        if ($type === 'csv') {
            return Excel::download(new MembersExport($periodIdToFilter, $periodName), "members-{$cleanPeriodName}.csv", \Maatwebsite\Excel\Excel::CSV);
        }

        if ($type === 'pdf') {
            $members = $this->memberService->getAllMembers($periodIdToFilter);
            $pdf = Pdf::loadView('pdf.members', [
                'members' => $members,
                'periodName' => $periodName,
            ])->setPaper('a4', 'landscape');
            return $pdf->download("members-{$cleanPeriodName}.pdf");
        }

        return redirect()->back()->with('error', 'Format ekspor tidak valid.');
    }

    // sudah bisa tapi periode id nya selalu ke 1
    // public function import(MemberImportRequest $request)
    // {
    //     try {
    //         $file = $request->file('file');
    //         $periodId = $request->input('period_id');

    //         if (empty($periodId)) {
    //             $activePeriod = Period::where('is_active', 1)->first();
    //             $periodId = $activePeriod?->id;

    //             if (!$periodId) {
    //                 // Mengirimkan error yang sesuai jika tidak ada periode aktif
    //                 return redirect()
    //                     ->back()
    //                     ->withErrors([
    //                         'errors_import' => ['Periode aktif tidak ditemukan.'],
    //                     ]);
    //             }
    //         }

    //         Excel::import(new MembersImport($periodId), $file);

    //         return redirect()->back()->with('success', 'Data member berhasil diimpor!');
    //     } catch (ExcelValidationException $e) {
    //         $failures = $e->failures();
    //         $errorMessages = [];
    //         foreach ($failures as $failure) {
    //             $row = $failure->row();
    //             $errors = implode(', ', $failure->errors());
    //             $errorMessages[] = "Baris {$row}: {$errors}";
    //         }
    //         return redirect()
    //             ->back()
    //             ->withErrors([
    //                 'errors_import' => $errorMessages,
    //             ]);
    //     } catch (\Exception $e) {
    //         // Gunakan withErrors() di sini juga
    //         return redirect()
    //             ->back()
    //             ->withErrors([
    //                 'errors_import' => ['Terjadi kesalahan: ' . $e->getMessage()],
    //             ]);
    //     }
    // }


    // baru
      public function import(MemberImportRequest $request)
    {
        try {
            $file = $request->file('file');

            // Perbaikan: Gunakan HeadingRowImport untuk cara yang lebih andal
            $headers = (new HeadingRowImport)->toArray($file);
            $hasPeriodIdColumn = in_array('periode_id', $headers[0][0]);

            if ($hasPeriodIdColumn) {
                // Skenario 2: Ambil period_id dari file Excel/CSV
                Excel::import(new MembersImportWithPeriod(), $file);
            } else {
                // Skenario 1: Ambil period_id dari request atau periode aktif
                $periodIdFromRequest = $request->input('period_id');
                if (empty($periodIdFromRequest)) {
                    $activePeriod = Period::where('is_active', 1)->first();
                    $periodIdFromRequest = $activePeriod?->id;
                    if (!$periodIdFromRequest) {
                        return redirect()->back()->withErrors([
                            'errors_import' => ['Periode aktif tidak ditemukan.'],
                        ]);
                    }
                }
                Excel::import(new MembersImport($periodIdFromRequest), $file);
            }

            return redirect()->back()->with('success', 'Data member berhasil diimpor!');
        } catch (ExcelValidationException $e) {
            $failures = $e->failures();
            $errorMessages = [];
            foreach ($failures as $failure) {
                $row = $failure->row();
                $errors = implode(', ', $failure->errors());
                $errorMessages[] = "Baris {$row}: {$errors}";
            }
            return redirect()->back()->withErrors([
                'errors_import' => $errorMessages,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'errors_import' => ['Terjadi kesalahan: ' . $e->getMessage()],
            ]);
        }
    }
}
