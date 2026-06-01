import { NextResponse } from 'next/server';

const CHANNEL_HANDLE = 'iskcondurgapurofficial957';
const API_KEY = process.env.YOUTUBE_API_KEY;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface VideoEntry {
    videoId: string;
    title: string;
    published: string;
    thumbnail: string;
    description: string;
}

// ── In-memory cache ───────────────────────────────────────────────────────────
let cache: {
    videos: VideoEntry[];
    uploadsPlaylistId: string | null;
    lastFetched: number;
} = { videos: [], uploadsPlaylistId: null, lastFetched: 0 };

// ── Resolve uploads playlist ID from channel handle ───────────────────────────
async function resolveUploadsPlaylistId(): Promise<string | null> {
    if (cache.uploadsPlaylistId) return cache.uploadsPlaylistId;

    // Try YouTube Data API first
    if (API_KEY && API_KEY !== 'YOUR_YOUTUBE_API_KEY_HERE') {
        try {
            const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${API_KEY}`;
            const res = await fetch(url, { next: { revalidate: 86400 } });
            const data = await res.json() as { items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[] };
            const playlistId = data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
            if (playlistId) {
                cache.uploadsPlaylistId = playlistId;
                return playlistId;
            }
        } catch (e) {
            console.error('Failed to resolve playlist via API:', e);
        }
    }

    // Fallback: scrape channel page for channelId → derive playlist ID
    try {
        const res = await fetch(`https://www.youtube.com/@${CHANNEL_HANDLE}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            next: { revalidate: 86400 },
        });
        const html = await res.text();
        const canonicalMatch = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})"/);
        const altMatch = html.match(/"channelId":"(UC[\w-]{22})"/);
        const match = canonicalMatch || altMatch;
        if (match) {
            // Channel ID: UCxxxxxxx → Uploads playlist ID: UUxxxxxxx
            const uploadsId = 'UU' + match[1].slice(2);
            cache.uploadsPlaylistId = uploadsId;
            return uploadsId;
        }
    } catch (e) {
        console.error('Failed to scrape channel page:', e);
    }

    return null;
}

// ── Fetch ALL videos via YouTube Data API v3 with pagination ──────────────────
async function fetchAllVideosViaAPI(uploadsPlaylistId: string): Promise<VideoEntry[]> {
    const videos: VideoEntry[] = [];
    let pageToken: string | undefined = undefined;
    let pagesFetched = 0;
    const MAX_PAGES = 50; // safety cap: 50 × 50 = up to 2500 videos

    do {
        const params = new URLSearchParams({
            part: 'snippet',
            playlistId: uploadsPlaylistId,
            maxResults: '50',
            key: API_KEY!,
            ...(pageToken ? { pageToken } : {}),
        });

        const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`, {
            next: { revalidate: 300 }, // 5 min cache at edge
        });

        if (!res.ok) {
            console.error('YouTube API error:', res.status, await res.text());
            break;
        }

        const data = await res.json() as { items?: { snippet?: { resourceId?: { videoId?: string }; title?: string; publishedAt?: string; description?: string; thumbnails?: { high?: { url?: string }; medium?: { url?: string }; default?: { url?: string } } } }[]; nextPageToken?: string };

        for (const item of data.items ?? []) {
            const snippet = item.snippet;
            const videoId = snippet?.resourceId?.videoId;
            if (!videoId || snippet?.title === 'Private video' || snippet?.title === 'Deleted video') continue;

            videos.push({
                videoId,
                title: snippet.title ?? '',
                published: snippet.publishedAt ?? '',
                thumbnail:
                    snippet.thumbnails?.high?.url ??
                    snippet.thumbnails?.medium?.url ??
                    snippet.thumbnails?.default?.url ??
                    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                description: (snippet.description ?? '').substring(0, 200),
            });
        }

        pageToken = data.nextPageToken;
        pagesFetched++;
    } while (pageToken && pagesFetched < MAX_PAGES);

    return videos;
}

// ── Fallback: RSS feed (returns latest 15 videos, no API key needed) ──────────
async function fetchVideosViaRSS(uploadsPlaylistId: string): Promise<VideoEntry[]> {
    try {
        // Derive channel ID from uploads playlist ID: UUxxx → UCxxx
        const channelId = 'UC' + uploadsPlaylistId.slice(2);
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const rssRes = await fetch(rssUrl, { next: { revalidate: 300 } });
        if (!rssRes.ok) return [];

        const xml = await rssRes.text();
        const videos: VideoEntry[] = [];
        const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
        let m;

        while ((m = entryRegex.exec(xml)) !== null) {
            const entry = m[1];
            const videoIdM = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
            const titleM = entry.match(/<title>(.*?)<\/title>/);
            const publishedM = entry.match(/<published>(.*?)<\/published>/);
            const thumbM = entry.match(/url="(https:\/\/i\.ytimg\.com[^"]+)"/);
            const descM = entry.match(/<media:description>([\s\S]*?)<\/media:description>/);

            if (videoIdM && titleM) {
                videos.push({
                    videoId: videoIdM[1],
                    title: titleM[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'),
                    published: publishedM?.[1] ?? '',
                    thumbnail: thumbM?.[1] ?? `https://i.ytimg.com/vi/${videoIdM[1]}/hqdefault.jpg`,
                    description: (descM?.[1] ?? '').trim().substring(0, 200),
                });
            }
        }
        return videos;
    } catch (e) {
        console.error('RSS fallback failed:', e);
        return [];
    }
}

// ── Route handler ──────────────────────────────────────────────────────────────
export async function GET() {
    try {
        const now = Date.now();
        const cacheAge = now - cache.lastFetched;
        const cacheValid = cache.videos.length > 0 && cacheAge < CACHE_TTL_MS;

        if (cacheValid) {
            return NextResponse.json({
                videos: cache.videos,
                totalCount: cache.videos.length,
                lastSynced: cache.lastFetched,
                source: 'cache',
            });
        }

        const uploadsPlaylistId = await resolveUploadsPlaylistId();

        if (!uploadsPlaylistId) {
            return NextResponse.json({ error: 'Could not resolve channel playlist' }, { status: 500 });
        }

        let videos: VideoEntry[] = [];
        let source = 'rss';

        if (API_KEY && API_KEY !== 'YOUR_YOUTUBE_API_KEY_HERE') {
            videos = await fetchAllVideosViaAPI(uploadsPlaylistId);
            source = 'youtube-api-v3';
        }

        // Fallback to RSS if API fetch failed or key not configured
        if (videos.length === 0) {
            videos = await fetchVideosViaRSS(uploadsPlaylistId);
            source = 'rss-fallback';
        }

        // Update cache
        cache = { videos, uploadsPlaylistId, lastFetched: now };

        return NextResponse.json({
            videos,
            totalCount: videos.length,
            lastSynced: now,
            source,
        });
    } catch (e) {
        console.error('YouTube videos API error:', e);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
