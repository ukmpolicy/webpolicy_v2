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
        'user_id',
        'period_id',
        'nama',
        'nim',
        'jurusan',
        'prodi',
        'alamat',
        'tgl_lahir',
        'tempat_lahir',
        'jenis_kelamin',
        'agama',
        'no_wa',
        'email',
        'soft_skill',
        'pengalaman_organisasi',
        'motivasi',
        'motto',
        'status',
        'feedback'
    ];

    /**
     * Relasi ke User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Period
     */
    public function period()
    {
        return $this->belongsTo(Period::class);
    }

    /**
     * Relasi ke Dokumen Berkas
     */
    public function dokumenBerkas()
    {
        return $this->hasOne(DokumenBerkas::class);
    }

    /**
     * Relasi ke Kuisioner
     */
    public function kuisioner()
    {
        return $this->hasOne(KuisionerPendaftaran::class);
    }
}
