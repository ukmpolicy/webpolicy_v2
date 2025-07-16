<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Album extends Model
{
     use SoftDeletes;

    protected $fillable = [
        'name',
        'is_private',
    ];

    protected $casts = [
        'is_private' => 'boolean',
    ];

    public function media(): HasMany
    {
        return $this->hasMany(MediaFile::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
