<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facture_id')->constrained();
            $table->foreignId('caissier_id')->constrained('users');
            $table->decimal('montant', 10, 2);
            $table->enum('mode_paiement', ['especes', 'mobile_money', 'carte', 'virement']);
            $table->string('reference_transaction')->nullable();
            $table->timestamp('date_paiement');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('paiements'); }
};
