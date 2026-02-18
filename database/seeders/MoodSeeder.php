<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mood;

class MoodSeeder extends Seeder
{
    public function run(): void
    {
        $moods = [
            ['name' => 'Semangat', 'slug' => 'semangat', 'emoji' => '🚀', 'color_hex' => '#F59E0B'],
            ['name' => 'Santai', 'slug' => 'santai', 'emoji' => '☕', 'color_hex' => '#10B981'],
            ['name' => 'Galau', 'slug' => 'galau', 'emoji' => '🌧️', 'color_hex' => '#3B82F6'],
            ['name' => 'Tenang', 'slug' => 'tenang', 'emoji' => '🧘', 'color_hex' => '#8B5CF6'],
        ];

        foreach ($moods as $mood) {
            Mood::create($mood);
        }
    }
}