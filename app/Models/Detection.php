<?php

namespace App\Models;

use Database\Factories\DetectionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['plate', 'camera', 'location', 'vehicle', 'confidence', 'status', 'watchlisted', 'captured_at', 'notes'])]
class Detection extends Model
{
    /** @use HasFactory<DetectionFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return ['captured_at' => 'datetime', 'watchlisted' => 'boolean', 'confidence' => 'float'];
    }
}
