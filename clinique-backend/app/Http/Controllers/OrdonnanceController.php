<?php
namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Ordonnance;
use Illuminate\Http\Request;

class OrdonnanceController extends Controller
{
    public function store(Request $request, $consultationId)
    {
        $consultation = Consultation::findOrFail($consultationId);
        $ordonnance = Ordonnance::create([
            'consultation_id' => $consultationId,
            'patient_id' => $consultation->patient_id,
            'medecin_id' => $request->user()->id,
            'date_validite' => $request->date_validite ?? now()->addDays(7),
        ]);

        foreach ($request->lignes as $ligne) {
            $ordonnance->lignes()->create($ligne);
        }

        return response()->json($ordonnance->load('lignes'), 201);
    }

    public function show($id) { return response()->json(Ordonnance::with('lignes', 'patient', 'medecin')->findOrFail($id)); }

    public function markPrinted($id)
    {
        $ord = Ordonnance::findOrFail($id);
        $ord->update(['imprime_le' => now()]);
        return response()->json($ord);
    }
}
