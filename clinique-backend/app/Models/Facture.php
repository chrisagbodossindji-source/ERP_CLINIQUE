<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Facture extends Model {
    protected $fillable = ['consultation_id', 'patient_id', 'caissier_id', 'assurance_id', 'normalise_par', 'numero_facture', 'montant_total', 'montant_assurance', 'montant_patient', 'statut', 'normalise_le'];
    protected $casts = ['normalise_le' => 'datetime'];
    protected static function boot() {
        parent::boot();
        static::creating(function ($fac) {
            if (!$fac->numero_facture) {
                $count = static::whereYear('created_at', date('Y'))->count() + 1;
                $fac->numero_facture = 'FAC-' . date('Y') . '-' . str_pad($count, 5, '0', STR_PAD_LEFT);
            }
        });
    }
    public function consultation() { return $this->belongsTo(Consultation::class); }
    public function patient() { return $this->belongsTo(Patient::class); }
    public function caissier() { return $this->belongsTo(User::class, 'caissier_id'); }
    public function assurance() { return $this->belongsTo(Assurance::class); }
    public function normaliseur() { return $this->belongsTo(User::class, 'normalise_par'); }
    public function lignes() { return $this->hasMany(LigneFacture::class); }
    public function paiements() { return $this->hasMany(Paiement::class); }
}
