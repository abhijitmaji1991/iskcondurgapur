'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
    FaSearch, FaPlay, FaPause, FaFolder, FaMusic, FaArrowLeft, FaHome,
    FaVolumeUp, FaVolumeMute, FaSpinner
} from 'react-icons/fa';

interface AudioFile {
  url: string;
  name: string;
}

interface AudioFolder {
  path: string;
  name: string;
}

export default function AudioPage() {
  const INITIAL_VOLUME = 0.8;
  const [currentPath, setCurrentPath] = useState('');
  const [folders, setFolders] = useState<AudioFolder[]>([]);
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioFile | null>(null);
  const [volume, setVolume] = useState(INITIAL_VOLUME);
  const [isMuted, setIsMuted] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch directory contents
  useEffect(() => {
    const fetchDirectory = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/iskcon-audio?path=${encodeURIComponent(currentPath)}`);
        const result = await res.json();
        
        if (result.success) {
          setFolders(result.data.folders);
          setFiles(result.data.files);
        } else {
          setError(result.message || 'Failed to load audio directory.');
        }
      } catch (err) {
        console.error('Directory fetch error:', err);
        setError('Network error loading directory.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectory();
  }, [currentPath]);

  // Audio Player Setup
  useEffect(() => {
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

  const playTrack = (track: AudioFile) => {
    if (!audioRef.current) return;

    if (currentTrack?.url === track.url) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(err => console.error("Playback error:", err));
        setIsPlaying(true);
      }
    } else {
      audioRef.current.pause();
      audioRef.current.src = track.url;
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

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFolderClick = (path: string) => {
    setCurrentPath(path);
  };

  const navigateUp = () => {
    if (!currentPath) return;
    const parts = currentPath.split('/');
    parts.pop();
    setCurrentPath(parts.join('/'));
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pt-28 pb-32">
      
      {/* Decorative header */}
      <section className="container mx-auto px-6 mb-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-white/65 p-8 md:p-12 bg-gradient-to-br from-blue-500/10 via-white/80 to-indigo-500/5 backdrop-blur-md">
          <div className="max-w-3xl relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-3 py-1.5 rounded-full">
              Global Audio Archive
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight mt-4 mb-4">
              ISKCON Desire Tree Audio
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Browse and listen to tens of thousands of transcendental lectures, kirtans, and bhajans directly from the world&apos;s largest Vaishnava audio archive.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
            <FaMusic className="w-full h-full text-blue-500" />
          </div>
        </div>
      </section>

      {/* Browser Section */}
      <section className="container mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
          
          {/* Toolbar & Breadcrumbs */}
          <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center gap-4">
            <button 
              onClick={() => setCurrentPath('')}
              className={`p-2 rounded-xl transition ${!currentPath ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200 hover:text-blue-600'}`}
              disabled={!currentPath}
              title="Home"
            >
              <FaHome size={20} />
            </button>
            <button 
              onClick={navigateUp}
              className={`p-2 rounded-xl transition ${!currentPath ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200 hover:text-blue-600'}`}
              disabled={!currentPath}
              title="Go Up"
            >
              <FaArrowLeft size={18} />
            </button>

            <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-mono text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap shadow-inner">
              /ISKCON_Desire_Tree{currentPath}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-blue-500">
                <FaSpinner className="animate-spin text-4xl mb-4" />
                <p className="font-semibold animate-pulse">Fetching from archive...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
                <p className="font-bold">{error}</p>
                <button onClick={() => setCurrentPath('')} className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-xl transition font-semibold text-sm">
                  Return to Home
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                
                {/* Folders */}
                {folders.map((folder, idx) => (
                  <div 
                    key={`folder-${idx}`}
                    onClick={() => handleFolderClick(folder.path)}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all group shadow-sm hover:shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FaFolder size={20} />
                    </div>
                    <span className="font-semibold text-gray-700 text-sm truncate pr-2" title={folder.name}>
                      {folder.name}
                    </span>
                  </div>
                ))}

                {/* Audio Files */}
                {files.map((file, idx) => (
                  <div 
                    key={`file-${idx}`}
                    className="flex flex-col justify-between p-4 rounded-2xl border border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 transition-all group shadow-sm hover:shadow relative overflow-hidden"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0">
                        <FaMusic size={16} />
                      </div>
                      <span className="font-bold text-gray-800 text-sm leading-snug line-clamp-3" title={file.name}>
                        {file.name}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-100/50">
                      <button 
                        onClick={() => playTrack(file)}
                        className={`w-full py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                          currentTrack?.url === file.url && isPlaying 
                            ? 'bg-orange-500 text-white shadow-md' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                        }`}
                      >
                        {currentTrack?.url === file.url && isPlaying ? (
                          <><FaPause size={12} /> Pause</>
                        ) : (
                          <><FaPlay size={12} /> Play Audio</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {folders.length === 0 && files.length === 0 && (
                  <div className="col-span-full py-20 text-center text-gray-400">
                    <FaFolder size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-semibold">This folder is empty.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Floating Glass Player */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-white shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] transition-all animate-slide-up">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Info */}
            <div className="flex items-center gap-4 w-full md:w-1/3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0 shadow-inner border border-orange-200">
                <FaMusic size={20} className={isPlaying ? 'animate-bounce' : ''} />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-gray-800 text-sm truncate" title={currentTrack.name}>{currentTrack.name}</h4>
                <p className="text-xs text-orange-600 font-semibold truncate">Playing from Archive</p>
              </div>
            </div>

            {/* Play controls and progress */}
            <div className="flex flex-col items-center gap-1.5 w-full md:w-1/2">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => playTrack(currentTrack)}
                  className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} className="ml-1" />}
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
                  className="w-full h-1.5 bg-gray-200 accent-orange-600 rounded-lg appearance-none cursor-pointer"
                />
                <span>{formatTime(trackDuration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-end gap-3 w-full md:w-1/3 hidden sm:flex">
              <button 
                onClick={toggleMute}
                className="text-gray-500 hover:text-orange-500 transition"
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
                className="w-24 h-1.5 bg-gray-200 accent-orange-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

          </div>
        </div>
      )}

    </main>
  );
}