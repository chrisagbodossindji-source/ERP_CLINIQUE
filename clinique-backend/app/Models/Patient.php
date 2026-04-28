<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model {
    protected $fillable = ['numero_dossier', 'nom', 'prenom', 'date_naissance', 'sexe', 'telephone', 'adresse', 'groupe_sanguin', 'allergies', 'contact_urgence_nom', 'contact_urgence_tel', 'assurance_id', 'numero_assurance', 'archived_at', 'lieu_naissance', 'situation_matrimoniale', 'profession'];
    protected $casts = ['archived_at' => 'datetime', 'date_naissance' => 'date'];
    
    protected static function boot() {
        parent::boot();
        static::creating(function ($patient) {
            if (!$patient->numero_dossier) {
                $count = static::whereYear('created_at', date('Y'))->count() + 1;
                $patient->numero_dossier = 'CLI-' . date('Y') . '-' . str_pad($count, 5, '0', STR_PAD_LEFT);
            }
        });
    }
    
    public function assurance() { return $this->belongsTo(Assurance::class); }
    public function consultations() { return $this->hasMany(Consultation::class); }
}
