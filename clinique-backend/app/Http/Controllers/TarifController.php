<?php
namespace App\Http\Controllers;

use App\Models\Tarif;
use Illuminate\Http\Request;

class TarifController extends Controller
{
    public function index() { return response()->json(Tarif::all()); }
    public function store(Request $request) { return response()->json(Tarif::create($request->all()), 201); }
    public function update(Request $request, Tarif $tarif) { $tarif->update($request->all()); return response()->json($tarif); }
}
