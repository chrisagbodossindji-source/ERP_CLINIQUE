<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ActionLog extends Model {
    const UPDATED_AT = null;
    protected $fillable = ['user_id', 'action', 'module', 'description', 'ip_address'];
    public function user() { return $this->belongsTo(User::class); }
}
