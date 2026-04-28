<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class LigneFacture extends Model {
    protected $table = 'lignes_facture';
    public $timestamps = false;
    protected $fillable = ['facture_id', 'tarif_id', 'designation', 'quantite', 'prix_unitaire', 'montant_total'];
    public function facture() { return $this->belongsTo(Facture::class); }
    public function tarif() { return $this->belongsTo(Tarif::class); }
}
