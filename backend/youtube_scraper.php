<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('memory_limit', '512M');
ini_set('pcre.backtrack_limit', '10000000');

$html = @file_get_contents('youtube_dump.html');
if ($html === false) {
    die("Failed to read HTML file.\n");
}

// Regex to extract ytInitialData
// Look for 'var ytInitialData = ' and match until ';</script>' OR ';var'
if (preg_match('/var ytInitialData\s*=\s*({.+?});(?:<\/script>|var)/s', $html, $matches)) {
    $json = $matches[1];
    $data = json_decode($json, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "JSON Decode Error: " . json_last_error_msg() . "\n";
        exit(1);
    }

    $videos = [];
    findVideos($data, $videos);

    echo "Found " . count($videos) . " videos.\n";
    echo json_encode($videos, JSON_PRETTY_PRINT);
} else {
    echo "Could not find ytInitialData in HTML.\n";
    // Debug: print first 500 chars (escaped)
    echo "Preview: " . substr(strip_tags($html), 0, 500) . "\n";
}

function findVideos($data, &$videos)
{
    if (is_array($data)) {
        if (isset($data['videoRenderer']) || isset($data['gridVideoRenderer'])) {
            $v = $data['videoRenderer'] ?? $data['gridVideoRenderer'];
            $videoId = $v['videoId'] ?? null;

            if ($videoId) {
                // Extract highest res thumbnail
                $thumbs = $v['thumbnail']['thumbnails'] ?? [];
                $thumb = end($thumbs)['url'] ?? ''; // Safe in PHP 7+ if array

                $title = $v['title']['runs'][0]['text'] ?? $v['title']['simpleText'] ?? 'Unknown Title';
                $viewCount = $v['viewCountText']['simpleText'] ?? '';
                $publishedTime = $v['publishedTimeText']['simpleText'] ?? '';
                $length = $v['lengthText']['simpleText'] ?? '';

                $videos[] = [
                    'title' => $title,
                    'videoId' => $videoId,
                    'url' => "https://www.youtube.com/watch?v=$videoId",
                    'thumbnail' => $thumb,
                    'viewCount' => $viewCount,
                    'publishedTime' => $publishedTime,
                    'length' => $length
                ];
            }
        }
        foreach ($data as $k => $item) {
            findVideos($item, $videos);
        }
    }
}
?>