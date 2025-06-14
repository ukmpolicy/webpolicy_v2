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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('period_id')->constrained('periods')->onDelete('cascade');
            $table->string('picture', length: 225)->nullable();
            $table->string('name', 50);
            $table->string('nim', 50);
            $table->string('address', 255);
            $table->string('email', 50)->unique();
            $table->string('department', 255);
            $table->string('study_program', 255);
            $table->integer('joined_college_on');
            $table->integer('graduated_college_on')->nullable();
            $table->string('born_at', 50)->nullable();
            $table->dateTime('birth_date_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
