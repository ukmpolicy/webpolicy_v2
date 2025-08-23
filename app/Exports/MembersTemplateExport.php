<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class MembersTemplateExport implements FromArray, WithHeadings
{
    public function array(): array
    {
        return [];
    }

    public function headings(): array
    {
        return [
            'nama',
            'nim',
            'email',
            'no_wa',
            'alamat',
            'jurusan',
            'program_studi',
            'tahun_masuk',
            'tahun_lulus',
            'tempat_lahir',
            'tanggal_lahir',
            'periode_id',
        ];
    }
}
