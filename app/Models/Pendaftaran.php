<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pendaftaran extends Model
{
    use SoftDeletes;

    protected $table = 'pendaftaran';

    protected $fillable = [
        'user_id',
        'period_id',
        'nim',
        'nama',
        'email',
        'jurusan',
        'prodi',
        'alamat',
        'tgl_lahir',
        'tempat_lahir',
        'jenis_kelamin',
        'agama',
        'no_wa',
        'pengalaman_organisasi',
        'motivasi',
        'motto',
        'status',
        'feedback',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'tgl_lahir'   => 'date:Y-m-d',
            'reviewed_at' => 'datetime',
        ];
    }

    // === Relasi ===

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function period()
    {
        return $this->belongsTo(Period::class);
    }

    public function dokumen()
    {
        return $this->hasMany(DokumenPendaftaran::class);
    }

    public function jawaban()
    {
        return $this->hasMany(JawabanKuesioner::class);
    }

    // === Scopes ===

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}
