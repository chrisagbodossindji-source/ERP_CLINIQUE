<?php
namespace App\Http\Controllers;

use App\Models\Assurance;
use Illuminate\Http\Request;

class AssuranceController extends Controller
{
    public function index() { return response()->json(Assurance::all()); }
    public function store(Request $request) { return response()->json(Assurance::create($request->all()), 201); }
    public function update(Request $request, Assurance $assurance) { $assurance->update($request->all()); return response()->json($assurance); }
}
