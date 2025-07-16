<?php

namespace App\Http\Middleware;

use App\Models\RolePermission;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, String $permission): Response
    {
        // dd($permission);
        $user = auth()->user();
        if($user->role_id){
             $permissions = RolePermission::where('role_id', $user->role_id)->join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
                ->select('permissions.key')->get()->toArray();
             if(in_array($permission, array_column($permissions, 'key'))){
                return $next($request);
             };
         }

        // dd($user->role_id);
        return redirect()->route('home')->with('error', 'You do not have permission to access this resource.');

    }
}
