<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model {
    protected $fillable = ['patient_id', 'receptionniste_id', 'infirmier_id', 'medecin_id', 'statut', 'type_operation', 'motif', 'poids', 'taille', 'temperature', 'tension', 'pouls', 'saturation', 'notes_infirmier'];
    
    public function patient() { return $this->belongsTo(Patient::class); }
    public function receptionniste() { return $this->belongsTo(User::class, 'receptionniste_id'); }
    public function infirmier() { return $this->belongsTo(User::class, 'infirmier_id'); }
    public function medecin() { return $this->belongsTo(User::class, 'medecin_id'); }
    public function dossierMedical() { return $this->hasOne(DossierMedical::class); }
    public function ordonnances() { return $this->hasMany(Ordonnance::class); }
    public function certificats() { return $this->hasMany(Certificat::class); }
    public function facture() { return $this->hasOne(Facture::class); }
}
