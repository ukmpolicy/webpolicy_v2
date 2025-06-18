<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Division extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];

    // Mutator untuk memastikan format nama selalu benar
    public function setNameAttribute($value)
    {
        // Normalisasi: lowercase + single space
        $this->attributes['name'] = preg_replace('/\s+/', ' ', strtolower(trim($value)));
    }
    public function periodDivisions()
    {
        return $this->hasMany(PeriodDivision::class);
    }

    public function periods()
    {
        return $this->belongsToMany(Period::class, 'period_divisions');
    }
}
