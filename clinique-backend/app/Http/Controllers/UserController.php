<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index() { return response()->json(User::all()); }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,medecin,infirmier,receptionniste,caissier,comptable',
            'telephone' => 'nullable',
            'specialite' => 'nullable',
        ]);
        $validated['password'] = Hash::make($validated['password']);
        return response()->json(User::create($validated), 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'role' => 'sometimes|required',
            'telephone' => 'nullable',
            'specialite' => 'nullable',
        ]);
        $user->update($validated);
        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }

    public function toggleActive(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);
        return response()->json($user);
    }

    public function resetPassword(User $user)
    {
        $tempPass = 'Temp@' . rand(1000, 9999);
        $user->update(['password' => Hash::make($tempPass)]);
        return response()->json(['password' => $tempPass]);
    }

    public function getMedecins()
    {
        return response()->json(User::where('role', 'medecin')->where('is_active', true)->get());
    }
}
