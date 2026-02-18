<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Quote;
use App\Models\Mood;
use Illuminate\Support\Facades\File;

class QuoteSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Baca file JSON
        $jsonPath = database_path('data/quotes.json');

        if (!File::exists($jsonPath)) {
            $this->command->error("File quotes.json tidak ditemukan!");
            return;
        }

        $json = File::get($jsonPath);
        $quotesData = json_decode($json, true);

        // 2. Ambil semua mood dan jadikan slug sebagai "kunci" (Key) untuk pencarian instan
        // Ini mencegah N+1 Query Problem saat Seeding
        $allMoods = Mood::all()->keyBy('slug');

        $this->command->info('Memulai import ' . count($quotesData) . ' quotes...');

        // 3. Looping dan Insert ke Database
        // 3. Looping dan Insert ke Database dengan Defensive Programming
        foreach ($quotesData as $index => $data) {

            // CLEAN CODE: Validasi apakah struktur JSON-nya benar
            // Jika key 'content' tidak ada, kita lewati baris ini dan beritahu di terminal
            if (!isset($data['content'])) {
                $this->command->warn("Data ke-" . ($index + 1) . " dilewati karena tidak memiliki key 'content'.");
                continue;
            }

            $quote = Quote::create([
                'content' => $data['content'],
                'author' => $data['author'] ?? 'Anonim',
            ]);

            // Mapping id mood berdasarkan slug yang ada di JSON
            $moodIds = [];
            // Pastikan key 'moods' ada dan berupa array sebelum di-looping
            if (isset($data['moods']) && is_array($data['moods'])) {
                foreach ($data['moods'] as $slug) {
                    if (isset($allMoods[$slug])) {
                        $moodIds[] = $allMoods[$slug]->id;
                    }
                }
            }

            // Pasangkan quote dengan mood-nya (Tabel Pivot)
            if (!empty($moodIds)) {
                $quote->moods()->attach($moodIds);
            }
        }

        $this->command->info('Berhasil menambahkan semua quotes!');
    }
}