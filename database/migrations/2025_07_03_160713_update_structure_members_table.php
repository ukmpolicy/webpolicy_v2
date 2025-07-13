<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('structure_members', function (Blueprint $table) {
            $table->string('picture', 255)->nullable()->change();
        });
    }


    public function down()
    {
        Schema::table('structure_members', function (Blueprint $table) {
            $table->string('picture', 50)->change(); 
        });
    }

};
