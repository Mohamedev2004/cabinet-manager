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
        $input = $request->all();
        
        // Conversion des booléens
        $input['is_active'] = ($request->is_active === 'yes' || $request->is_active === true);
        $input['is_price_visible'] = ($request->is_price_visible === 'yes' || $request->is_price_visible === true);

        $validatedData = Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric'],
            'is_price_visible' => ['boolean'],
            'is_active' => ['boolean'],
            'duration' => ['nullable', 'integer'],
            'cover_image' => ['nullable', 'image', 'max:2048'],
            'image_one' => ['nullable', 'image', 'max:2048'],
            'image_two' => ['nullable', 'image', 'max:2048'],
        ])->validate();

        // On retire les images du tableau principal pour les gérer séparément
        // Cela évite d'écraser le chemin en base de données par "null"
        $files = ['cover_image', 'image_one', 'image_two'];
        $updateData = collect($validatedData)->except($files)->toArray();

        DB::transaction(function () use ($request, $service, $updateData, $files) {
            // Gestion des fichiers : on ne modifie que si un fichier est présent
            foreach ($files as $img) {
                if ($request->hasFile($img)) {
                    // Supprimer l'ancien fichier s'il existe
                    if ($service->$img) {
                        Storage::disk('public')->delete($service->$img);
                    }
                    // Stocker le nouveau et ajouter au tableau de mise à jour
                    $updateData[$img] = $request->file($img)->store('services', 'public');
                }
            }

            $service->update($updateData);

            // Sync FAQs
            if ($request->has('faqs')) {
                $service->faqs()->delete();
                $service->faqs()->createMany($request->faqs);
            }
        });

        return redirect()->route('services.index')->with('success', 'Service mis à jour.');
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
