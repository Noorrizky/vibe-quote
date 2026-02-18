<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mood;
use App\Models\Quote;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $selectedMood = $request->query('mood');

        // Ambil atau buat 'seed' unik untuk user ini di sesi ini
        // Agar selama user tidak refresh halaman, urutan 'acak' pagination-nya tetap konsisten
        $seed = $request->session()->get('quote_seed', rand(1, 100));
        if (!$request->has('page')) {
            // Jika user baru buka home atau refresh, ganti seed-nya
            $seed = rand(1, 100);
            $request->session()->put('quote_seed', $seed);
        }

        $quotes = Quote::with('moods')
            ->when($selectedMood, function ($query, $selectedMood) {
            $query->whereHas('moods', function ($q) use ($selectedMood) {
                    $q->where('slug', $selectedMood);
                }
                );
            })
            ->inRandomOrder($seed) // Gunakan seed agar urutan acak konsisten saat pagination
            ->paginate(10)
            ->withQueryString();

        return inertia('Home', [
            'quotes' => $quotes,
            'moods' => Mood::all(),
            'selectedMood' => $selectedMood,
        ]);
    }
}