<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pendaftaran', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('period_id')->constrained('periods')->onDelete('cascade');

            // Data Diri
            $table->string('nama', 100);
            $table->string('nim', 30);
            $table->string('jurusan', 150);
            $table->string('prodi', 150);
            $table->string('alamat', 255)->nullable();
            $table->date('tgl_lahir')->nullable();
            $table->string('tempat_lahir', 100)->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->string('agama', 50)->nullable();
            $table->string('no_wa', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->text('soft_skill')->nullable();
            $table->text('pengalaman_organisasi')->nullable();
            $table->text('motivasi')->nullable();
            $table->string('motto', 255)->nullable();

            // Jawaban Kuisioner
            $table->text('deskripsi_diri')->nullable();
            $table->text('alasan_bergabung')->nullable();
            $table->text('makna_logo')->nullable();
            $table->text('visi_misi')->nullable();
            $table->text('sejarah_ukm')->nullable();
            $table->text('pengetahuan_linux')->nullable();

            // Berkas Dokumen
            $table->string('pas_photo')->nullable();
            $table->string('sertifikat_ppkmb')->nullable();
            $table->string('follow_ig')->nullable();
            $table->string('follow_tiktok')->nullable();
            $table->string('follow_yt')->nullable();
            $table->string('tgl_lahir_doc')->nullable();
            $table->string('bukti_pembayaran')->nullable();
            $table->string('berkas_tambahan_1')->nullable();
            $table->string('berkas_tambahan_2')->nullable();

            // Status & Review
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->text('feedback')->nullable();

            $table->unique(['user_id', 'period_id'], 'unique_user_period');
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
