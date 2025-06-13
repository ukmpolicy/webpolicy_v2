<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Period extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'started_at', 'ended_at', 'is_active'];

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
}
