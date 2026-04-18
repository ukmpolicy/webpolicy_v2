<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisBerkasSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'nama'        => 'pas_photo',
                'label'       => 'Pas Foto 3x4',
                'keterangan'  => 'Upload foto formal ukuran 3x4 dengan latar belakang merah atau biru. Format: JPG/PNG.',
                'is_required' => true,
                'is_active'   => true,
                'urutan'      => 1,
            ],
            [
                'nama'        => 'sertifikat_ppkmb',
                'label'       => 'Sertifikat PPKMB',
                'keterangan'  => 'Sertifikat Pengenalan Kehidupan Kampus Mahasiswa Baru. Format: JPG/PNG/PDF.',
                'is_required' => true,
                'is_active'   => true,
                'urutan'      => 2,
            ],
            [
                'nama'        => 'follow_ig',
                'label'       => 'Screenshot Follow Instagram',
                'keterangan'  => 'Screenshot bukti sudah follow akun Instagram UKM-POLICY. Format: JPG/PNG.',
                'is_required' => true,
                'is_active'   => true,
                'urutan'      => 3,
            ],
            [
                'nama'        => 'follow_tiktok',
                'label'       => 'Screenshot Follow TikTok',
                'keterangan'  => 'Screenshot bukti sudah follow akun TikTok UKM-POLICY. Format: JPG/PNG.',
                'is_required' => true,
                'is_active'   => true,
                'urutan'      => 4,
            ],
            [
                'nama'        => 'follow_yt',
                'label'       => 'Screenshot Subscribe YouTube',
                'keterangan'  => 'Screenshot bukti sudah subscribe channel YouTube UKM-POLICY. Format: JPG/PNG.',
                'is_required' => true,
                'is_active'   => true,
                'urutan'      => 5,
            ],
            [
                'nama'        => 'bukti_foto_ktm',
                'label'       => 'Foto KTM (Kartu Tanda Mahasiswa)',
                'keterangan'  => 'Foto KTM yang terlihat jelas nama dan NIM. Format: JPG/PNG.',
                'is_required' => true,
                'is_active'   => true,
                'urutan'      => 6,
            ],
            [
                'nama'        => 'bukti_pembayaran',
                'label'       => 'Bukti Pembayaran',
                'keterangan'  => 'Screenshot atau foto bukti transfer biaya pendaftaran. Format: JPG/PNG/PDF.',
                'is_required' => true,
                'is_active'   => true,
                'urutan'      => 7,
            ],
            [
                'nama'        => 'sertifikat_prestasi',
                'label'       => 'Sertifikat Prestasi',
                'keterangan'  => 'Opsional. Upload sertifikat prestasi akademik atau non-akademik jika ada. Format: JPG/PNG/PDF.',
                'is_required' => false,
                'is_active'   => true,
                'urutan'      => 8,
            ],
        ];

        foreach ($data as $item) {
            DB::table('jenis_berkas')->updateOrInsert(
                ['nama' => $item['nama']],
                array_merge($item, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
