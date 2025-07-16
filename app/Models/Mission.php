<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mission extends Model
{
     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'content',
        'period_id',
    ];

    /**
     * Mendapatkan periode yang memiliki misi ini.
     */
    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }
}
