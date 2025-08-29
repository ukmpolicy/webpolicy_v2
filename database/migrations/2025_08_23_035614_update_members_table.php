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
        Schema::table('members', function (Blueprint $table) {
            // $table->foreign("period_id")->references("id")->on("periods")->nullable()->nullOnDelete()->change();
            // Hapus foreign key yang sudah ada terlebih dahulu.
            // Nama foreign key ini sesuai dengan konvensi Laravel.
            $table->dropForeign('members_period_id_foreign');

            // Ubah kolom menjadi nullable dan tambahkan foreign key baru
            // dengan perilaku onDelete('set null').
            $table->unsignedBigInteger('period_id')->nullable()->change();
            $table->foreign('period_id')->references('id')->on('periods')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            //
            // Hapus foreign key yang sudah diubah
            $table->dropForeign('members_period_id_foreign');

            // Kembalikan ke keadaan semula
            $table->unsignedBigInteger('period_id')->change();
            $table->foreign('period_id')->references('id')->on('periods')->onDelete('cascade');
        });
    }
};
