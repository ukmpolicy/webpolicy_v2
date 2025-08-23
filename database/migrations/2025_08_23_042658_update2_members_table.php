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
            $table->string('name', 255)->nullable()->change();
            $table->string('nim', 50)->nullable()->change();
            $table->string('address', 255)->nullable()->change();
            $table->string('email', 50)->nullable()->change();
            $table->string('department', 255)->nullable()->change();
            $table->string('study_program', 255)->nullable()->change();
            $table->integer('joined_college_on')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            //
        });
    }
};
