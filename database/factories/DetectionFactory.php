<?php

namespace Database\Factories;

use App\Models\Detection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Detection>
 */
class DetectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'plate' => fake()->bothify('ND? ####'),
            'camera' => 'CAM-01',
            'location' => 'Jalan Dato Undang',
            'vehicle' => 'Sedan',
            'confidence' => 98.5,
            'status' => 'Pending',
            'watchlisted' => false,
            'captured_at' => now(),
        ];
    }
}
