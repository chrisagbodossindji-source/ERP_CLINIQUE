<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class DossierMedical extends Model {
    protected $table = 'dossiers_medicaux';
    protected $fillable = ['consultation_id', 'patient_id', 'medecin_id', 'anamnese', 'examen_clinique', 'diagnostic', 'traitement', 'observations'];
    public function consultation() { return $this->belongsTo(Consultation::class); }
    public function patient() { return $this->belongsTo(Patient::class); }
    public function medecin() { return $this->belongsTo(User::class, 'medecin_id'); }
}
