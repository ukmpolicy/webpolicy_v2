<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('jawaban_kuesioner', function (Blueprint $table) {
            $table->id();

            // Relasi ke pendaftar
            $table->foreignId('pendaftaran_id')
                ->constrained('pendaftaran')
                ->onDelete('cascade');

            // Relasi ke pertanyaan (master config)
            $table->foreignId('pertanyaan_kuesioner_id')
                ->constrained('pertanyaan_kuesioner')
                ->onDelete('restrict'); // Pertanyaan tidak bisa dihapus jika sudah ada jawaban

            // Jawaban dari pendaftar
            $table->text('jawaban')->nullable();

            // Satu pendaftar hanya bisa menjawab 1x per pertanyaan
            $table->unique(
                ['pendaftaran_id', 'pertanyaan_kuesioner_id'],
                'unique_jawaban_per_pendaftaran'
            );

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jawaban_kuesioner');
    }
};
