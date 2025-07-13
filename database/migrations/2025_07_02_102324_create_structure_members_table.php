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
        Schema::create('structure_members', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('picture', 50)
                ->nullable();
            $table->string('department', 255);
            $table->string('study_program', 255);
            $table->foreignId('structure_id')
                ->constrained('structures')
                ->onDelete('cascade');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('structure_members');
    }
};
