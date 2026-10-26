<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateDetectionRequest;
use App\Models\Detection;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        return view('dashboard', ['detections' => Detection::orderByDesc('captured_at')->get()]);
    }

    public function update(UpdateDetectionRequest $request, Detection $detection): JsonResponse
    {
        $detection->update($request->validated());

        return response()->json($detection);
    }
}
