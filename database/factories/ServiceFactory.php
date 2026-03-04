<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        // Ensure the storage/services folder exists
        Storage::disk('public')->makeDirectory('services');

        // Function to create a fully black image and save it
        $storeImage = function (int $width = 600, int $height = 600) {
            $filename = Str::uuid() . '.jpg';
            $path = 'services/' . $filename;

            // Create a blank image
            $im = imagecreatetruecolor($width, $height);

            // Fill background with black
            $black = imagecolorallocate($im, 0, 0, 0);
            imagefilledrectangle($im, 0, 0, $width, $height, $black);

            // Optional: Add white "Service" text in the center
            $textColor = imagecolorallocate($im, 255, 255, 255);
            $fontSize = 5; // GD built-in font size
            $text = 'Service';
            $textWidth = imagefontwidth($fontSize) * strlen($text);
            $textHeight = imagefontheight($fontSize);
            imagestring($im, $fontSize, ($width - $textWidth) / 2, ($height - $textHeight) / 2, $text, $textColor);

            // Output image to a variable
            ob_start();
            imagejpeg($im);
            $imageData = ob_get_clean();
            imagedestroy($im);

            // Save to storage
            Storage::disk('public')->put($path, $imageData);

            return $path;
        };

        return [
            'name' => $this->faker->unique()->words(3, true),
            'description' => $this->faker->paragraphs(3, true),
            'price' => $this->faker->randomFloat(2, 100, 2000),
            'is_price_visible' => $this->faker->boolean(80),
            'is_active' => $this->faker->boolean(90),
            'duration' => $this->faker->numberBetween(30, 180),

            // Generate full black images
            'cover_image' => $storeImage(1200, 600), // Rectangle
            'image_one' => $storeImage(600, 600),    // Square
            'image_two' => $storeImage(600, 600),    // Square
        ];
    }

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