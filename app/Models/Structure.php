<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Structure extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'level',
        'division_id',
        'period_id',
        'has_many_member',
    ];

    protected $casts = [
        'has_many_member' => 'boolean',
        'level' => 'float',
    ];

    /**
     * Relasi ke Division
     */
    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    /**
     * Relasi ke Period
     */
    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }
    public function structureMembers()
{
    return $this->hasMany(StructureMember::class);
}

}
