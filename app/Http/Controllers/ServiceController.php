<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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

        return Inertia::render('user/services', [
            'services' => $services,
            'filters' => [
                'search' => $search,
                'perPage' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('user/create-service');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
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
        ]);

        // handle images if uploaded
        foreach (['cover_image', 'image_one', 'image_two'] as $img) {
            if ($request->hasFile($img)) {
                $data[$img] = $request->file($img)->store('services', 'public');
            }
        }

        $faqs = $data['faqs'] ?? null;
        unset($data['faqs']);

        $service = Service::create($data);

        // handle FAQs if any
        if (is_array($faqs)) {
            foreach ($faqs as $faq) {
                $service->faqs()->create($faq);
            }
        }

        return redirect()->route('services.index')->with('success', 'Service created successfully.');
    }

    public function show(Service $service)
    {
        $service->load('faqs');

        return Inertia::render('user/service-details', [
            'service' => $service,
        ]);
    }

    public function edit(Service $service)
    {
        $service->load('faqs');

        return Inertia::render('user/update-service', [
            'service' => $service,
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
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
        ]);

        foreach (['cover_image', 'image_one', 'image_two'] as $img) {
            if ($request->hasFile($img)) {
                $data[$img] = $request->file($img)->store('services', 'public');
            }
        }

        $faqs = $data['faqs'] ?? null;
        unset($data['faqs']);

        $service->update($data);

        // Update FAQs: simple way: delete all then recreate
        if (is_array($faqs)) {
            $service->faqs()->delete();
            foreach ($faqs as $faq) {
                $service->faqs()->create($faq);
            }
        }

        return redirect()->route('services.index')->with('success', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return back()->with('success', 'Service deleted successfully.');
    }

    public function restore($id)
    {
        $service = Service::withTrashed()->findOrFail($id);
        $service->restore();

        return back()->with('success', 'Service restored successfully.');
    }
}
