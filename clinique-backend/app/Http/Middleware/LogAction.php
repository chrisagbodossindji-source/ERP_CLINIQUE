<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use App\Models\ActionLog;
class LogAction {
    public function handle(Request $request, Closure $next) {
        $response = $next($request);
        if ($request->user()) {
            ActionLog::create([
                'user_id' => $request->user()->id,
                'action' => $request->method(),
                'module' => $request->path(),
                'ip_address' => $request->ip(),
                'description' => 'Accès au module ' . $request->path(),
            ]);
        }
        return $response;
    }
}
