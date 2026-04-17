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
        // Drop FK lama yang dibuat saat create_members_table (onDelete cascade)
        Schema::table('members', function (Blueprint $table) {
            $table->dropForeign(['period_id']);
        });

        // Ubah period_id jadi nullable agar ON DELETE SET NULL bisa bekerja di MySQL
        Schema::table('members', function (Blueprint $table) {
            $table->unsignedBigInteger('period_id')->nullable()->change();
        });

        // Tambahkan kembali foreign key dengan SET NULL
        Schema::table('members', function (Blueprint $table) {
            $table->foreign('period_id')->references('id')->on('periods')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            // Hapus foreign key jika rollback
            $table->dropForeign(['period_id']);
        });
    }
};
