<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PertanyaanKuesionerSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'pertanyaan' => 'Deskripsikan diri anda dan ceritakan secara singkat.',
                'is_active'  => true,
                'urutan'     => 1,
            ],
            [
                'pertanyaan' => 'Apa alasan serta tujuan ingin bergabung di UKM-POLICY?',
                'is_active'  => true,
                'urutan'     => 2,
            ],
            [
                'pertanyaan' => 'Jelaskan makna logo UKM-POLICY.',
                'is_active'  => true,
                'urutan'     => 3,
            ],
            [
                'pertanyaan' => 'Sebutkan visi dan misi UKM-POLICY.',
                'is_active'  => true,
                'urutan'     => 4,
            ],
            [
                'pertanyaan' => 'Jelaskan sejarah terbentuknya UKM-POLICY.',
                'is_active'  => true,
                'urutan'     => 5,
            ],
            [
                'pertanyaan' => 'Apa yang kamu ketahui tentang Linux dan Open Source?',
                'is_active'  => true,
                'urutan'     => 6,
            ],
        ];

        foreach ($data as $item) {
            DB::table('pertanyaan_kuesioner')->updateOrInsert(
                ['pertanyaan' => $item['pertanyaan']],
                array_merge($item, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
