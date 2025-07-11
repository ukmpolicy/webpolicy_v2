<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('structures', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->integer('level')->nullable();
            $table->foreignId('division_id')
                ->nullable()
                ->constrained('divisions')
                ->onDelete('set null');
            $table->foreignId('period_id')
                ->constrained('periods')
                ->onDelete('cascade');
            $table->boolean('has_many_member')
                ->default(false);
            $table->timestamps(); // created_at & updated_at
            $table->softDeletes(); // deleted_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('structures');
    }
};

