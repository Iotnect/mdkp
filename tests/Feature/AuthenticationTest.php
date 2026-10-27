<?php

namespace Tests\Feature;

use App\Models\Detection;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use LazilyRefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_login_page_is_available_without_product_branding(): void
    {
        $this->get(route('login'))->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Login')
                ->where('urls.login', route('login.store'))
                ->missing('password'))
            ->assertDontSee('MDKP Vision')->assertDontSee('admin123');
    }

    public function test_guests_cannot_read_dashboard_or_change_evidence(): void
    {
        $detection = Detection::factory()->create();
        $this->get('/')->assertRedirect(route('login'));
        $this->patchJson(route('detections.update', $detection), ['status' => 'Verified'])->assertUnauthorized();
        $this->assertDatabaseHas('detections', ['id' => $detection->id, 'status' => 'Pending']);
    }

    public function test_requested_demo_credentials_sign_in_and_remember_user(): void
    {
        $this->seed(AdminUserSeeder::class);
        $user = User::where('name', 'admin')->firstOrFail();
        $this->assertTrue(Hash::check('admin123', $user->password));
        $this->post(route('login.store'), ['username' => 'admin', 'password' => 'admin123', 'remember' => '1'])
            ->assertRedirect(route('dashboard'))->assertSessionHasNoErrors();
        $this->assertAuthenticatedAs($user);
        $this->assertNotNull($user->fresh()->remember_token);
        $this->get('/')->assertOk()->assertDontSee('MDKP Vision');
        $this->get(route('login'))->assertRedirect(route('dashboard'));
    }

    public function test_incorrect_password_does_not_authenticate(): void
    {
        User::factory()->create(['name' => 'admin', 'password' => 'admin123']);
        $this->from(route('login'))->post(route('login.store'), ['username' => 'admin', 'password' => 'wrong'])
            ->assertRedirect(route('login'))->assertSessionHasErrors(['username' => 'The username or password is incorrect.']);
        $this->assertGuest();
    }

    public function test_login_requires_both_fields(): void
    {
        $this->post(route('login.store'), [])->assertSessionHasErrors(['username', 'password']);
        $this->assertGuest();
    }

    public function test_react_login_receives_validation_feedback_after_a_failed_attempt(): void
    {
        User::factory()->create(['name' => 'admin', 'password' => 'admin123']);

        $this->from(route('login'))->post(route('login.store'), [
            'username' => 'admin',
            'password' => 'incorrect',
        ])->assertRedirect(route('login'));

        $this->get(route('login'))->assertInertia(fn (Assert $page) => $page
            ->component('Login')
            ->where('errors.username', 'The username or password is incorrect.')
            ->missing('password'));
    }

    public function test_login_throttles_after_five_failed_attempts_and_recovers_after_a_minute(): void
    {
        $this->freezeTime();
        User::factory()->create(['name' => 'admin', 'password' => 'admin123']);
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->post(route('login.store'), ['username' => 'admin', 'password' => 'wrong'])->assertSessionHasErrors('username');
        }
        $this->post(route('login.store'), ['username' => 'admin', 'password' => 'admin123'])
            ->assertSessionHasErrors(['username' => 'Too many sign-in attempts. Please try again in 60 seconds.']);
        $this->assertGuest();
        $this->travel(61)->seconds();
        $this->post(route('login.store'), ['username' => 'admin', 'password' => 'admin123'])->assertRedirect(route('dashboard'));
        $this->assertAuthenticated();
    }

    public function test_logout_ends_session_and_protects_dashboard(): void
    {
        $this->actingAs(User::factory()->create())->post(route('logout'))->assertRedirect(route('login'));
        $this->assertGuest();
        $this->get('/')->assertRedirect(route('login'));
    }
}
