<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Drop tabel lama (dari FEAT-SetUpDatabase) beserta FK-nya
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('kuisioner_pendaftaran');
        Schema::dropIfExists('dokumen_berkas');
        Schema::dropIfExists('pendaftaran');
        Schema::enableForeignKeyConstraints();

        // Buat ulang tabel pendaftaran dengan schema yang benar
        Schema::create('pendaftaran', function (Blueprint $table) {
            $table->id();

            // === Relasi ===
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('period_id')
                ->constrained('periods')
                ->onDelete('cascade');

            // === Data Diri ===
            $table->string('nim', 30);
            $table->string('nama', 100);
            $table->string('email', 100);
            $table->string('jurusan', 150);
            $table->string('prodi', 150);
            $table->string('alamat', 255)->nullable();
            $table->date('tgl_lahir')->nullable();
            $table->string('tempat_lahir', 100)->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->string('agama', 50)->nullable();
            $table->string('no_wa', 20)->nullable();

            // === Motivasi & Pengalaman ===
            $table->text('pengalaman_organisasi')->nullable();
            $table->text('motivasi')->nullable();
            $table->string('motto', 255)->nullable();

            // === Status & Review oleh Admin ===
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->text('feedback')->nullable();       // Catatan / alasan dari admin
            $table->timestamp('reviewed_at')->nullable(); // Kapan admin me-review

            // === Constraint Unik ===
            // 1 user hanya bisa mendaftar 1x di periode yang sama
            $table->unique(['user_id', 'period_id'], 'unique_user_period');
            // NIM tidak boleh duplikat dalam 1 periode, tapi bisa daftar lagi di periode lain
            $table->unique(['nim', 'period_id'], 'unique_nim_period');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pendaftaran');
    }
};
