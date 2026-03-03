<?php

namespace Tests\Feature\Services;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_update_a_service_basic_fields(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $service = Service::query()->create([
            'name' => 'Initial Name',
            'description' => 'Initial description',
            'price' => 100.00,
            'is_price_visible' => true,
            'is_active' => true,
            'duration' => 30,
        ]);

        $response = $this->put(route('services.update', $service), [
            'name' => 'Updated Name',
            'description' => 'Updated description',
            'price' => 150.50,
            'duration' => 45,
            'is_active' => false,
            'is_price_visible' => false,
            'faqs' => [
                ['question' => 'Q1', 'answer' => 'A1'],
                ['question' => 'Q2', 'answer' => 'A2'],
            ],
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('services.index'));

        $service->refresh();

        $this->assertSame('Updated Name', $service->name);
        $this->assertSame('Updated description', $service->description);
        $this->assertSame(150.50, (float) $service->price);
        $this->assertSame(45, (int) $service->duration);
        $this->assertFalse($service->is_active);
        $this->assertFalse($service->is_price_visible);

        $this->assertCount(2, $service->faqs()->get());
    }
}
