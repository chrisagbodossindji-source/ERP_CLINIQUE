<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Tarif extends Model {
    protected $fillable = ['designation', 'categorie', 'prix', 'is_active'];
    protected $casts = ['prix' => 'decimal:2', 'is_active' => 'boolean'];
}
