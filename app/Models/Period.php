<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Period extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'started_at', 'ended_at', 'is_active',
        'is_open_recruitment',
        'recruitment_started_at',
        'recruitment_ended_at',
        'recruitment_teaser_at',
        'recruitment_description',
        'recruitment_quota',
    ];

    protected $casts = [
        'is_open_recruitment' => 'boolean',
        'recruitment_started_at' => 'datetime',
        'recruitment_ended_at' => 'datetime',
        'recruitment_teaser_at' => 'datetime',
    ];

    public function members()
    {
        return $this->hasMany(Member::class);
    }

    public function periodDivisions()
    {
        return $this->hasMany(PeriodDivision::class);
    }

    public function divisions()
    {
        return $this->belongsToMany(Division::class, 'period_divisions');
    }

    /**
     * Mendapatkan semua visi untuk periode ini.
     * Nama method harus jamak: vissions()
     */
    public function vissions()
    {
        return $this->hasMany(Vission::class);
    }

    /**
     * Mendapatkan semua misi untuk periode ini.
     * Nama method harus jamak: missions()
     */
    public function missions()
    {
        return $this->hasMany(Mission::class);
    }


     /**
     * Hanya satu periode yang bisa aktif dalam satu waktu
     */
    protected static function booted()
    {
        static::saving(function ($period) {
            if ($period->is_active === true) {
                DB::table('periods')
                    ->where('id', '!=', $period->id)
                    ->update(['is_active' => false]);
            }
        });
    }
}
