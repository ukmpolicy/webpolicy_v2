<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pertanyaan_kuesioner', function (Blueprint $table) {
            $table->id();

            // Teks pertanyaan yang ditampilkan ke pendaftar
            $table->text('pertanyaan');

            // Apakah pertanyaan ini sedang aktif / ditampilkan di form?
            $table->boolean('is_active')->default(true);

            // Urutan tampil di form kuesioner
            $table->unsignedSmallInteger('urutan')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pertanyaan_kuesioner');
    }
};
