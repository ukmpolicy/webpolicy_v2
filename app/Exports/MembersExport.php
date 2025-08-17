<?php

namespace App\Exports;

use App\Models\Member;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MembersExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle, ShouldAutoSize
{
    protected ?int $periodId;
    protected string $periodName;

    public function __construct(?int $periodId = null, string $periodName = 'Semua Periode')
    {
        $this->periodId = $periodId;
        $this->periodName = $periodName;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection(): Collection
    {
        $query = Member::with('period');

        if ($this->periodId) {
            $query->where('period_id', $this->periodId);
        }

        return $query->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            ['Data Member'],
            ["Periode: {$this->periodName}"],
            [], // Baris kosong untuk pemisah visual
            [
                'ID',
                'Nama',
                'NIM',
                'Email',
                'No. WA',
                'Alamat',
                'Periode',
                'Jurusan',
                'Program Studi',
                'Tahun Masuk',
                'Tahun Lulus',
                'Tempat Lahir',
                'Tanggal Lahir',
                'Dibuat Pada',
                'Diperbarui Pada',
            ]
        ];
    }

    /**
     * @param mixed $member
     * @return array
     */
    public function map($member): array
    {
        return [
            $member->id,
            $member->name,
            $member->nim,
            $member->email,
            $member->no_wa,
            $member->address,
            $member->period->name ?? 'N/A',
            $member->department,
            $member->study_program,
            $member->joined_college_on,
            $member->graduated_college_on,
            $member->born_at,
            $member->birth_date_at,
            $member->created_at,
            $member->updated_at,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Styling untuk judul utama
        $sheet->mergeCells('A1:O1'); // Gabungkan sel dari A1 sampai O1
        $sheet->mergeCells('A2:O2'); // Gabungkan sel dari A2 sampai O2

        $sheet->getStyle('A1')->applyFromArray([
            'font' => ['bold' => true, 'size' => 16],
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER],
        ]);

        $sheet->getStyle('A2')->applyFromArray([
            'font' => ['italic' => true, 'size' => 12],
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER],
        ]);

        // Styling untuk baris header tabel (baris 4)
        $styleHeader = [
            'font' => ['bold' => true],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'E0E0E0'],
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ];

        $sheet->getStyle('A4:O4')->applyFromArray($styleHeader);
    }

    // Perbaikan: Offset data collection agar dimulai dari baris ke-5
    public function startCell(): string
    {
        return 'A5';
    }

    public function title(): string
    {
        return "Data Member ({$this->periodName})";
    }

    public function ShouldAutoSize(): bool
    {
        return true;
    }
}
