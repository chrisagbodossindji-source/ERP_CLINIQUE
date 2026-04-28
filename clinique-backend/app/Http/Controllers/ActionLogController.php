<?php
namespace App\Http\Controllers;

use App\Models\ActionLog;
use Illuminate\Http\Request;

class ActionLogController extends Controller
{
    public function index()
    {
        return response()->json(
            ActionLog::with('user:id,name,role')
                ->orderBy('created_at', 'desc')
                ->paginate(50)
        );
    }
}
