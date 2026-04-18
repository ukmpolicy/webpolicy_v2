<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dokumen_pendaftaran', function (Blueprint $table) {
            $table->id();

            // Relasi ke pendaftar
            $table->foreignId('pendaftaran_id')
                ->constrained('pendaftaran')
                ->onDelete('cascade');

            // Relasi ke jenis berkas (master config)
            $table->foreignId('jenis_berkas_id')
                ->constrained('jenis_berkas')
                ->onDelete('restrict'); // Jenis berkas tidak bisa dihapus jika sudah ada upload

            // Path file yang tersimpan di storage
            $table->string('file_path', 500);

            // Nama file asli saat diupload
            $table->string('original_name', 255)->nullable();

            // Satu pendaftar hanya bisa upload 1 file per jenis berkas
            $table->unique(['pendaftaran_id', 'jenis_berkas_id'], 'unique_dokumen_per_pendaftaran');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dokumen_pendaftaran');
    }
};
