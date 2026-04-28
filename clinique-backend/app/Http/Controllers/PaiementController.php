<?php
namespace App\Http\Controllers;

use App\Models\Paiement;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function index(Request $request)
    {
        $query = Paiement::with(['facture.patient', 'caissier']);
        
        $date = $request->query('date', date('Y-m-d'));
        $query->whereDate('date_paiement', $date);

        return response()->json($query->orderBy('date_paiement', 'desc')->get());
    }
}
