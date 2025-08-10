<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = ['period_id', 'picture', 'name', 'nim', 'address', 'email', 'department', 'study_program', 'joined_college_on', 'graduated_college_on', 'born_at', 'birth_date_at', 'no_wa'];

    protected function casts(): array
    {
        return [
            // Memastikan birth_date_at di-cast sebagai tanggal saja
            'birth_date_at' => 'date:Y-m-d',
        ];
    }

    public function period()
    {
        return $this->belongsTo(Period::class);
    }

    public function files()
    {
        return $this->hasMany(MemberFile::class);
    }
}
