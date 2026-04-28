<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('ordonnances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultation_id')->constrained();
            $table->foreignId('medecin_id')->constrained('users');
            $table->foreignId('patient_id')->constrained();
            $table->string('numero_ordonnance')->unique();
            $table->date('date_validite');
            $table->timestamp('imprime_le')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('ordonnances'); }
};
