<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Inertia\Inertia;

class StudioController extends Controller
{
    // Route Model Binding otomatis mencari Quote berdasarkan ID
    public function show(Quote $quote)
    {
        // Muat relasi mood untuk fitur "Smart Random Image"
        $quote->load('moods');

        return Inertia::render('Studio', [
            'quote' => $quote
        ]);
    }
}