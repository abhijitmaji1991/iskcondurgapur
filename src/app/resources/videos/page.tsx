'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaYoutube, FaPlay, FaTimes, FaSpinner,
  FaExternalLinkAlt, FaSearch, FaSyncAlt, FaVideo
} from 'react-icons/fa';

interface YTVideo {
  videoId: string;
  title: string;
  published: string;
  thumbnail: string;
  description: string;
}

const PAGE_SIZE = 24;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // auto-refresh every 5 min

export default function VideosPage() {
  const [allVideos, setAllVideos] = useState<YTVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lastSynced, setLastSynced] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [source, setSource] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchVideos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/youtube-videos', { cache: 'no-store' });
      const data = await res.json();
      if (data.videos && Array.isArray(data.videos)) {
        setAllVideos(data.videos);
        setTotalCount(data.totalCount ?? data.videos.length);
        setLastSynced(data.lastSynced ?? Date.now());
        setSource(data.source ?? '');
        if (!isRefresh) setVisibleCount(PAGE_SIZE); // reset pagination on first load
      } else {
        setError('Could not load videos from the channel.');
      }
    } catch {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchVideos(false);
  }, [fetchVideos]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    timerRef.current = setInterval(() => fetchVideos(true), REFRESH_INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fetchVideos]);

  // Escape key closes modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setActiveVideoId(null);
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const formatDate = (iso: string) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const timeSince = (ms: number) => {
    const diff = Math.floor((Date.now() - ms) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  // Client-side search filter
  const filtered = searchQuery.trim()
    ? allVideos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : allVideos;

  const visible = filtered.slice(0, visibleCount);
  const activeVideo = allVideos.find(v => v.videoId === activeVideoId);
  const isApiSync = source === 'youtube-api-v3';

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="relative py-10 pt-24 overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-orange-500">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute right-0 bottom-0 text-white/5 text-[20rem] font-black leading-none select-none hidden xl:block">▶</div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-3">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {isApiSync ? 'Live Sync — Full Channel' : 'Auto-Sync — Latest 15 Videos'}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                Spiritual Video Resources
              </h1>
              <p className="text-white/80 text-base max-w-xl">
                Watch lectures, kirtans &amp; temple programmes from <strong>ISKCON Durgapur [Official]</strong> — right here, no redirects.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6 shrink-0">
              <div className="text-center">
                <div className="text-4xl font-black text-white">{totalCount > 0 ? totalCount : '—'}</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">Total Videos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white">∞</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">Auto-Sync</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <a href="https://www.youtube.com/@iskcondurgapurofficial957" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-5 py-2.5 rounded-full hover:bg-red-50 transition text-sm shadow">
              <FaYoutube className="text-base" /> Visit Channel <FaExternalLinkAlt className="text-xs" />
            </a>
            <button onClick={() => fetchVideos(true)} disabled={refreshing}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-full transition text-sm disabled:opacity-50">
              <FaSyncAlt className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing…' : 'Refresh Now'}
            </button>
            {lastSynced && (
              <span className="text-white/60 text-xs flex items-center gap-1">
                Last synced: {timeSince(lastSynced)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Search Bar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-lg">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search videos by title…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-sm bg-gray-50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <FaTimes size={12} />
                </button>
              )}
            </div>
            {!loading && (
              <span className="text-sm text-gray-500 shrink-0">
                {searchQuery ? `${filtered.length} results` : `${totalCount} videos`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Video Grid ── */}
      <section className="py-10">
        <div className="container mx-auto px-4">

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4 text-gray-500">
              <FaSpinner className="text-5xl text-red-500 animate-spin" />
              <p className="text-lg font-medium">Syncing videos from YouTube…</p>
              <p className="text-sm text-gray-400">Fetching all uploads from the channel</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="max-w-lg mx-auto text-center py-20">
              <FaYoutube className="text-6xl text-red-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">Could not load videos</h3>
              <p className="text-gray-500 text-sm mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => fetchVideos(false)}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full hover:bg-red-700 transition text-sm font-medium">
                  <FaSyncAlt /> Try Again
                </button>
                <a href="https://www.youtube.com/@iskcondurgapurofficial957/videos" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-red-300 text-red-600 px-5 py-2.5 rounded-full hover:bg-red-50 transition text-sm">
                  <FaYoutube /> Watch on YouTube
                </a>
              </div>
            </div>
          )}

          {/* No results for search */}
          {!loading && !error && filtered.length === 0 && searchQuery && (
            <div className="text-center py-20">
              <FaVideo className="text-5xl text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500">No videos match <strong>&quot;{searchQuery}&quot;</strong></p>
              <button onClick={() => setSearchQuery('')} className="mt-4 text-red-500 text-sm underline">Clear search</button>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && visible.length > 0 && (
            <>
              {/* API key notice if fallback */}
              {source === 'rss-fallback' && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-sm text-amber-800 flex items-start gap-3">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <strong>Showing latest 15 videos only.</strong> Add a <code>YOUTUBE_API_KEY</code> in <code>.env.local</code> to enable full-channel sync with all videos.
                    {' '}<a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Get a free key →</a>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {visible.map((video, index) => (
                  <motion.div
                    key={video.videoId}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.6) }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer group"
                    onClick={() => setActiveVideoId(video.videoId)}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                        alt={video.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                        <div className="bg-red-600 text-white rounded-full p-3.5 shadow-xl transform group-hover:scale-105 transition-transform duration-200">
                          <FaPlay className="text-lg ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 bg-red-600/90 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                        <FaYoutube className="text-xs" /> YouTube
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 leading-snug mb-1.5 group-hover:text-red-600 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-400">{formatDate(video.published)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              {visibleCount < filtered.length && (
                <div className="text-center mt-12">
                  <p className="text-sm text-gray-400 mb-3">
                    Showing {visible.length} of {filtered.length} videos
                  </p>
                  <button
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition shadow-md text-sm"
                  >
                    Load More Videos
                  </button>
                </div>
              )}

              {visibleCount >= filtered.length && filtered.length >= PAGE_SIZE && (
                <p className="text-center text-gray-400 text-sm mt-10">
                  All {filtered.length} videos loaded ✓
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Inline Video Player Modal ── */}
      <AnimatePresence>
        {activeVideoId && activeVideo && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setActiveVideoId(null)}
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideoId(null)}
                className="absolute top-3 right-3 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition"
                aria-label="Close video"
              >
                <FaTimes className="text-lg" />
              </button>

              <div className="relative" style={{ paddingTop: '56.25%' }}>
                <iframe
                  key={activeVideoId}
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="bg-gray-900 px-5 py-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm line-clamp-2">{activeVideo.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">ISKCON Durgapur · {formatDate(activeVideo.published)}</p>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition mt-0.5"
                >
                  <FaExternalLinkAlt /> YouTube
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}