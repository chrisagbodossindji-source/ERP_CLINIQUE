<?php
namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Facture;
use App\Models\Patient;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    public function index(Request $request)
    {
        $query = Consultation::with(['patient', 'medecin', 'infirmier', 'receptionniste']);
        
        $date = $request->query('date', date('Y-m-d'));
        $query->whereDate('created_at', $date);

        if ($medecin_id = $request->query('medecin_id')) {
            $query->where('medecin_id', $medecin_id);
        }
        if ($statut = $request->query('statut')) {
            $query->where('statut', $statut);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'type_operation' => 'required|in:consultation,soin,examen',
            'motif' => 'nullable',
            'medecin_id' => 'nullable|exists:users,id',
        ]);

        $validated['receptionniste_id'] = $request->user()->id;
        $consultation = Consultation::create($validated);

        // Create empty facture
        $patient = Patient::find($validated['patient_id']);
        Facture::create([
            'consultation_id' => $consultation->id,
            'patient_id' => $patient->id,
            'assurance_id' => $patient->assurance_id,
            'statut' => 'en_attente',
        ]);

        return response()->json($consultation, 201);
    }

    public function updateStatut(Request $request, Consultation $consultation)
    {
        $request->validate(['statut' => 'required|in:en_attente,prise_en_charge,en_consultation,terminee,annulee']);
        $consultation->update(['statut' => $request->statut]);
        
        if ($request->statut == 'prise_en_charge') {
            $consultation->update(['infirmier_id' => $request->user()->id]);
        }
        
        return response()->json($consultation);
    }

    public function updateConstantes(Request $request, Consultation $consultation)
    {
        $validated = $request->validate([
            'poids' => 'nullable|numeric|min:0',
            'taille' => 'nullable|numeric|min:0',
            'temperature' => 'nullable|numeric|min:20|max:50',
            'tension' => 'nullable|string',
            'pouls' => 'nullable|integer|min:0',
            'saturation' => 'nullable|integer|min:0|max:100',
            'notes_infirmier' => 'nullable|string',
        ]);

        $consultation->update($validated);
        return response()->json($consultation);
    }

    public function assignMedecin(Request $request, Consultation $consultation)
    {
        $request->validate(['medecin_id' => 'required|exists:users,id']);
        
        $consultation->update([
            'medecin_id' => $request->medecin_id,
            'statut' => 'en_consultation',
            'infirmier_id' => $request->user()->id // On s'assure que l'infirmier est bien enregistré
        ]);

        return response()->json($consultation);
    }
}
