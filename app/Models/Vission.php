<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Vission extends Model
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
     * Mendapatkan periode yang memiliki visi ini.
     */
    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }
}
