<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DokumenPendaftaran extends Model
{
    protected $table = 'dokumen_pendaftaran';

    protected $fillable = [
        'pendaftaran_id',
        'jenis_berkas_id',
        'file_path',
        'original_name',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    public function jenisBerkas()
    {
        return $this->belongsTo(JenisBerkas::class, 'jenis_berkas_id');
    }
}
