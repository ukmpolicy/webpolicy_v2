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
        Schema::create('dokumen_berkas', function (Blueprint $table) {
            $table->id();

            // Relasi ke tabel pendaftaran
            $table->foreignId('pendaftaran_id')
                ->constrained('pendaftaran')
                ->onDelete('cascade');

            // Berkas pas foto
            $table->string('pas_photo', 255)->nullable();

            // Sertifikat / bukti PPKMB (Pengenalan Kehidupan Kampus)
            $table->string('sertifikat_ppkmb', 255)->nullable();

            // Follow media sosial
            $table->string('follow_ig', 255)->nullable();     // Screenshot follow Instagram
            $table->string('follow_tiktok', 255)->nullable(); // Screenshot follow TikTok
            $table->string('follow_yt', 255)->nullable();     // Screenshot subscribe YouTube

            // Bukti tanggal lahir (KTP / KTM / Akte)
            $table->string('tgl_lahir_doc', 255)->nullable();

            // Bukti pembayaran (jika ada biaya pendaftaran)
            $table->string('bukti_pembayaran', 255)->nullable();

            // Kolom generik untuk berkas tambahan di masa depan
            $table->string('berkas_tambahan_1', 255)->nullable();
            $table->string('berkas_tambahan_2', 255)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumen_berkas');
    }
};
