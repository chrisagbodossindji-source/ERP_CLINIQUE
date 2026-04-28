<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->string('lieu_naissance')->nullable();
            $table->enum('situation_matrimoniale', ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf/Veuve'])->nullable();
            $table->string('profession')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn(['lieu_naissance', 'situation_matrimoniale', 'profession']);
        });
    }
};
