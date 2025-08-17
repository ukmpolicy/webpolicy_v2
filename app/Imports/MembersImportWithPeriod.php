<?php

namespace App\Imports;

use App\Models\Member;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithValidation;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class MembersImportWithPeriod implements ToModel, WithHeadingRow, SkipsEmptyRows, WithBatchInserts, WithChunkReading, WithValidation
{
    public function model(array $row)
    {
        if (empty($row['nim']) || empty($row['email'])) {
             return null;
        }

        $existingMember = Member::where('nim', $row['nim'])->orWhere('email', $row['email'])->first();
        if ($existingMember) {
            return null;
        }

        $birthDate = null;
        if (isset($row['tanggal_lahir'])) {
            try {
                if (is_numeric($row['tanggal_lahir'])) {
                    $birthDate = Date::excelToDateTimeObject($row['tanggal_lahir'])->format('Y-m-d');
                } else {
                    $birthDate = date('Y-m-d', strtotime($row['tanggal_lahir']));
                }
            } catch (\Exception $e) {
                $birthDate = null;
            }
        }

        $graduatedCollegeOn = isset($row['tahun_lulus']) && is_numeric($row['tahun_lulus']) ? (int) $row['tahun_lulus'] : null;
        $periodIdFromExcel = $row['periode_id'] ?? null;
         $pictureFileName = $row['picture'] ?? null;

        return new Member([
            'period_id' => $periodIdFromExcel,
            'name' => $row['nama'] ?? null,
            'nim' => $row['nim'] ?? null,
            'email' => $row['email'] ?? null,
            'no_wa' => $row['no_wa'] ?? null,
            'address' => $row['alamat'] ?? null,
            'department' => $row['jurusan'] ?? null,
            'study_program' => $row['program_studi'] ?? null,
            'joined_college_on' => $row['tahun_masuk'] ?? null,
            'graduated_college_on' => $graduatedCollegeOn,
            'born_at' => $row['tempat_lahir'] ?? null,
            'birth_date_at' => $birthDate,
            'picture' => $pictureFileName,
        ]);
    }

    public function rules(): array
    {
        return [
            '*.nama' => 'required',
            '*.nim' => 'required|numeric',
            '*.email' => 'required|email',
            '*.periode_id' => 'required|exists:periods,id',
            '*.tahun_masuk' => 'nullable|numeric',
            '*.picture' => 'nullable|string',
        ];
    }

    public function batchSize(): int
    {
        return 1000;
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
