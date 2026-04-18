<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('jenis_berkas', function (Blueprint $table) {
            $table->id();

            // Slug internal (pas_photo, sertifikat_ppkmb, dst.)
            $table->string('nama', 100)->unique();

            // Label yang ditampilkan ke user
            $table->string('label', 150);

            // Instruksi / keterangan upload untuk user
            $table->text('keterangan')->nullable();

            // Apakah berkas ini wajib diupload?
            $table->boolean('is_required')->default(true);

            // Apakah jenis berkas ini sedang aktif / ditampilkan di form?
            $table->boolean('is_active')->default(true);

            // Urutan tampil di form pendaftaran
            $table->unsignedSmallInteger('urutan')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jenis_berkas');
    }
};
