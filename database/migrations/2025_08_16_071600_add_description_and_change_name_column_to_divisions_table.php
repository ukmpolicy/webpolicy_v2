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
        Schema::table('divisions', function (Blueprint $table) {
            // Mengubah panjang kolom 'name' menjadi 255
            $table->string('name', 255)->change();

            // Menambahkan kolom 'description'
            $table->text('description')->nullable()->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('divisions', function (Blueprint $table) {
            // Mengembalikan panjang kolom 'name' ke 50
            $table->string('name', 50)->change();

            // Menghapus kolom 'description'
            $table->dropColumn('description');
        });
    }
};
