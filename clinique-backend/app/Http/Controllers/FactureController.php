<?php
namespace App\Http\Controllers;

use App\Models\Facture;
use App\Models\LigneFacture;
use App\Models\Paiement;
use App\Models\Tarif;
use Illuminate\Http\Request;

class FactureController extends Controller
{
    public function index(Request $request)
    {
        $query = Facture::with(['patient', 'caissier', 'lignes']);
        
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }
        
        if ($request->has('normalisee')) {
            $request->normalisee == 'true' 
                ? $query->whereNotNull('normalise_le') 
                : $query->whereNull('normalise_le');
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function show($consultationId)
    {
        $facture = Facture::where('consultation_id', $consultationId)->with(['lignes', 'patient.assurance', 'paiements'])->firstOrFail();
        return response()->json($facture);
    }

    public function addLigne(Request $request, $id)
    {
        $facture = Facture::findOrFail($id);
        $tarif = Tarif::find($request->tarif_id);
        
        $designation = $tarif ? $tarif->designation : $request->designation;
        $prix_unitaire = $tarif ? $tarif->prix : $request->prix_unitaire;
        $quantite = $request->quantite ?? 1;

        $facture->lignes()->create([
            'tarif_id' => $request->tarif_id,
            'designation' => $designation,
            'quantite' => $quantite,
            'prix_unitaire' => $prix_unitaire,
            'montant_total' => $prix_unitaire * $quantite,
        ]);

        $this->recalculer($facture);
        return response()->json($facture->load('lignes'));
    }

    public function removeLigne($factureId, $ligneId)
    {
        $facture = Facture::findOrFail($factureId);
        $facture->lignes()->where('id', $ligneId)->delete();
        $this->recalculer($facture);
        return response()->json($facture->load('lignes'));
    }

    private function recalculer(Facture $facture)
    {
        $total = $facture->lignes()->sum('montant_total');
        $taux = 0;
        if ($facture->assurance_id && $facture->assurance) {
            $taux = $facture->assurance->taux_prise_en_charge;
        } elseif ($facture->patient->assurance_id) {
            $taux = $facture->patient->assurance->taux_prise_en_charge;
        }

        $montant_assurance = ($total * $taux) / 100;
        $montant_patient = $total - $montant_assurance;

        $facture->update([
            'montant_total' => $total,
            'montant_assurance' => $montant_assurance,
            'montant_patient' => $montant_patient,
        ]);
    }

    public function enregistrerPaiement(Request $request, $id)
    {
        $facture = Facture::findOrFail($id);
        $request->validate([
            'montant' => 'required|numeric|min:0',
            'mode_paiement' => 'required|in:especes,mobile_money,carte,virement',
        ]);

        Paiement::create([
            'facture_id' => $id,
            'caissier_id' => $request->user()->id,
            'montant' => $request->montant,
            'mode_paiement' => $request->mode_paiement,
            'reference_transaction' => $request->reference_transaction,
            'date_paiement' => now(),
        ]);

        $deja_paye = $facture->paiements()->sum('montant');
        if ($deja_paye >= $facture->montant_patient) {
            $facture->update(['statut' => 'paye']);
        } else {
            $facture->update(['statut' => 'partiel']);
        }

        return response()->json($facture->load('paiements'));
    }

    public function normaliser(Request $request, $id)
    {
        $facture = Facture::findOrFail($id);
        $facture->update([
            'normalise_par' => $request->user()->id,
            'normalise_le' => now(),
        ]);
        return response()->json($facture);
    }
}
