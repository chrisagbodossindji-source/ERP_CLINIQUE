<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('factures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultation_id')->unique()->constrained();
            $table->foreignId('patient_id')->constrained();
            $table->foreignId('caissier_id')->nullable()->constrained('users');
            $table->foreignId('assurance_id')->nullable()->constrained('assurances')->nullOnDelete();
            $table->foreignId('normalise_par')->nullable()->constrained('users');
            $table->string('numero_facture')->unique();
            $table->decimal('montant_total', 10, 2)->default(0);
            $table->decimal('montant_assurance', 10, 2)->default(0);
            $table->decimal('montant_patient', 10, 2)->default(0);
            $table->enum('statut', ['en_attente', 'partiel', 'paye', 'annule'])->default('en_attente');
            $table->timestamp('normalise_le')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('factures'); }
};
