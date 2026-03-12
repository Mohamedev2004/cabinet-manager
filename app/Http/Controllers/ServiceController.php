<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $perPage = in_array((int) $request->perPage, [5, 10, 20, 30, 50]) ? (int) $request->perPage : 10;
        $search = $request->search;

        $query = Service::query()->latest();

        if ($search) {
            $query->where('name', 'like', "%$search%");
        }

        $services = $query->paginate($perPage)->withQueryString();

        // Append full image URLs to each service
        $services->getCollection()->transform(function ($service) {
            $service->cover_image_url = $service->cover_image ? Storage::disk('public')->url($service->cover_image) : null;
            $service->image_one_url = $service->image_one ? Storage::disk('public')->url($service->image_one) : null;
            $service->image_two_url = $service->image_two ? Storage::disk('public')->url($service->image_two) : null;
            return $service;
        });

        return Inertia::render('user/services', [
            'services' => $services,
            'filters' => [
                'search' => $search,
                'perPage' => $perPage,
            ],
        ]);
    }

    // ... rest of your controller methods unchanged ...

    public function store(Request $request)
    {
        $input = $request->all();
        foreach (['is_active', 'is_price_visible'] as $key) {
            if (array_key_exists($key, $input)) {
                if ($input[$key] === 'yes') {
                    $input[$key] = true;
                } elseif ($input[$key] === 'no') {
                    $input[$key] = false;
                }
            }
        }

        $data = Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric'],
            'is_price_visible' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'duration' => ['nullable', 'integer'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'image_one' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'image_two' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'faqs' => ['sometimes', 'array'],
            'faqs.*.question' => ['required_with:faqs', 'string', 'max:255'],
            'faqs.*.answer' => ['required_with:faqs', 'string'],
        ])->validate();

        foreach (['cover_image', 'image_one', 'image_two'] as $img) {
            if ($request->hasFile($img)) {
                $data[$img] = $request->file($img)->store('services', 'public');
            }
        }

        $faqs = $data['faqs'] ?? null;
        unset($data['faqs']);

        $service = Service::create($data);

        if (is_array($faqs)) {
            foreach ($faqs as $faq) {
                $service->faqs()->create($faq);
            }
        }

        return redirect()->route('services.index')->with('success', 'Service created successfully.');
    }

    // Similarly for update(), you can keep your existing code unchanged.
}