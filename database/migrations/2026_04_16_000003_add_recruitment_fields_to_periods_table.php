<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * Menambahkan kolom open recruitment ke tabel periods,
     * agar setiap periode bisa sekaligus menjadi wadah pendaftaran.
     */
    public function up(): void
    {
        Schema::table('periods', function (Blueprint $table) {
            // Apakah periode ini sedang / pernah membuka pendaftaran (open recruitment)
            $table->boolean('is_open_recruitment')->default(false)->after('is_active');

            // Waktu buka dan tutup pendaftaran (berbeda dari periode kepengurusan)
            $table->dateTime('recruitment_started_at')->nullable()->after('is_open_recruitment');
            $table->dateTime('recruitment_ended_at')->nullable()->after('recruitment_started_at');

            // Deskripsi / pengumuman singkat open recruitment
            $table->text('recruitment_description')->nullable()->after('recruitment_ended_at');

            // Kuota maksimal pendaftar (null = tidak dibatasi)
            $table->unsignedInteger('recruitment_quota')->nullable()->after('recruitment_description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('periods', function (Blueprint $table) {
            $table->dropColumn([
                'is_open_recruitment',
                'recruitment_started_at',
                'recruitment_ended_at',
                'recruitment_description',
                'recruitment_quota',
            ]);
        });
    }
};
