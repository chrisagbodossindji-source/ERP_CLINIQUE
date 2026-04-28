<?php
namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\DossierMedical;
use Illuminate\Http\Request;

class DossierMedicalController extends Controller
{
    public function show($consultationId)
    {
        $dossier = DossierMedical::where('consultation_id', $consultationId)->firstOrFail();
        return response()->json($dossier);
    }

    public function store(Request $request, $consultationId)
    {
        $consultation = Consultation::findOrFail($consultationId);
        $dossier = DossierMedical::updateOrCreate(
            ['consultation_id' => $consultationId],
            array_merge($request->all(), [
                'patient_id' => $consultation->patient_id,
                'medecin_id' => $request->user()->id
            ])
        );
        return response()->json($dossier);
    }
}
