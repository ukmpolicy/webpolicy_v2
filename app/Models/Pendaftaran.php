<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pendaftaran extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pendaftaran';

    protected $fillable = [
        'user_id', 'period_id',
        'nama', 'nim', 'jurusan', 'prodi', 'alamat', 'tgl_lahir',
        'tempat_lahir', 'jenis_kelamin', 'agama', 'no_wa', 'email',
        'soft_skill', 'pengalaman_organisasi', 'motivasi', 'motto',
        'deskripsi_diri', 'alasan_bergabung', 'makna_logo', 'visi_misi',
        'sejarah_ukm', 'pengetahuan_linux',
        'pas_photo', 'sertifikat_ppkmb', 'follow_ig', 'follow_tiktok',
        'follow_yt', 'tgl_lahir_doc', 'bukti_pembayaran',
        'berkas_tambahan_1', 'berkas_tambahan_2',
        'status', 'feedback',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function period()
    {
        return $this->belongsTo(Period::class);
    }
}
