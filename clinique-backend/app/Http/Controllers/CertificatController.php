<?php
namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Certificat;
use Illuminate\Http\Request;

class CertificatController extends Controller
{
    public function store(Request $request, $consultationId)
    {
        $consultation = Consultation::findOrFail($consultationId);
        $certificat = Certificat::create(array_merge($request->all(), [
            'consultation_id' => $consultationId,
            'patient_id' => $consultation->patient_id,
            'medecin_id' => $request->user()->id,
        ]));
        return response()->json($certificat, 201);
    }

    public function show($id) { return response()->json(Certificat::with('patient', 'medecin')->findOrFail($id)); }
}
