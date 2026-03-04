<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\File;

class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        $directory = storage_path('app/public/services');

        // Create directory if not exists
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        return [
            'name' => $this->faker->unique()->words(3, true),
            'description' => $this->faker->paragraphs(3, true),
            'price' => $this->faker->randomFloat(2, 100, 2000),
            'is_price_visible' => $this->faker->boolean(80),
            'is_active' => $this->faker->boolean(90),
            'duration' => $this->faker->numberBetween(30, 180),

            // 🖼 Rectangle Cover (1200x600)
            'cover_image' => $this->faker->image(
                $directory,
                1200,
                600,
                'business',
                false
            ),

            // 🖼 Square Image One (600x600)
            'image_one' => $this->faker->image(
                $directory,
                600,
                600,
                'business',
                false
            ),

            // 🖼 Square Image Two (600x600)
            'image_two' => $this->faker->image(
                $directory,
                600,
                600,
                'business',
                false
            ),
        ];
    }

    /**
     * Attach FAQs automatically after creating service
     */
    public function configure()
    {
        return $this->afterCreating(function (Service $service) {
            $faqs = [];

            for ($i = 0; $i < rand(2, 5); $i++) {
                $faqs[] = [
                    'question' => $this->faker->sentence(),
                    'answer' => $this->faker->paragraph(3),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            $service->faqs()->createMany($faqs);
        });
    }
}