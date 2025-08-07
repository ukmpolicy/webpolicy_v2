<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('members', function (Blueprint $table) {
        // Menambahkan kolom 'no_wa' setelah kolom 'email'
            $table->string('no_wa', 20)->nullable()->after('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
         // Menghapus kolom 'no_wa' jika migrasi di-rollback
            $table->dropColumn('no_wa');
        });
    }
};
