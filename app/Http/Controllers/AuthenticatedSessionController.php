<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(Request $request): Response
    {
        return Inertia::render('Login', [
            'status' => $request->session()->get('status'),
            'urls' => ['login' => route('login.store')],
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $key = 'login:'.hash('sha256', strtolower($request->string('username')->trim()->toString()).'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($key, 5)) {
            throw ValidationException::withMessages(['username' => 'Too many sign-in attempts. Please try again in '.RateLimiter::availableIn($key).' seconds.']);
        }

        if (! Auth::attempt(['name' => $request->string('username')->trim()->toString(), 'password' => $request->input('password')], $request->boolean('remember'))) {
            RateLimiter::hit($key, 60);
            throw ValidationException::withMessages(['username' => 'The username or password is incorrect.']);
        }

        RateLimiter::clear($key);
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('status', 'You have been signed out successfully.');
    }
}
