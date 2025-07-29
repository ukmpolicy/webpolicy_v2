<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DivisionPlan extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'scheduled_at', 'division_id'];
    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }
}
