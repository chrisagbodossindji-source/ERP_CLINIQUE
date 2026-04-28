<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('dossiers_medicaux', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultation_id')->unique()->constrained();
            $table->foreignId('patient_id')->constrained();
            $table->foreignId('medecin_id')->constrained('users');
            $table->text('anamnese')->nullable();
            $table->text('examen_clinique')->nullable();
            $table->text('diagnostic')->nullable();
            $table->text('traitement')->nullable();
            $table->text('observations')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('dossiers_medicaux'); }
};
