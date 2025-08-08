<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Role;
use App\Mail\CustomVerifyEmail;
use Illuminate\Support\Facades\Mail;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = ['name', 'email', 'password'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = ['password', 'remember_token'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function setNameAttribute($value)
    {
        // Gantikan spasi ganda dengan spasi tunggal, lalu ubah ke huruf kecil dan hapus spasi awal/akhir
        $cleanName = strtolower(trim(preg_replace('/\s+/', ' ', $value)));
        $this->attributes['name'] = $cleanName;
    }

    public function sendEmailVerificationNotification()
    {
        // Gunakan Mailable kustom Anda di sini
        // $this->notify(new CustomVerifyEmail($this));
        Mail::to($this->email)->send(new CustomVerifyEmail($this));
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
