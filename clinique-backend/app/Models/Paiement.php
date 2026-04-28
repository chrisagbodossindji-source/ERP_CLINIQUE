<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Paiement extends Model {
    protected $fillable = ['facture_id', 'caissier_id', 'montant', 'mode_paiement', 'reference_transaction', 'date_paiement'];
    protected $casts = ['date_paiement' => 'datetime'];
    public function facture() { return $this->belongsTo(Facture::class); }
    public function caissier() { return $this->belongsTo(User::class, 'caissier_id'); }
}
