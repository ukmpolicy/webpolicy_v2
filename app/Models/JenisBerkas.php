<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisBerkas extends Model
{
    protected $table = 'jenis_berkas';

    protected $fillable = [
        'nama',
        'label',
        'keterangan',
        'is_required',
        'is_active',
        'urutan',
    ];

    protected function casts(): array
    {
        return [
            'is_required' => 'boolean',
            'is_active'   => 'boolean',
        ];
    }

    public function dokumen()
    {
        return $this->hasMany(DokumenPendaftaran::class);
    }

    // Scope: hanya jenis berkas yang aktif
    public function scopeAktif($query)
    {
        return $query->where('is_active', true)->orderBy('urutan');
    }
}
