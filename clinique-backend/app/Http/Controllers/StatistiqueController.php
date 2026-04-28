<?php
namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Consultation;
use App\Models\Paiement;
use App\Models\LigneFacture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatistiqueController extends Controller
{
    public function dashboard()
    {
        $today = date('Y-m-d');
        $thisMonth = date('Y-m');

        $stats = [
            'total_patients' => Patient::count(),
            'patients_aujourd_hui' => Patient::whereDate('created_at', $today)->count(),
            'consultations_aujourd_hui' => Consultation::whereDate('created_at', $today)->count(),
            'consultations_en_attente' => Consultation::where('statut', 'en_attente')->count(),
            'recettes_aujourd_hui' => (float) Paiement::whereDate('date_paiement', $today)->sum('montant'),
            'recettes_mois' => (float) Paiement::where('date_paiement', '>=', $thisMonth . '-01')->sum('montant'),
            
            'recettes_par_semaine' => Paiement::select(DB::raw('date(date_paiement) as date'), DB::raw('sum(montant) as total'))
                ->where('date_paiement', '>=', now()->subDays(7))
                ->groupBy('date')
                ->orderBy('date')
                ->get(),

            'consultations_par_mois' => Consultation::select(DB::raw("to_char(created_at, 'YYYY-MM') as mois"), DB::raw('count(*) as count'))
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('mois')
                ->orderBy('mois')
                ->get(),

            'top_actes' => LigneFacture::select('designation', DB::raw('count(*) as count'))
                ->groupBy('designation')
                ->orderByDesc('count')
                ->limit(5)
                ->get(),

            'repartition_paiements' => Paiement::select('mode_paiement', DB::raw('sum(montant) as total'))
                ->where('date_paiement', '>=', $thisMonth . '-01')
                ->groupBy('mode_paiement')
                ->get(),
        ];

        return response()->json($stats);
    }
}
