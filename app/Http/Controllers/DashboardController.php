<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateDetectionRequest;
use App\Models\Detection;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $detections = Detection::orderByDesc('captured_at')->get();

        return Inertia::render('Dashboard', [
            'detections' => $detections,
            'urls' => [
                'logout' => route('logout'),
                'updates' => $detections->mapWithKeys(fn (Detection $detection): array => [$detection->id => route('detections.update', $detection)]),
            ],
        ]);
    }

    public function update(UpdateDetectionRequest $request, Detection $detection): JsonResponse
    {
        $detection->update($request->validated());

        return response()->json($detection);
    }
}
