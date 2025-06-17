<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        'period_id', 'picture', 'name', 'nim', 'address', 'email',
        'department', 'study_program', 'joined_college_on', 'graduated_college_on',
        'born_at', 'birth_date_at'
    ];

    public function period()
    {
        return $this->belongsTo(Period::class);
    }

    public function files()
    {
        return $this->hasMany(MemberFile::class);
    }
}
