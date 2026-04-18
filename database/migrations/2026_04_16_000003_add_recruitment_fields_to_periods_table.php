<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('periods', function (Blueprint $table) {
            $table->boolean('is_open_recruitment')->default(false)->after('is_active');
            $table->dateTime('recruitment_teaser_at')->nullable()->after('is_open_recruitment');
            $table->dateTime('recruitment_started_at')->nullable()->after('recruitment_teaser_at');
            $table->dateTime('recruitment_ended_at')->nullable()->after('recruitment_started_at');
            $table->text('recruitment_description')->nullable()->after('recruitment_ended_at');
            $table->unsignedInteger('recruitment_quota')->nullable()->after('recruitment_description');
        });
    }

    public function down(): void
    {
        Schema::table('periods', function (Blueprint $table) {
            $table->dropColumn([
                'is_open_recruitment',
                'recruitment_teaser_at',
                'recruitment_started_at',
                'recruitment_ended_at',
                'recruitment_description',
                'recruitment_quota',
            ]);
        });
    }
};
