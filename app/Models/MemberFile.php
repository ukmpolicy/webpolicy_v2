<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MemberFile extends Model
{
    protected $fillable = ['member_id', 'filename'];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
