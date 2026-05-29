"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    FaPlay,
    FaPause,
    FaDownload,
    FaSearch,
    FaFilter,
    FaBookOpen,
    FaVolumeUp,
    FaVolumeMute,
    FaBackward,
    FaForward,
    FaChevronDown,
    FaTimes,
    FaFont,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaBook,
    FaArrowUp
} from 'react-icons/fa';
import { getLectures, ApiLecture } from '@/lib/api';

// Audio Visualizer Component using Framer Motion
const AudioVisualizer: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
    const bars = [1, 2, 3, 4, 5];
    return (
        <div className="flex items-end gap-1 h-5 w-8">
            {bars.map((bar) => (
                <motion.div
                    key={bar}
                    className="w-1 bg-amber-500 rounded-full"
                    animate={isPlaying ? {
                        height: ["20%", "100%", "20%"]
                    } : {
                        height: "30%"
                    }}
                    transition={isPlaying ? {
                        duration: 0.6 + bar * 0.1,
                        repeat: Infinity,
                        ease: "easeInOut"
                    } : {}}
                />
            ))}
        </div>
    );
};

// Shimmering Skeleton Loader Card
const SkeletonCard: React.FC = () => (
    <div className="bg-white rounded-2xl border border-stone-150 p-5 sm:p-6 space-y-4 animate-pulse">
        <div className="flex gap-2">
            <div className="h-5 w-20 bg-stone-200 rounded-md"></div>
            <div className="h-5 w-24 bg-stone-200 rounded-md"></div>
            <div className="h-5 w-28 bg-stone-200 rounded-md"></div>
        </div>
        <div className="h-6 w-3/4 bg-stone-200 rounded-lg"></div>
        <div className="flex gap-4">
            <div className="h-4 w-28 bg-stone-200 rounded-md"></div>
            <div className="h-4 w-32 bg-stone-200 rounded-md"></div>
        </div>
    </div>
);

