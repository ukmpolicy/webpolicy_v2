<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StructureMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'picture',
        'department',
        'study_program',
        'structure_id',
        'picture',
    ];

    /**
     * Relasi ke Struktur (Structure)
     */
    public function structure(): BelongsTo
    {
        return $this->belongsTo(Structure::class);
    }
}
