<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class LigneOrdonnance extends Model {
    protected $table = 'lignes_ordonnance';
    public $timestamps = false;
    protected $fillable = ['ordonnance_id', 'medicament', 'dosage', 'frequence', 'duree', 'instructions'];
    public function ordonnance() { return $this->belongsTo(Ordonnance::class); }
}
