<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DokumenBerkas extends Model
{
    use HasFactory;

    protected $table = 'dokumen_berkas';

    protected $fillable = [
        'pendaftaran_id',
        'pas_photo',
        'sertifikat_ppkmb',
        'follow_ig',
        'follow_tiktok',
        'follow_yt',
        'tgl_lahir_doc',
        'bukti_pembayaran',
        'berkas_tambahan_1',
        'berkas_tambahan_2',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }
}
