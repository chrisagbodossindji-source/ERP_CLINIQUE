<?php
namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $query = Patient::whereNull('archived_at')->with('assurance');
        if ($search = $request->query('search')) {
            $query->where(function($q) use ($search) {
                $q->where('nom', 'ilike', "%$search%")
                  ->orWhere('prenom', 'ilike', "%$search%")
                  ->orWhere('numero_dossier', 'ilike', "%$search%");
            });
        }
        return response()->json($query->paginate(20));
    }

    public function show(Patient $patient) { return response()->json($patient->load('assurance')); }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required',
            'prenom' => 'required',
            'date_naissance' => 'required|date',
            'sexe' => 'required|in:M,F',
            'telephone' => 'required',
            'adresse' => 'nullable',
            'groupe_sanguin' => 'nullable',
            'allergies' => 'nullable',
            'contact_urgence_nom' => 'nullable',
            'contact_urgence_tel' => 'nullable',
            'assurance_id' => 'nullable|exists:assurances,id',
            'numero_assurance' => 'nullable',
        ]);
        return response()->json(Patient::create($validated), 201);
    }

    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'nom' => 'sometimes|required',
            'prenom' => 'sometimes|required',
            'date_naissance' => 'sometimes|required|date',
            'sexe' => 'sometimes|required',
            'telephone' => 'sometimes|required',
        ]);
        $patient->update($request->all());
        return response()->json($patient);
    }

    public function archive(Patient $patient)
    {
        $patient->update(['archived_at' => now()]);
        return response()->json($patient);
    }
}
