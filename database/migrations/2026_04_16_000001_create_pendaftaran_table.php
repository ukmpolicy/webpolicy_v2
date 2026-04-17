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
        Schema::create('pendaftaran', function (Blueprint $table) {
            $table->id();

            // Relasi ke user (login) dan periode open recruitment
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');
            $table->foreignId('period_id')
                ->constrained('periods')
                ->onDelete('cascade');

            // Data diri pendaftar
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

            // Status Pendaftaran dan Feedback Pengurus
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->text('feedback')->nullable();

            // Constraint unik: Satu user / NIM hanya bisa mendaftar 1x di periode yang sama
            $table->unique(['user_id', 'period_id'], 'unique_user_period');
            $table->unique(['nim', 'period_id'], 'unique_nim_period');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran');
    }
};
