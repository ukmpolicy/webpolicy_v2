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

class MembersImport implements ToModel, WithHeadingRow, SkipsEmptyRows, WithBatchInserts, WithChunkReading, WithValidation
{
    private $periodId;

    public function __construct(int $periodId)
    {
        $this->periodId = $periodId;
    }

    public function model(array $row)
    {
        // Periksa apakah NIM kosong, jika ya, lewati baris ini.
        if (empty($row['nim'])) {
            return null;
        }

        // --- Logika Baru ---
        // Jika email kosong, buat email unik dengan format '[NIM]@invalid.com'
        $email = $row['email'] ?? null;
        if (empty($email)) {
            $email = $row['nim'] . '@invalid.com';
        }

        // Pengecekan duplikasi yang lebih baik:
        // Cek apakah email yang baru dibuat sudah ada di database
        $existingMember = Member::where('nim', $row['nim'])->orWhere('email', $email)->first();
        if ($existingMember) {
            return null;
        }
        // --- Akhir Logika Baru ---

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

        return new Member([
            'period_id' => $this->periodId,
            'name' => $row['nama'] ?? null,
            'nim' => $row['nim'] ?? null,
            'email' => $email,
            'no_wa' => $row['no_wa'] ?? null,
            'address' => $row['alamat'] ?? null,
            'department' => $row['jurusan'] ?? null,
            'study_program' => $row['program_studi'] ?? null,
            'joined_college_on' => $row['tahun_masuk'] ?? null,
            'graduated_college_on' => $graduatedCollegeOn,
            'born_at' => $row['tempat_lahir'] ?? null,
            'birth_date_at' => $birthDate,
        ]);
    }

    public function rules(): array
    {
        return [
            '*.nama' => 'required',
            '*.nim' => 'required|numeric',
            '*.email' => 'nullable',
            '*.tahun_masuk' => 'nullable|numeric',
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
