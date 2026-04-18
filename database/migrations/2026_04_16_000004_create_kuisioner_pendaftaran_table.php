<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kuisioner_pendaftaran', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke tabel pendaftaran
            $table->foreignId('pendaftaran_id')
                ->constrained('pendaftaran')
                ->onDelete('cascade');

            // Pertanyaan 1: Deskripsikan diri anda dan ceritakan secara singkat
            $table->text('deskripsi_diri')->nullable();

            // Pertanyaan 2: Apa alasan serta tujuan ingin bergabung di UKM-POLICY ?
            $table->text('alasan_bergabung')->nullable();

            // Pertanyaan 3: Jelaskan makna logo UKM-POLICY
            $table->text('makna_logo')->nullable();

            // Pertanyaan 4: Sebutkan visi dan misi UKM-POLICY
            $table->text('visi_misi')->nullable();

            // Pertanyaan 5: Jelaskan sejarah terbentuknya UKM-POLICY
            $table->text('sejarah_ukm')->nullable();

            // Pertanyaan 6: Apa yang kamu ketahui tentang Linux dan Open Source ?
            $table->text('pengetahuan_linux')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kuisioner_pendaftaran');
    }
};
