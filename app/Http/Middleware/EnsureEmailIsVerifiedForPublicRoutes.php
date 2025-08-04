<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerifiedForPublicRoutes
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated AND their email is not verified
        if (Auth::check() && !Auth::user()->hasVerifiedEmail()) {
            // If the current route is not the verification notice page itself,
            // or the verification send/verify routes, then redirect to the verification notice.
            if (!$request->routeIs('verification.notice') && !$request->routeIs('verification.send') && !$request->routeIs('verification.verify') && !$request->routeIs('logout')) {
                // Also allow logout
                return redirect()->route('verification.notice');
            }
        }

        return $next($request);
    }
}
