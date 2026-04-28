<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Ordonnance extends Model {
    protected $fillable = ['consultation_id', 'medecin_id', 'patient_id', 'numero_ordonnance', 'date_validite', 'imprime_le'];
    protected $casts = ['imprime_le' => 'datetime', 'date_validite' => 'date'];
    protected static function boot() {
        parent::boot();
        static::creating(function ($ord) {
            if (!$ord->numero_ordonnance) {
                $count = static::whereYear('created_at', date('Y'))->count() + 1;
                $ord->numero_ordonnance = 'ORD-' . date('Y') . '-' . str_pad($count, 5, '0', STR_PAD_LEFT);
            }
        });
    }
    public function consultation() { return $this->belongsTo(Consultation::class); }
    public function medecin() { return $this->belongsTo(User::class, 'medecin_id'); }
    public function patient() { return $this->belongsTo(Patient::class); }
    public function lignes() { return $this->hasMany(LigneOrdonnance::class); }
}
