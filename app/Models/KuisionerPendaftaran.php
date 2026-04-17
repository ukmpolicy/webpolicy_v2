<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KuisionerPendaftaran extends Model
{
    use HasFactory;

    protected $table = 'kuisioner_pendaftaran';

    protected $fillable = [
        'pendaftaran_id',
        'deskripsi_diri',
        'alasan_bergabung',
        'makna_logo',
        'visi_misi',
        'sejarah_ukm',
        'pengetahuan_linux',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }
}
