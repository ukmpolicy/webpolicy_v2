<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecruitmentField extends Model
{
    use HasFactory;

    protected $table = 'recruitment_fields';

    protected $fillable = [
        'type',
        'name',
        'label',
        'is_required',
        'is_active',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_active' => 'boolean',
    ];
}
