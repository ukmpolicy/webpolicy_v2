<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JawabanKuesioner extends Model
{
    protected $table = 'jawaban_kuesioner';

    protected $fillable = [
        'pendaftaran_id',
        'pertanyaan_kuesioner_id',
        'jawaban',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    public function pertanyaan()
    {
        return $this->belongsTo(PertanyaanKuesioner::class, 'pertanyaan_kuesioner_id');
    }
}
