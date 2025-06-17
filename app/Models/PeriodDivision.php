<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PeriodDivision extends Model
{
    protected $fillable = ['period_id', 'division_id'];

    public function period()
    {
        return $this->belongsTo(Period::class);
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}
