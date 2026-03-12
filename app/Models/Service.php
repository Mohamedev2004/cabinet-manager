<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Service extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'is_price_visible' => 'boolean',
    ];

    public function faqs()
    {
        return $this->hasMany(ServiceFaq::class)->orderBy('created_at');
    }

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function getCoverImageUrlAttribute()
    {
        return $this->cover_image ? Storage::disk('public')->url($this->cover_image) : null;
    }

    public function getImageOneUrlAttribute()
    {
        return $this->image_one ? Storage::disk('public')->url($this->image_one) : null;
    }

    public function getImageTwoUrlAttribute()
    {
        return $this->image_two ? Storage::disk('public')->url($this->image_two) : null;
    }
}
