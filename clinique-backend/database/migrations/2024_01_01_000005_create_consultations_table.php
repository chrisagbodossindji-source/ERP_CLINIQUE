<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained();
            $table->foreignId('receptionniste_id')->nullable()->constrained('users');
            $table->foreignId('infirmier_id')->nullable()->constrained('users');
            $table->foreignId('medecin_id')->nullable()->constrained('users');
            $table->enum('statut', ['en_attente', 'prise_en_charge', 'en_consultation', 'terminee', 'annulee'])->default('en_attente');
            $table->enum('type_operation', ['consultation', 'soin', 'examen']);
            $table->string('motif')->nullable();
            $table->decimal('poids', 5, 2)->nullable();
            $table->decimal('taille', 5, 2)->nullable();
            $table->decimal('temperature', 4, 1)->nullable();
            $table->string('tension')->nullable();
            $table->integer('pouls')->nullable();
            $table->integer('saturation')->nullable();
            $table->text('notes_infirmier')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('consultations'); }
};
