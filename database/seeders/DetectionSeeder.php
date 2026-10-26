<?php

namespace Database\Seeders;

use App\Models\Detection;
use Illuminate\Database\Seeder;

class DetectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plates = ['NDF 8214', 'VKL 3098', 'NCW 5521', 'WXY 1806', 'JTR 7290', 'NDA 4682', 'BQM 9012', 'NCK 2338', 'VBP 6571', 'NCS 1184', 'WTD 8823', 'NDL 4509'];
        $locations = ['Jalan Dato Undang', 'Dataran Kuala Pilah', 'Jalan Seremban', 'Pasar Awam Kuala Pilah'];
        foreach ($plates as $index => $plate) {
            Detection::updateOrCreate(['plate' => $plate], [
                'camera' => 'CAM-'.str_pad((string) (($index % 4) + 1), 2, '0', STR_PAD_LEFT),
                'location' => $locations[$index % 4],
                'vehicle' => ['Sedan', 'SUV', 'Hatchback', 'Sedan'][$index % 4],
                'confidence' => [99.2, 98.7, 87.4, 99.6, 96.8, 99.1][$index % 6],
                'status' => $index % 3 === 2 ? 'Pending' : 'Verified',
                'watchlisted' => in_array($index, [1, 7]),
                'captured_at' => '2026-10-23 02:'.str_pad((string) (42 - $index * 3), 2, '0', STR_PAD_LEFT).':'.str_pad((string) (($index * 7 + 16) % 60), 2, '0', STR_PAD_LEFT),
                'notes' => 'Illustrative demo capture. No live camera or OCR service connected.',
            ]);
        }
    }
}
