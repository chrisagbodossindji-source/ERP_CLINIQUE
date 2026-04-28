<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Certificat extends Model {
    protected $fillable = ['consultation_id', 'medecin_id', 'patient_id', 'type', 'numero_certificat', 'motif', 'date_debut', 'date_fin', 'contenu'];
    protected $casts = ['date_debut' => 'date', 'date_fin' => 'date'];
    protected static function boot() {
        parent::boot();
        static::creating(function ($cert) {
            if (!$cert->numero_certificat) {
                $count = static::whereYear('created_at', date('Y'))->count() + 1;
                $cert->numero_certificat = 'CERT-' . date('Y') . '-' . str_pad($count, 5, '0', STR_PAD_LEFT);
            }
        });
    }
    public function consultation() { return $this->belongsTo(Consultation::class); }
    public function medecin() { return $this->belongsTo(User::class, 'medecin_id'); }
    public function patient() { return $this->belongsTo(Patient::class); }
}