const LecturesClient: React.FC = () => {
    // Dynamic database states
    const [lectures, setLectures] = useState<ApiLecture[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Selection state
    const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title-asc' | 'location-asc'>('date-desc');

    // Sidebar facet filters
    const [filterType, setFilterType] = useState<string | null>(null);
    const [filterYear, setFilterYear] = useState<string | null>(null);
    const [filterLocation, setFilterLocation] = useState<string | null>(null);
    const [filterScripture, setFilterScripture] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');

    // Audio Player states
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [prevVolume, setPrevVolume] = useState(0.8);

    // Transcript Settings states
    const [readerTab, setReaderTab] = useState<'transcript' | 'details'>('transcript');
    const [readerTheme, setReaderTheme] = useState<'cream' | 'sepia' | 'dark'>('cream');
    const [readerFontSize, setReaderFontSize] = useState(16);

    // HTML5 Audio Reference
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const listTopRef = useRef<HTMLDivElement | null>(null);

    // Dynamic fetch from Next API endpoint
    const fetchLectures = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getLectures();
            setLectures(response.data || []);
        } catch (err: any) {
            console.error("Error loading lectures database:", err);
            setError(err.message || "Failed to establish secure connection with archive database.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLectures();
    }, []);

    // Dynamic facet options extraction
    const allTypes = Array.from(new Set(lectures.map(l => l.type)));
    const allYears = Array.from(new Set(lectures.map(l => l.year))).sort((a, b) => b.localeCompare(a));
    const allLocations = Array.from(new Set(lectures.map(l => l.location))).sort();
    const allScriptures = Array.from(new Set(lectures.map(l => l.scripture).filter(Boolean))) as string[];

    const selectedLecture = lectures.find(l => l._id === selectedLectureId);

    // Reset player state on lecture change
    useEffect(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
    }, [selectedLectureId]);

    // Handle speed change
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed, selectedLectureId]);

    // Handle volume change
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted, selectedLectureId]);

    // Handle Play/Pause
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(err => {
                    console.log("Playback interrupted:", err);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, selectedLectureId]);

    // Reset page index on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText, filterType, filterYear, filterLocation, filterScripture, sortBy]);

    // Format time helpers (seconds -> MM:SS)
    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds)) return '0:00';
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Text Highlight Helper (Splits string into parts for safe rendering)
    const highlightText = (text: string, search: string) => {
        if (!search.trim()) return text;
        const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedSearch})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part)
                ? <mark key={i} className="bg-amber-200 text-orange-950 font-semibold px-0.5 rounded shadow-sm">{part}</mark>
                : part
        );
    };

    // Dynamic Facet count calculations
    const getFilteredCount = (key: 'type' | 'year' | 'location' | 'scripture', val: string) => {
        return lectures.filter(lecture => {
            const matchesSearch = !searchText ||
                lecture.title.toLowerCase().includes(searchText.toLowerCase()) ||
                lecture.summary.toLowerCase().includes(searchText.toLowerCase()) ||
                lecture.transcript.toLowerCase().includes(searchText.toLowerCase()) ||
                lecture.code.toLowerCase().includes(searchText.toLowerCase());

            const matchesType = key === 'type' ? true : (!filterType || lecture.type === filterType);
            const matchesYear = key === 'year' ? true : (!filterYear || lecture.year === filterYear);
            const matchesLocation = key === 'location' ? true : (!filterLocation || lecture.location === filterLocation);
            const matchesScripture = key === 'scripture' ? true : (!filterScripture || lecture.scripture === filterScripture);

            return matchesSearch && matchesType && matchesYear && matchesLocation && matchesScripture &&
                (key === 'type' ? lecture.type === val :
                    key === 'year' ? lecture.year === val :
                        key === 'location' ? lecture.location === val :
                            lecture.scripture === val);
        }).length;
    };

    // Filter Logic
    const filteredLectures = lectures.filter(lecture => {
        const searchLower = searchText.toLowerCase();
        const matchesSearch = !searchText ||
            lecture.title.toLowerCase().includes(searchLower) ||
            lecture.summary.toLowerCase().includes(searchLower) ||
            lecture.location.toLowerCase().includes(searchLower) ||
            (lecture.scripture && lecture.scripture.toLowerCase().includes(searchLower)) ||
            (lecture.verses && lecture.verses.toLowerCase().includes(searchLower)) ||
            lecture.transcript.toLowerCase().includes(searchLower) ||
            lecture.code.toLowerCase().includes(searchLower);

        const matchesType = !filterType || lecture.type === filterType;
        const matchesYear = !filterYear || lecture.year === filterYear;
        const matchesLocation = !filterLocation || lecture.location === filterLocation;
        const matchesScripture = !filterScripture || lecture.scripture === filterScripture;

        return matchesSearch && matchesType && matchesYear && matchesLocation && matchesScripture;
    });

    // Sorting Logic
    const sortedLectures = [...filteredLectures].sort((a, b) => {
        if (sortBy === 'date-desc') {
            return b.code.localeCompare(a.code);
        } else if (sortBy === 'date-asc') {
            return a.code.localeCompare(b.code);
        } else if (sortBy === 'title-asc') {
            return a.title.localeCompare(b.title);
        } else if (sortBy === 'location-asc') {
            return a.location.localeCompare(b.location);
        }
        return 0;
    });

    // Pagination Logic
    const ITEMS_PER_PAGE = 4;
    const totalPages = Math.ceil(sortedLectures.length / ITEMS_PER_PAGE);
    const paginatedLectures = sortedLectures.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Audio Playback Events Handlers
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setCurrentTime(val);
        if (audioRef.current) {
            audioRef.current.currentTime = val;
        }
    };

    const handleSkipSeconds = (sec: number) => {
        if (audioRef.current) {
            let nextTime = audioRef.current.currentTime + sec;
            nextTime = Math.max(0, Math.min(duration, nextTime));
            audioRef.current.currentTime = nextTime;
            setCurrentTime(nextTime);
        }
    };

    const toggleMute = () => {
        if (isMuted) {
            setIsMuted(false);
            setVolume(prevVolume);
        } else {
            setPrevVolume(volume);
            setIsMuted(true);
            setVolume(0);
        }
    };

    // Scroll to the active playing lecture
    const scrollToActiveLecture = () => {
        if (selectedLectureId) {
            const element = document.getElementById(`lecture-card-${selectedLectureId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    // Download Transcript as File
    const handleDownloadTranscript = (lecture: ApiLecture) => {
        const element = document.createElement("a");
        const headerText = `SRILA PRABHUPADA AUDIO & TRANSCRIPT ARCHIVE\n========================================\n\nTitle: ${lecture.title}\nDate: ${lecture.date}\nLocation: ${lecture.location}\nCode: ${lecture.code}\n\n`;
        const verseText = lecture.verses
            ? `Scripture: ${lecture.scripture} (${lecture.verses})\n\nSANSKRIT VERSE:\n${lecture.sanskrit || ''}\n\nTRANSLATION:\n${lecture.translation || ''}\n\n`
            : '';
        const file = new Blob([headerText + verseText + "TRANSCRIPT:\n" + lecture.transcript], { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = `${lecture.code}_transcript.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // Readers theme styling mapper
    const getReaderThemeClasses = () => {
        switch (readerTheme) {
            case 'sepia':
                return 'bg-[#f4ecd8] text-[#433422] border-[#dfcfb9]';
            case 'dark':
                return 'bg-[#1a1512] text-[#eae3d8] border-[#3d332a]';
            case 'cream':
            default:
                return 'bg-[#fdfcf7] text-[#2d251e] border-[#e3dbcc]';
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfbf9] text-gray-800 font-sans pt-24 pb-32">

            {/* HTML5 Audio Node */}
            {selectedLecture && (
                <audio
                    ref={audioRef}
                    src={selectedLecture.audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Visual Sunburst Elegant Header */}
                <div className="relative rounded-3xl mb-10 overflow-hidden bg-gradient-to-br from-orange-950 via-amber-900 to-[#4a1805] text-white py-12 px-6 sm:px-12 shadow-2xl border border-orange-900/30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(251,191,36,0.18),_transparent_60%)]"></div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl -z-0"></div>

                    {/* Ornamental border detail */}
                    <div className="absolute inset-2 border border-dotted border-amber-500/25 rounded-[1.25rem] pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="max-w-2xl space-y-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/35 rounded-full text-xs font-bold text-amber-300 uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
                                Bhaktivedanta Archives
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-gradient bg-gradient-to-r from-amber-200 via-orange-100 to-amber-200 bg-clip-text text-transparent">
                                Śrīla Prabhupāda Vāṇī
                            </h2>
                            <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed font-serif">
                                Devoted to the preservation of the spoken words, transcripts, and spiritual legacy of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada. Filter chronologically and read transcripts with full Sanskrit translation.
                            </p>
                        </div>
                        <div className="flex-shrink-0 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/25">
                                <FaBook className="text-amber-400 text-xl" />
                            </div>
                            <div className="text-left font-serif">
                                <p className="text-2xl font-black text-amber-300 font-mono">{lectures.length > 0 ? `${lectures.length}+` : "..."}</p>
                                <p className="text-xs text-amber-100/60 uppercase tracking-wider font-sans font-bold">Total Transcripts</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8" ref={listTopRef}>

                    {/* Sidebar Filters (Glassmorphic design) */}
                    <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">

                        {/* Elegant Search Panel */}
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-orange-100/30">
                            <h3 className="text-xs font-bold text-orange-955 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                                <FaSearch className="text-orange-600 text-xs" /> Search Archive
                            </h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search transcripts, codes..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    disabled={isLoading || !!error}
                                    className="w-full bg-stone-50/50 border border-stone-200 hover:border-orange-200 focus:border-orange-500 rounded-xl py-2.5 pl-3.5 pr-10 text-sm focus:ring-4 focus:ring-orange-500/10 transition-all font-serif outline-none disabled:opacity-50"
                                />
                                {searchText ? (
                                    <button
                                        onClick={() => setSearchText('')}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 p-1"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                ) : (
                                    <FaSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                )}
                            </div>
                        </div>

                        {/* Facet Filters */}
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-orange-100/30 space-y-6">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                                <h3 className="text-xs font-bold text-orange-955 uppercase tracking-[0.15em] flex items-center gap-2">
                                    <FaFilter className="text-orange-600 text-xs" /> Filter Facets
                                </h3>
                                {(filterType || filterYear || filterLocation || filterScripture) && (
                                    <button
                                        onClick={() => {
                                            setFilterType(null);
                                            setFilterYear(null);
                                            setFilterLocation(null);
                                            setFilterScripture(null);
                                        }}
                                        className="text-xs text-orange-600 hover:text-orange-850 font-bold hover:underline"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Facet: Type */}
                            <div>
                                <h4 className="text-xxs font-bold text-stone-400 uppercase tracking-widest mb-3">Categories</h4>
                                <ul className="space-y-1.5">
                                    {allTypes.map((type) => {
                                        const count = getFilteredCount('type', type);
                                        const isActive = filterType === type;
                                        return (
                                            <li
                                                key={type}
                                                onClick={() => !isLoading && setFilterType(isActive ? null : type)}
                                                className={`flex items-center justify-between group cursor-pointer text-sm py-2 px-3 rounded-xl transition-all ${isActive
                                                        ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold shadow-md'
                                                        : 'text-stone-600 hover:bg-orange-50/50 hover:text-orange-900'
                                                    } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                                            >
                                                <span>{type}</span>
                                                <span className={`text-xxs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500 group-hover:bg-orange-100 group-hover:text-orange-955'
                                                    }`}>{count}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Facet: Scripture */}
                            <div>
                                <h4 className="text-xxs font-bold text-stone-400 uppercase tracking-widest mb-3">Scriptures</h4>
                                <ul className="space-y-1.5">
                                    {allScriptures.map((scrip) => {
                                        const count = getFilteredCount('scripture', scrip);
                                        const isActive = filterScripture === scrip;
                                        return (
                                            <li
                                                key={scrip}
                                                onClick={() => !isLoading && setFilterScripture(isActive ? null : scrip)}
                                                className={`flex items-center justify-between group cursor-pointer text-sm py-2 px-3 rounded-xl transition-all ${isActive
                                                        ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold shadow-md'
                                                        : 'text-stone-600 hover:bg-orange-50/50 hover:text-orange-900'
                                                    } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                                            >
                                                <span>{scrip}</span>
                                                <span className={`text-xxs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500 group-hover:bg-orange-100 group-hover:text-orange-955'
                                                    }`}>{count}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Facet: Year */}
                            <div>
                                <h4 className="text-xxs font-bold text-stone-400 uppercase tracking-widest mb-3">Timeline</h4>
                                <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                                    {allYears.map((year) => {
                                        const count = getFilteredCount('year', year);
                                        const isActive = filterYear === year;
                                        return (
                                            <li
                                                key={year}
                                                onClick={() => !isLoading && setFilterYear(isActive ? null : year)}
                                                className={`flex items-center justify-between group cursor-pointer text-sm py-2 px-3 rounded-xl transition-all ${isActive
                                                        ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold shadow-md'
                                                        : 'text-stone-600 hover:bg-orange-50/50 hover:text-orange-900'
                                                    } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                                            >
                                                <span className="font-serif">{year}</span>
                                                <span className={`text-xxs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500 group-hover:bg-orange-100 group-hover:text-orange-955'
                                                    }`}>{count}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Facet: Location */}
                            <div>
                                <h4 className="text-xxs font-bold text-stone-400 uppercase tracking-widest mb-3">Locations</h4>
                                <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                                    {allLocations.map((loc) => {
                                        const count = getFilteredCount('location', loc);
                                        const isActive = filterLocation === loc;
                                        return (
                                            <li
                                                key={loc}
                                                onClick={() => !isLoading && setFilterLocation(isActive ? null : loc)}
                                                className={`flex items-center justify-between group cursor-pointer text-sm py-2 px-3 rounded-xl transition-all ${isActive
                                                        ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold shadow-md'
                                                        : 'text-stone-600 hover:bg-orange-50/50 hover:text-orange-900'
                                                    } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                                            >
                                                <span>{loc}</span>
                                                <span className={`text-xxs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500 group-hover:bg-orange-100 group-hover:text-orange-955'
                                                    }`}>{count}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                        </div>
                    </aside>

                    {/* Main List & Details pane */}
                    <main className="flex-1 space-y-6">

                        {/* Top Filters & Sorting bar */}
                        <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-orange-100/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="text-sm text-stone-500 font-medium">
                                    Found <span className="font-bold text-orange-900 font-serif text-base">{sortedLectures.length}</span> recordings
                                    {(filterType || filterYear || filterLocation || filterScripture || searchText) && ' matching filters'}
                                </p>
                                {/* Active filter badges */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {filterType && (
                                        <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50/65 text-orange-950 font-bold px-2.5 py-1 rounded-lg border border-orange-200/40 shadow-xs">
                                            Type: {filterType}
                                            <button onClick={() => setFilterType(null)} className="text-[10px] hover:text-red-750 p-0.5"><FaTimes /></button>
                                        </span>
                                    )}
                                    {filterScripture && (
                                        <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50/65 text-orange-950 font-bold px-2.5 py-1 rounded-lg border border-orange-200/40 shadow-xs font-serif italic">
                                            {filterScripture}
                                            <button onClick={() => setFilterScripture(null)} className="text-[10px] hover:text-red-750 p-0.5"><FaTimes /></button>
                                        </span>
                                    )}
                                    {filterYear && (
                                        <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50/65 text-orange-950 font-bold px-2.5 py-1 rounded-lg border border-orange-200/40 shadow-xs font-serif">
                                            Year: {filterYear}
                                            <button onClick={() => setFilterYear(null)} className="text-[10px] hover:text-red-750 p-0.5"><FaTimes /></button>
                                        </span>
                                    )}
                                    {filterLocation && (
                                        <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50/65 text-orange-950 font-bold px-2.5 py-1 rounded-lg border border-orange-200/40 shadow-xs">
                                            Location: {filterLocation}
                                            <button onClick={() => setFilterLocation(null)} className="text-[10px] hover:text-red-750 p-0.5"><FaTimes /></button>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-stone-500 font-medium self-end sm:self-auto">
                                <span>Sort Archive:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    disabled={isLoading || !!error}
                                    className="bg-stone-50 border border-stone-200 rounded-xl py-1.5 px-3 text-sm font-bold text-stone-850 outline-none cursor-pointer focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 disabled:opacity-50"
                                >
                                    <option value="date-desc">Date (Newest)</option>
                                    <option value="date-asc">Date (Oldest)</option>
                                    <option value="title-asc">Title (A-Z)</option>
                                    <option value="location-asc">Location (A-Z)</option>
                                </select>
                            </div>
                        </div>

                        {/* Card List */}
                        <div className="space-y-5">
                            {isLoading ? (
                                // Render animated shimmering skeleton cards
                                <>
                                    <SkeletonCard />
                                    <SkeletonCard />
                                    <SkeletonCard />
                                </>
                            ) : error ? (
                                // Render beautiful retry error message
                                <div className="bg-white text-center py-16 px-6 rounded-2xl border border-red-200/50 shadow-sm space-y-4">
                                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
                                        <FaVolumeMute className="text-2xl" />
                                    </div>
                                    <h3 className="text-lg font-bold font-serif text-stone-850">Failed to connect to archive</h3>
                                    <p className="text-stone-500 max-w-md mx-auto text-sm">
                                        {error}
                                    </p>
                                    <button
                                        onClick={fetchLectures}
                                        className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                                    >
                                        Retry Connection
                                    </button>
                                </div>
                            ) : paginatedLectures.length > 0 ? (
                                paginatedLectures.map((lecture) => {
                                    const isExpanded = selectedLectureId === lecture._id;
                                    const isCurrentlyPlayingThis = isPlaying && selectedLectureId === lecture._id;
                                    return (
                                        <div
                                            key={lecture._id}
                                            id={`lecture-card-${lecture._id}`}
                                            className={`bg-white rounded-2xl border overflow-hidden transition-all duration-500 ${isExpanded
                                                    ? 'border-amber-500 shadow-md ring-4 ring-amber-500/5'
                                                    : 'border-stone-150 hover:border-amber-300 hover:shadow-md'
                                                }`}
                                        >
                                            {/* Card Main Block */}
                                            <div
                                                onClick={() => setSelectedLectureId(isExpanded ? null : lecture._id)}
                                                className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors hover:bg-stone-50/50"
                                            >
                                                <div className="space-y-3 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-xxs font-mono font-bold uppercase tracking-wider bg-orange-100 text-orange-955 px-2 py-0.5 rounded-md">
                                                            {lecture.code}
                                                        </span>
                                                        <span className="text-xxs uppercase font-bold bg-stone-105 text-stone-600 px-2 py-0.5 rounded-md tracking-wider">
                                                            {lecture.type}
                                                        </span>
                                                        {lecture.scripture && (
                                                            <span className="text-xxs bg-amber-50 text-amber-900 border border-amber-200/30 px-2 py-0.5 rounded-md font-serif italic font-bold">
                                                                {lecture.scripture} {lecture.verses}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className={`text-lg font-serif font-bold transition-colors ${isExpanded ? 'text-orange-900' : 'text-gray-900'
                                                        }`}>
                                                        {highlightText(lecture.title, searchText)}
                                                    </h3>

                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-500 font-medium">
                                                        <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-orange-505" /> {lecture.date}</span>
                                                        <span className="hidden md:inline text-stone-200">|</span>
                                                        <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-orange-505" /> {highlightText(lecture.location, searchText)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                                                    <div className="flex items-center gap-3">
                                                        {isCurrentlyPlayingThis && <AudioVisualizer isPlaying={isPlaying} />}
                                                        <span className="text-xs font-mono text-stone-400 font-semibold">{lecture.duration}</span>
                                                    </div>
                                                    <button
                                                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md ${isExpanded
                                                                ? 'bg-gradient-to-r from-orange-650 to-amber-500 text-white hover:scale-105'
                                                                : 'bg-orange-55 text-orange-700 hover:bg-orange-600 hover:text-white hover:scale-105'
                                                            }`}
                                                    >
                                                        {isExpanded ? <FaBookOpen className="text-sm animate-pulse" /> : <FaPlay className="text-xs ml-0.5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded Workspace Area */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                                        className="border-t border-stone-100 bg-[#faf9f6]/95 overflow-hidden"
                                                    >
                                                        <div className="p-5 sm:p-6 space-y-6">

                                                            {/* Custom Local Player Widget */}
                                                            <div className="bg-gradient-to-br from-[#ffffff] to-[#faf9f6] rounded-2xl p-5 border border-stone-200/60 shadow-sm space-y-4 relative overflow-hidden">
                                                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>

                                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                                    <div>
                                                                        <span className="text-[10px] uppercase tracking-widest font-bold text-stone-450">Active Recording</span>
                                                                        <h4 className="text-sm font-bold text-stone-850 font-serif">{lecture.title} ({lecture.code})</h4>
                                                                    </div>

                                                                    {/* Speed dial */}
                                                                    <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1">
                                                                        <span className="text-[10px] text-stone-450 font-bold uppercase tracking-wider">Speed:</span>
                                                                        <select
                                                                            value={playbackSpeed}
                                                                            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                                                                            className="bg-transparent border-none text-xs font-mono font-bold text-stone-700 outline-none cursor-pointer p-0"
                                                                        >
                                                                            <option value="0.75">0.75x</option>
                                                                            <option value="1.0">1.0x (Normal)</option>
                                                                            <option value="1.25">1.25x</option>
                                                                            <option value="1.5">1.5x</option>
                                                                            <option value="1.75">1.75x</option>
                                                                            <option value="2.0">2.0x</option>
                                                                        </select>
                                                                    </div>
                                                                </div>

                                                                {/* Time Progress slider */}
                                                                <div className="space-y-1">
                                                                    <div className="relative group py-1">
                                                                        <input
                                                                            type="range"
                                                                            min={0}
                                                                            max={duration || 100}
                                                                            value={currentTime}
                                                                            onChange={handleSeek}
                                                                            className="w-full h-1.5 rounded-lg bg-stone-200 appearance-none cursor-pointer accent-orange-600 outline-none group-hover:h-2 transition-all"
                                                                        />
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-xs font-mono text-stone-400">
                                                                        <span>{formatTime(currentTime)}</span>
                                                                        <span>{formatTime(duration)}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Buttons layout */}
                                                                <div className="flex flex-wrap items-center justify-between gap-4 pt-1.5 border-t border-stone-100">
                                                                    <div className="flex items-center gap-3">
                                                                        <button
                                                                            onClick={() => handleSkipSeconds(-10)}
                                                                            title="Rewind 10s"
                                                                            className="w-9 h-9 rounded-full bg-stone-50 hover:bg-orange-50 text-stone-655 hover:text-orange-700 flex items-center justify-center transition border border-stone-200"
                                                                        >
                                                                            <FaBackward className="text-[10px]" />
                                                                        </button>

                                                                        <button
                                                                            onClick={() => setIsPlaying(!isPlaying)}
                                                                            className="w-11 h-11 rounded-full bg-gradient-to-r from-orange-655 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
                                                                        >
                                                                            {isCurrentlyPlayingThis ? <FaPause className="text-sm" /> : <FaPlay className="text-xs ml-0.5" />}
                                                                        </button>

                                                                        <button
                                                                            onClick={() => handleSkipSeconds(10)}
                                                                            title="Fast Forward 10s"
                                                                            className="w-9 h-9 rounded-full bg-stone-50 hover:bg-orange-50 text-stone-655 hover:text-orange-700 flex items-center justify-center transition border border-stone-200"
                                                                        >
                                                                            <FaForward className="text-[10px]" />
                                                                        </button>
                                                                    </div>

                                                                    {/* Volume widget */}
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            onClick={toggleMute}
                                                                            className="text-stone-550 hover:text-orange-600 p-1.5 transition"
                                                                        >
                                                                            {isMuted || volume === 0 ? <FaVolumeMute className="text-sm" /> : <FaVolumeUp className="text-sm" />}
                                                                        </button>
                                                                        <input
                                                                            type="range"
                                                                            min={0}
                                                                            max={1}
                                                                            step={0.05}
                                                                            value={isMuted ? 0 : volume}
                                                                            onChange={(e) => {
                                                                                const newVol = parseFloat(e.target.value);
                                                                                setVolume(newVol);
                                                                                if (newVol > 0) setIsMuted(false);
                                                                            }}
                                                                            className="w-20 sm:w-24 h-1 rounded-lg bg-stone-200 appearance-none cursor-pointer accent-orange-600 outline-none"
                                                                        />
                                                                    </div>

                                                                    <button
                                                                        onClick={() => handleDownloadTranscript(lecture)}
                                                                        className="px-4 py-2 border border-orange-200 hover:border-orange-600 text-orange-700 font-bold rounded-xl text-xs flex items-center gap-2 transition bg-orange-50/10 shadow-xs"
                                                                    >
                                                                        <FaDownload className="text-xs" /> Download Transcript
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Tabbed Interactive Reader Container */}
                                                            <div className="space-y-4">
                                                                <div className="flex flex-wrap justify-between items-center border-b border-stone-200 pb-3 gap-3">
                                                                    {/* Tabs */}
                                                                    <div className="flex gap-1.5 bg-stone-100 p-1 rounded-xl">
                                                                        <button
                                                                            onClick={() => setReaderTab('transcript')}
                                                                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${readerTab === 'transcript'
                                                                                    ? 'bg-white text-orange-955 shadow-sm font-bold'
                                                                                    : 'text-stone-500 hover:text-stone-900'
                                                                                }`}
                                                                        >
                                                                            Read Transcript
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setReaderTab('details')}
                                                                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${readerTab === 'details'
                                                                                    ? 'bg-white text-orange-955 shadow-sm font-bold'
                                                                                    : 'text-stone-500 hover:text-stone-900'
                                                                                }`}
                                                                        >
                                                                            Sanskrit & Details
                                                                        </button>
                                                                    </div>

                                                                    {/* Reader controls */}
                                                                    <div className="flex items-center gap-4 text-xs text-stone-500 font-semibold">

                                                                        {/* Theme switcher */}
                                                                        <div className="flex items-center gap-2">
                                                                            <span>Theme:</span>
                                                                            <div className="flex gap-1">
                                                                                <button
                                                                                    onClick={() => setReaderTheme('cream')}
                                                                                    title="Cream (Default)"
                                                                                    className={`w-5 h-5 rounded-full bg-[#fdfcf7] border shadow-xs transition ${readerTheme === 'cream' ? 'ring-2 ring-orange-500 border-transparent scale-110' : 'border-stone-300'}`}
                                                                                />
                                                                                <button
                                                                                    onClick={() => setReaderTheme('sepia')}
                                                                                    title="Parchment Sepia"
                                                                                    className={`w-5 h-5 rounded-full bg-[#f4ecd8] border shadow-xs transition ${readerTheme === 'sepia' ? 'ring-2 ring-orange-500 border-transparent scale-110' : 'border-stone-350'}`}
                                                                                />
                                                                                <button
                                                                                    onClick={() => setReaderTheme('dark')}
                                                                                    title="Night reading"
                                                                                    className={`w-5 h-5 rounded-full bg-[#1a1512] border shadow-xs transition ${readerTheme === 'dark' ? 'ring-2 ring-orange-500 border-transparent scale-110' : 'border-stone-700'}`}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="w-px h-4 bg-stone-250"></div>

                                                                        {/* Font resizing */}
                                                                        <div className="flex items-center gap-2">
                                                                            <FaFont className="text-stone-400 text-xxs" />
                                                                            <button
                                                                                onClick={() => setReaderFontSize(prev => Math.max(14, prev - 2))}
                                                                                disabled={readerFontSize <= 14}
                                                                                className="w-7 h-7 bg-white border border-stone-250 rounded-lg flex items-center justify-center font-bold hover:bg-orange-55 hover:text-orange-700 disabled:opacity-40 transition"
                                                                            >
                                                                                A-
                                                                            </button>
                                                                            <span className="font-mono text-center w-5 font-bold text-stone-700">{readerFontSize}</span>
                                                                            <button
                                                                                onClick={() => setReaderFontSize(prev => Math.min(28, prev + 2))}
                                                                                disabled={readerFontSize >= 28}
                                                                                className="w-7 h-7 bg-white border border-stone-250 rounded-lg flex items-center justify-center font-bold hover:bg-orange-55 hover:text-orange-700 disabled:opacity-40 transition"
                                                                            >
                                                                                A+
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Reading Window */}
                                                                <div
                                                                    className={`rounded-2xl p-6 border transition-all duration-300 max-h-[30rem] overflow-y-auto leading-loose font-serif shadow-inner border-t-4 border-t-amber-500/75 ${getReaderThemeClasses()}`}
                                                                    style={{ fontSize: `${readerFontSize}px` }}
                                                                >
                                                                    {readerTab === 'transcript' ? (
                                                                        <div className="whitespace-pre-line space-y-4 antialiased">
                                                                            {highlightText(lecture.transcript, searchText)}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-6">
                                                                            {/* Scripture citation */}
                                                                            {lecture.scripture && (
                                                                                <div className="border-l-4 border-orange-500 pl-4 py-1.5 bg-orange-50/5">
                                                                                    <span className="text-[10px] uppercase font-sans font-black tracking-widest text-orange-800 block mb-1">Scripture Reference</span>
                                                                                    <h5 className="font-bold text-lg text-stone-900">{lecture.scripture} {lecture.verses}</h5>
                                                                                </div>
                                                                            )}

                                                                            {/* Sanskrit Text */}
                                                                            {lecture.sanskrit && (
                                                                                <div className="bg-orange-50/5 p-5 rounded-2xl border border-orange-100/30 shadow-xs">
                                                                                    <span className="text-[10px] uppercase font-sans font-black tracking-widest text-stone-400 block mb-3">Sanskrit Verses</span>
                                                                                    <div className="text-center font-bold leading-loose text-orange-950 font-serif whitespace-pre text-base sm:text-lg">
                                                                                        {lecture.sanskrit}
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {/* Translation */}
                                                                            {lecture.translation && (
                                                                                <div className="space-y-1.5">
                                                                                    <span className="text-[10px] uppercase font-sans font-black tracking-widest text-stone-400 block">Translation</span>
                                                                                    <p className="italic text-stone-850 bg-stone-50/10 p-3 rounded-xl border border-stone-200/40">{lecture.translation}</p>
                                                                                </div>
                                                                            )}

                                                                            <div className="h-px bg-stone-200"></div>

                                                                            {/* Summary */}
                                                                            <div className="space-y-1.5">
                                                                                <span className="text-[10px] uppercase font-sans font-black tracking-widest text-stone-400 block">Summary & Context</span>
                                                                                <p className="text-sm text-stone-600 font-sans leading-relaxed">{lecture.summary}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="bg-white text-center py-16 px-6 rounded-2xl border border-orange-100/40 shadow-sm space-y-4">
                                    <FaBookOpen className="text-stone-300 text-5xl mx-auto" />
                                    <h3 className="text-lg font-bold font-serif text-stone-850">No recordings found</h3>
                                    <p className="text-stone-500 max-w-md mx-auto text-sm">
                                        We couldn&apos;t find any results matching your search &quot;{searchText}&quot; or current filters. Try adjusting your parameters.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchText('');
                                            setFilterType(null);
                                            setFilterYear(null);
                                            setFilterLocation(null);
                                            setFilterScripture(null);
                                        }}
                                        className="mt-2 px-5 py-2.5 bg-gradient-to-r from-orange-655 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Pagination Bar */}
                        {totalPages > 1 && (
                            <div className="flex justify-center pt-6">
                                <nav className="inline-flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-full shadow-md border border-orange-100/30">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3.5 py-1.5 bg-stone-55 border border-stone-200 rounded-full text-xs text-stone-650 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 disabled:opacity-40 transition font-bold disabled:pointer-events-none"
                                    >
                                        Prev
                                    </button>

                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const pageIndex = i + 1;
                                        const isCurrent = currentPage === pageIndex;
                                        return (
                                            <button
                                                key={pageIndex}
                                                onClick={() => setCurrentPage(pageIndex)}
                                                className={`w-8 h-8 rounded-full text-xs flex items-center justify-center transition font-bold ${isCurrent
                                                        ? 'bg-gradient-to-r from-orange-655 to-amber-500 text-white shadow-sm'
                                                        : 'bg-white hover:bg-orange-50 text-stone-650'
                                                    }`}
                                            >
                                                {pageIndex}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3.5 py-1.5 bg-stone-55 border border-stone-200 rounded-full text-xs text-stone-650 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 disabled:opacity-40 transition font-bold disabled:pointer-events-none"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}

                    </main>
                </div>

            </div>

            {/* PERSISTENT FLOATING BOTTOM PLAYER BAR */}
            <AnimatePresence>
                {selectedLecture && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 15 }}
                        className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 z-50 bg-stone-900/95 backdrop-blur-md text-white rounded-2xl border border-stone-800 p-4 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto"
                    >
                        {/* Mini Cassette Thumbnail / Info */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden border border-white/10 flex-shrink-0">
                                <div className="absolute inset-1 border border-dotted border-white/20 rounded-lg pointer-events-none"></div>
                                <FaBook className="text-white text-lg" />
                            </div>
                            <div className="text-left min-w-0 flex-1">
                                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">{selectedLecture.code}</span>
                                <h4 className="text-sm font-bold truncate font-serif text-stone-100">{selectedLecture.title}</h4>
                                <div className="flex items-center gap-2 text-xxs text-stone-400 font-bold uppercase mt-0.5">
                                    <span>{selectedLecture.location}</span>
                                    <span>•</span>
                                    <span>{selectedLecture.duration}</span>
                                </div>
                            </div>
                            {/* Floating indicator visualizer */}
                            <div className="flex-shrink-0 bg-white/5 p-2 rounded-xl border border-white/5">
                                <AudioVisualizer isPlaying={isPlaying} />
                            </div>
                        </div>

                        {/* Scrubber Timeline (Center panel) */}
                        <div className="flex-1 w-full md:max-w-xl flex items-center gap-3">
                            <span className="text-xxs font-mono text-stone-400">{formatTime(currentTime)}</span>
                            <div className="flex-1 relative group flex items-center">
                                <input
                                    type="range"
                                    min={0}
                                    max={duration || 100}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-1 bg-stone-750 appearance-none cursor-pointer accent-amber-500 rounded-lg outline-none group-hover:h-1.5 transition-all"
                                />
                            </div>
                            <span className="text-xxs font-mono text-stone-400">{formatTime(duration)}</span>
                        </div>

                        {/* Player controls */}
                        <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                            {/* Skip/Play tools */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleSkipSeconds(-10)}
                                    title="Rewind 10s"
                                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white flex items-center justify-center transition border border-white/5"
                                >
                                    <FaBackward className="text-xxs" />
                                </button>

                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-10 h-10 rounded-full bg-white hover:bg-amber-100 text-stone-900 flex items-center justify-center shadow-lg transform active:scale-95 transition-all"
                                >
                                    {isPlaying ? <FaPause className="text-xs" /> : <FaPlay className="text-xxs ml-0.5" />}
                                </button>

                                <button
                                    onClick={() => handleSkipSeconds(10)}
                                    title="Fast Forward 10s"
                                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white flex items-center justify-center transition border border-white/5"
                                >
                                    <FaForward className="text-xxs" />
                                </button>
                            </div>

                            {/* Floating Volume */}
                            <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-xl px-2.5 py-1 border border-white/5">
                                <button
                                    onClick={toggleMute}
                                    className="text-stone-300 hover:text-white transition"
                                >
                                    {isMuted || volume === 0 ? <FaVolumeMute className="text-xs" /> : <FaVolumeUp className="text-xs" />}
                                </button>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => {
                                        const newVol = parseFloat(e.target.value);
                                        setVolume(newVol);
                                        if (newVol > 0) setIsMuted(false);
                                    }}
                                    className="w-16 h-1 rounded-lg bg-stone-750 appearance-none cursor-pointer accent-white"
                                />
                            </div>

                            {/* Scroll to current drawer focus */}
                            <button
                                onClick={scrollToActiveLecture}
                                title="Locate Active Transcript Card"
                                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xxs flex items-center gap-1.5 transition-all shadow-md active:scale-95 flex-shrink-0"
                            >
                                <FaArrowUp className="text-xxs" /> Show Transcript
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default LecturesClient;
