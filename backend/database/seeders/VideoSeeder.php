<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Resource;
use Illuminate\Support\Facades\File;

class VideoSeeder extends Seeder
{
    public function run()
    {
        $jsonPath = base_path('videos.txt');
        if (!File::exists($jsonPath)) {
            $this->command->error("File not found: $jsonPath");
            return;
        }

        $content = File::get($jsonPath);
        // Skip the first line "Found X videos."
        $jsonStart = strpos($content, '[');
        if ($jsonStart === false) {
            $this->command->error("Invalid file format");
            return;
        }

        $json = substr($content, $jsonStart);
        $videos = json_decode($json, true);

        if (!$videos) {
            $this->command->error("JSON Decode Error: " . json_last_error_msg());
            return;
        }

        foreach ($videos as $video) {
            Resource::updateOrCreate(
                ['link' => $video['url'] ?? ''],
                [
                    'title' => $video['title'] ?? 'Unknown',
                    'type' => 'video',
                    'category' => 'Youtube',
                    'description' => 'Published: ' . ($video['publishedTime'] ?? '') . ' | Views: ' . ($video['viewCount'] ?? ''),
                    'thumbnail' => $video['thumbnail'] ?? '',
                    'isPublished' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info('Seeded ' . count($videos) . ' videos from YouTube.');
    }
}
