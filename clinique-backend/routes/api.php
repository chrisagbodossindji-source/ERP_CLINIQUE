<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\DossierMedicalController;
use App\Http\Controllers\OrdonnanceController;
use App\Http\Controllers\CertificatController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\StatistiqueController;
use App\Http\Controllers\AssuranceController;
use App\Http\Controllers\TarifController;
use Illuminate\Support\Facades\Route;

// Publiques
Route::post('/login', [AuthController::class, 'login']);

// Auth (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin Only
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive']);
        Route::post('/users/{user}/reset-password', [UserController::class, 'resetPassword']);
        Route::apiResource('assurances', AssuranceController::class);
        Route::apiResource('tarifs', TarifController::class);
        
        Route::get('/logs', [\App\Http\Controllers\ActionLogController::class, 'index']);
        Route::get('/roles', [\App\Http\Controllers\RoleController::class, 'index']);
    });

    // Patients (Multi-role)
    Route::middleware('role:admin,receptionniste,medecin,infirmier')->group(function () {
        Route::apiResource('patients', PatientController::class);
        Route::patch('/patients/{patient}/archive', [PatientController::class, 'archive']);
    });

    // Consultations : Accès partagé pour index/show
    Route::middleware('role:admin,receptionniste,medecin,infirmier,caissier,comptable')->group(function () {
        Route::get('/consultations', [ConsultationController::class, 'index']);
        Route::get('/consultations/{consultation}', [ConsultationController::class, 'show']);
    });

    // Consultations : Création (Réceptionniste & Admin)
    Route::middleware('role:receptionniste,admin')->group(function () {
        Route::post('/consultations', [ConsultationController::class, 'store']);
    });

    // Consultations : Constantes et Orientation (Infirmier & Admin)
    Route::middleware('role:infirmier,admin')->group(function () {
        Route::get('/infirmier/medecins', [UserController::class, 'getMedecins']);
        Route::patch('/consultations/{consultation}/statut', [ConsultationController::class, 'updateStatut']);
        Route::patch('/consultations/{consultation}/constantes', [ConsultationController::class, 'updateConstantes']);
        Route::post('/consultations/{consultation}/assigner-medecin', [ConsultationController::class, 'assignMedecin']);
    });

    // Dossier médical (Médecin)
    Route::middleware('role:medecin,admin')->group(function () {
        Route::get('/consultations/{id}/dossier', [DossierMedicalController::class, 'show']);
        Route::post('/consultations/{id}/dossier', [DossierMedicalController::class, 'store']);
        Route::patch('/consultations/{consultation}/statut', [ConsultationController::class, 'updateStatut']);
    });

    // Ordonnances (Médecin)
    Route::middleware('role:medecin,admin')->group(function () {
        Route::post('/consultations/{id}/ordonnances', [OrdonnanceController::class, 'store']);
        Route::get('/ordonnances/{id}', [OrdonnanceController::class, 'show']);
        Route::patch('/ordonnances/{id}/imprimer', [OrdonnanceController::class, 'markPrinted']);
    });

    // Certificats (Médecin)
    Route::middleware('role:medecin,admin')->group(function () {
        Route::post('/consultations/{id}/certificats', [CertificatController::class, 'store']);
        Route::get('/certificats/{id}', [CertificatController::class, 'show']);
    });

    // Facturation (Caissier / Comptable / Admin)
    Route::middleware('role:caissier,comptable,admin')->group(function () {
        Route::get('/factures', [FactureController::class, 'index']);
        Route::get('/paiements', [\App\Http\Controllers\PaiementController::class, 'index']);
        Route::get('/consultations/{id}/facture', [FactureController::class, 'show']);
        Route::post('/factures/{id}/lignes', [FactureController::class, 'addLigne']);
        Route::delete('/factures/{facture}/lignes/{ligne}', [FactureController::class, 'removeLigne']);
        Route::post('/factures/{id}/paiements', [FactureController::class, 'enregistrerPaiement']);
    });

    // Normalisation (Comptable / Admin)
    Route::middleware('role:comptable,admin')->group(function () {
        Route::patch('/factures/{id}/normaliser', [FactureController::class, 'normaliser']);
    });

    // Statistiques
    Route::middleware('role:admin,comptable,receptionniste')->group(function () {
        Route::get('/statistiques/dashboard', [StatistiqueController::class, 'dashboard']);
    });
});
