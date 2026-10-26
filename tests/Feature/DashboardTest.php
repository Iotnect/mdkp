<?php

namespace Tests\Feature;

use App\Models\Detection;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use LazilyRefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_dashboard_displays_database_detections(): void
    {
        $this->actingAs(User::factory()->create());
        Detection::factory()->create(['plate' => 'NDF 8214']);
        $this->get('/')->assertOk()->assertSee('MDKP')->assertSee('NDF 8214');
    }

    public function test_review_persists_status_and_notes_without_changing_capture(): void
    {
        $this->actingAs(User::factory()->create());
        $detection = Detection::factory()->create(['plate' => 'NDF 8214']);
        $this->patchJson(route('detections.update', $detection), ['status' => 'Verified', 'notes' => 'Plate checked.', 'plate' => 'CHANGED'])
            ->assertOk()->assertJsonPath('status', 'Verified')->assertJsonPath('plate', 'NDF 8214');
        $this->assertDatabaseHas('detections', ['id' => $detection->id, 'status' => 'Verified', 'notes' => 'Plate checked.', 'plate' => 'NDF 8214']);
    }

    public function test_invalid_review_returns_422_and_preserves_pending_status(): void
    {
        $this->actingAs(User::factory()->create());
        $detection = Detection::factory()->create();
        $this->patchJson(route('detections.update', $detection), ['status' => 'Approved', 'notes' => 'Invalid decision'])
            ->assertUnprocessable()->assertJsonValidationErrors('status');
        $this->assertDatabaseHas('detections', ['id' => $detection->id, 'status' => 'Pending', 'notes' => null]);
    }

    public function test_missing_detection_returns_404(): void
    {
        $this->actingAs(User::factory()->create());
        $this->patchJson('/detections/99999', ['status' => 'Verified'])->assertNotFound();
    }

    public function test_dismissal_persists_and_long_notes_are_rejected(): void
    {
        $this->actingAs(User::factory()->create());
        $detection = Detection::factory()->create();
        $this->patchJson(route('detections.update', $detection), ['status' => 'Dismissed', 'notes' => null])->assertOk();
        $this->assertDatabaseHas('detections', ['id' => $detection->id, 'status' => 'Dismissed']);
        $this->patchJson(route('detections.update', $detection), ['status' => 'Verified', 'notes' => str_repeat('a', 2001)])
            ->assertUnprocessable()->assertJsonValidationErrors('notes');
        $this->assertDatabaseHas('detections', ['id' => $detection->id, 'status' => 'Dismissed']);
    }
}
