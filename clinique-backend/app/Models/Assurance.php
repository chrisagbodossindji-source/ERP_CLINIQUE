<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Assurance extends Model {
    protected $fillable = ['nom', 'code', 'taux_prise_en_charge', 'contact', 'is_active'];
    protected $casts = ['is_active' => 'boolean', 'taux_prise_en_charge' => 'decimal:2'];
}
