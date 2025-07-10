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
        Schema::create('division_plans', function (Blueprint $table) {
            $table->id();
            $table->string("name", 50);
            $table->text("description")->nullable();
            $table->dateTime("scheduled_at");

            // Foreign key to the divisions table
            $table->foreignId('division_id')
                ->constrained('divisions')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('division_plans');
    }
};
