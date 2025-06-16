<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Division extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];

    public function periodDivisions()
    {
        return $this->hasMany(PeriodDivision::class);
    }

    public function periods()
    {
        return $this->belongsToMany(Period::class, 'period_divisions');
    }
}
