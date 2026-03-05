<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    /**
     * Show the form for editing the settings.
     */
    public function edit()
    {
        $settings = Setting::first(); // Assuming single row settings

        return Inertia::render('settings/informations', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the settings in storage.
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048', // optional logo
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'ice' => 'nullable|string|max:255',
            'social_links' => 'nullable|array',
            'opening_hours' => 'nullable|array',
        ]);

        $settings = Setting::first();

        if (!$settings) {
            $settings = new Setting();
        }

        $settings->name = $request->name;
        $settings->address = $request->address;
        $settings->phone = $request->phone;
        $settings->email = $request->email;
        $settings->website = $request->website;
        $settings->ice = $request->ice;
        $settings->social_links = $request->social_links ? json_encode($request->social_links) : null;
        $settings->opening_hours = $request->opening_hours ? json_encode($request->opening_hours) : null;

        // Handle logo upload with UUID filename
        if ($request->hasFile('logo')) {
            if ($settings->logo) {
                Storage::delete($settings->logo);
            }
            $logoPath = $request->file('logo')->storeAs(
                'settings',
                Str::uuid() . '.' . $request->file('logo')->getClientOriginalExtension(),
                'public'
                
            );
            $settings->logo = $logoPath;
        }

        $settings->save();

        return redirect()->back()->with('success', 'Settings updated successfully!');
    }
}