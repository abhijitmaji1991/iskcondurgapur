'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
    FaSearch, FaPlay, FaPause, FaDownload, FaHeart, FaRegHeart, FaShare,
    FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward
} from 'react-icons/fa';

interface FeaturedContent {
  id: string;
  title: string;
  speaker: string;
  duration: string;
  description: string;
  date: string;
  image: string;
  audioUrl: string;
}

interface AudioCategory {
  name: string;
  description: string;
  count: number;
  icon: string;
}

// Sample audio content mapped to existing beautiful local images & standard stream URLs
const featuredContent: FeaturedContent[] = [
  {
    id: "lecture-1",
    title: "Introduction to Bhagavad Gita",
    speaker: "Srila Prabhupada",
    duration: "12:15",
    description: "A comprehensive introduction to the timeless spiritual wisdom of the Bhagavad Gita.",
    date: "May 15, 2023",
    image: "/images/history-of-iskcon.jpg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "kirtan-1",
    title: "Hare Krishna Maha Mantra Kirtan",
    speaker: "Aindra Prabhu",
    duration: "07:05",
    description: "A beautifully transcendental congregation kirtan of the Hare Krishna Maha Mantra.",
    date: "June 3, 2023",
    image: "/images/events-and-festival.jpg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "lecture-2",
    title: "The Science of Self-Realization",
    speaker: "Radhanath Swami",
    duration: "09:44",
    description: "Exploring the deep spiritual science behind self-awareness and conscious living.",
    date: "July 10, 2023",
    image: "/images/srila-prabhupada.jpg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

const audioCategories: AudioCategory[] = [
  {
    name: "Lectures",
    description: "Philosophical and spiritual discourses",
    count: 245,
    icon: "📖"
  },
  {
    name: "Kirtans",
    description: "Devotional chanting and congregational songs",
    count: 187,
    icon: "📿"
  },
  {
    name: "Bhajans",
    description: "Traditional classical devotional songs",
    count: 142,
    icon: "🎵"
  },
  {
    name: "Guided Meditations",
    description: "Spiritual mindfulness & meditation sessions",
    count: 78,
    icon: "🧘"
  }
];

const popularSeries = [
  {
    title: "Bhagavad Gita Overview",
    author: "Srila Prabhupada",
    episodes: 18,
    image: "/images/krishna-temple.jpg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    title: "Nectar of Instruction",
    author: "Radhanath Swami",
    episodes: 8,
    image: "/images/books-banner.jpg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    title: "Srimad Bhagavatam Canto 1",
    author: "Srila Prabhupada",
    episodes: 32,
    image: "/images/iskcon-temple-dome.jpg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  }
];

export default function AudioPage() {
  const INITIAL_VOLUME = 0.8;
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<FeaturedContent | null>(null);
  const [volume, setVolume] = useState(INITIAL_VOLUME);
  const [isMuted, setIsMuted] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio client instance
    audioRef.current = new Audio();
    audioRef.current.volume = INITIAL_VOLUME;

    const handleLoadedMetadata = () => {
      if (audioRef.current) setTrackDuration(audioRef.current.duration);
    };

    const handleTimeUpdate = () => {
      if (audioRef.current) setTrackProgress(audioRef.current.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setTrackProgress(0);
    };

    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  const playTrack = (track: FeaturedContent) => {
    if (!audioRef.current) return;

    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(err => console.error("Playback error:", err));
        setIsPlaying(true);
      }
    } else {
      audioRef.current.pause();
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setCurrentTrack(track);
          setIsPlaying(true);
        })
        .catch(err => console.error("Playback launch error:", err));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekTime = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTime;
    setTrackProgress(seekTime);
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredContent = featuredContent.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50/50 pt-28 pb-32">
      
      {/* Decorative header */}
      <section className="container mx-auto px-6 mb-12">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-white/65 p-8 md:p-12 bg-gradient-to-br from-amber-500/10 via-white/80 to-orange-500/5 backdrop-blur-md">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100/60 px-3 py-1.5 rounded-full">
              Devotional Audio Library
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight mt-4 mb-4">
              Spiritual Audio Resources
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Explore an extensive catalog of lectures, kirtans, classical bhajans, and guided meditation tutorials to elevate your spiritual practices.
            </p>
            <div className="relative max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-150 p-1 flex items-center">
              <FaSearch className="text-gray-400 ml-4 mr-3" />
              <input
                type="text"
                placeholder="Search lectures, kirtans, acharyas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 bg-transparent text-gray-800 outline-none placeholder-gray-400 text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured list */}
      <section className="container mx-auto px-6 mb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Featured Releases</h2>
            <p className="text-sm text-gray-500">Transcendental audio curated by temple acharyas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredContent.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-500/20 transition-all duration-300 overflow-hidden group">
              <div className="relative h-52 bg-slate-100 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => playTrack(item)}
                    className="w-14 h-14 bg-iskcon-orange text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
                  >
                    {currentTrack?.id === item.id && isPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="ml-1" />}
                  </button>
                </div>
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">
                  {item.duration} mins
                </span>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-bold text-gray-800 leading-snug line-clamp-1 group-hover:text-iskcon-orange transition-colors">
                    {item.title}
                  </h3>
                  <button 
                    onClick={() => toggleFavorite(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {favorites.includes(item.id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                  </button>
                </div>
                <p className="text-xs text-orange-600 font-bold mb-3">{item.speaker}</p>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                  <span className="text-xs text-gray-400">{item.date}</span>
                  <button 
                    onClick={() => playTrack(item)}
                    className="text-xs bg-orange-50 text-orange-600 hover:bg-iskcon-orange hover:text-white font-bold py-2 px-4 rounded-xl transition flex items-center gap-2"
                  >
                    {currentTrack?.id === item.id && isPlaying ? (
                      <>
                        <span className="w-2 h-2 bg-orange-600 rounded-full animate-ping"></span> Playing
                      </>
                    ) : (
                      <>
                        <FaPlay size={10} /> Listen Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-y border-orange-500/10 py-16 mb-16">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">Explore Categories</h2>
            <p className="text-gray-500 mt-2">Filter and browse through dedicated spiritual archives</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audioCategories.map((category, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-500/10 transition-all text-center cursor-pointer group"
              >
                <div className="w-16 h-16 mx-auto bg-orange-50 text-3xl rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-iskcon-orange/10 transition-all duration-300">
                  {category.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">{category.name}</h3>
                <p className="text-gray-500 text-xs mb-4 line-clamp-2">{category.description}</p>
                <span className="text-xs font-bold text-orange-600 group-hover:underline">
                  Browse {category.count} audios →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Series */}
      <section className="container mx-auto px-6 mb-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Popular Series</h2>
          <p className="text-sm text-gray-500">Comprehensive episodic lecture sets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularSeries.map((series, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-150 p-4 flex gap-4 hover:shadow-sm transition-all group">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                <Image
                  src={series.image}
                  alt={series.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm group-hover:text-iskcon-orange transition-colors">
                    {series.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{series.author}</p>
                </div>
                <div className="flex justify-between items-center gap-6 mt-3">
                  <span className="text-xs text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg font-bold">
                    {series.episodes} lectures
                  </span>
                  <button 
                    onClick={() => playTrack({
                      id: `series-${index}`,
                      title: series.title,
                      speaker: series.author,
                      duration: "Series",
                      description: `Anthology lectures from ${series.title}`,
                      date: "Collection",
                      image: series.image,
                      audioUrl: series.audioUrl
                    })}
                    className="text-xs text-gray-400 hover:text-iskcon-orange font-bold transition-colors"
                  >
                    Play All
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Glass Player */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white/70 backdrop-blur-xl border-t border-white/50 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] transition-all animate-slide-up">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Info */}
            <div className="flex items-center gap-4 w-full md:w-1/4">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                <Image
                  src={currentTrack.image}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-gray-800 text-sm truncate">{currentTrack.title}</h4>
                <p className="text-xs text-orange-600 font-semibold truncate">{currentTrack.speaker}</p>
              </div>
            </div>

            {/* Play controls and progress */}
            <div className="flex flex-col items-center gap-1.5 w-full md:w-1/2">
              <div className="flex items-center gap-6">
                <button className="text-gray-400 hover:text-gray-700 transition">
                  <FaStepBackward />
                </button>
                <button 
                  onClick={() => playTrack(currentTrack)}
                  className="w-10 h-10 bg-iskcon-orange text-white rounded-full flex items-center justify-center shadow hover:scale-105 transition"
                >
                  {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
                </button>
                <button className="text-gray-400 hover:text-gray-700 transition">
                  <FaStepForward />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 w-full text-xs text-gray-500 font-semibold">
                <span>{formatTime(trackProgress)}</span>
                <input
                  type="range"
                  min={0}
                  max={trackDuration || 0}
                  value={trackProgress}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-gray-200 accent-orange-600 rounded-lg appearance-none cursor-pointer"
                />
                <span>{formatTime(trackDuration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-end gap-3 w-full md:w-1/4">
              <button 
                onClick={toggleMute}
                className="text-gray-500 hover:text-iskcon-orange transition"
              >
                {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-200 accent-orange-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

          </div>
        </div>
      )}

    </main>
  );
}