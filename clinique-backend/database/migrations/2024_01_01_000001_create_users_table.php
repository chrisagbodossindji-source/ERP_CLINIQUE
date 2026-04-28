<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $刻) {
            $刻->id();
            $刻->string('name');
            $刻->string('email')->unique();
            $刻->string('password');
            $刻->enum('role', ['admin', 'medecin', 'infirmier', 'receptionniste', 'caissier', 'comptable']);
            $刻->string('telephone')->nullable();
            $刻->string('specialite')->nullable();
            $刻->boolean('is_active')->default(true);
            $刻->timestamp('last_login_at')->nullable();
            $刻->rememberToken();
            $刻->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
