"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaPlay, FaPause, FaDownload, FaSearch, FaFilter, FaBookOpen } from 'react-icons/fa';

// Enhanced mock data to support Vedabase-style facets
const lectures = [
    {
        id: 1,
        title: "The Process of Devotional Service",
        date: "August 15, 1966",
        location: "New York",
        year: "1966",
        type: "Lecture",
        duration: "45:32",
        summary: "Srila Prabhupada explains the nine processes of devotional service and how to practically apply them in our daily lives.",
        audioUrl: "/lectures/devotional-service-1966.mp3",
        verses: "Bhagavad-gita 9.34"
    },
    {
        id: 2,
        title: "Understanding Krishna Consciousness",
        date: "February 23, 1967",
        location: "San Francisco",
        year: "1967",
        type: "Lecture",
        duration: "52:18",
        summary: "A comprehensive explanation of what Krishna consciousness is and how it differs from other spiritual practices.",
        audioUrl: "/lectures/krishna-consciousness-1967.mp3",
        verses: "Srimad-Bhagavatam 1.2.6"
    },
    {
        id: 3,
        title: "The Importance of Guru",
        date: "July 12, 1969",
        location: "London",
        year: "1969",
        type: "Lecture",
        duration: "48:15",
        summary: "Srila Prabhupada discusses the essential role of the spiritual master in spiritual advancement.",
        audioUrl: "/lectures/importance-of-guru-1969.mp3",
        verses: "Guru Vandana"
    },
    {
        id: 4,
        title: "Chanting Hare Krishna",
        date: "March 8, 1970",
        location: "Los Angeles",
        year: "1970",
        type: "Conversation",
        duration: "55:40",
        summary: "An in-depth discussion on the importance and benefits of chanting the Hare Krishna maha-mantra.",
        audioUrl: "/lectures/chanting-hare-krishna-1970.mp3",
        verses: "Siksastakam Prayers"
    },
    {
        id: 5,
        title: "The Science of Self-Realization",
        date: "September 30, 1971",
        location: "Nairobi",
        year: "1971",
        type: "Lecture",
        duration: "49:25",
        summary: "Prabhupada explains how Krishna consciousness is a scientific process for understanding the self and God.",
        audioUrl: "/lectures/self-realization-1971.mp3",
        verses: "Bhagavad-gita 2.13"
    }
];

// Mock Facet Data
const facets = {
    types: [
        { name: "Lectures and Addresses", count: 394 },
        { name: "Conversation", count: 125 },
        { name: "Srimad-Bhagavatam", count: 86 },
        { name: "Bhagavad-gita", count: 42 },
        { name: "Walk", count: 15 },
    ],
    years: [
        { name: "1966", count: 45 },
        { name: "1967", count: 52 },
        { name: "1968", count: 38 },
        { name: "1969", count: 64 },
        { name: "1970", count: 71 },
        { name: "1971", count: 55 },
    ],
    locations: [
        { name: "New York", count: 88 },
        { name: "Los Angeles", count: 76 },
        { name: "London", count: 62 },
        { name: "Bombay", count: 45 },
        { name: "Vrindavan", count: 94 },
    ]
};

const LecturesClient: React.FC = () => {
    const [currentLecture, setCurrentLecture] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState<'audio' | 'transcript'>('transcript');

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleLectureSelect = (id: number) => {
        setCurrentLecture(id === currentLecture ? null : id); // Toggle selection
        setIsPlaying(false);
    };

    const selectedLecture = lectures.find(l => l.id === currentLecture);

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans">
            {/* Header - Vedabase Style */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            {/* Replaced with simple text or existing logo component if available */}
                            <span className="text-xl font-bold tracking-tight text-red-800">ISKCON <span className="text-gray-600 font-normal">Durgapur</span></span>
                        </Link>
                        <span className="h-6 w-px bg-gray-300 hidden md:block"></span>
                        <h1 className="text-lg font-medium text-gray-700 hidden md:block">Bhaktivedanta Vedabase</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-gray-100 border-none rounded-full py-1.5 px-4 text-sm focus:ring-2 focus:ring-red-800 w-48 transition-all focus:w-64"
                            />
                            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        </div>
                        <button className="p-2 text-gray-600 hover:text-red-800 transition-colors">
                            <FaBookOpen />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar - Facets */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Filter By Type</h3>
                            <ul className="space-y-1">
                                {facets.types.map((type) => (
                                    <li key={type.name} className="flex items-center justify-between group cursor-pointer">
                                        <span className="text-sm text-gray-700 group-hover:text-red-800 transition-colors">{type.name}</span>
                                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{type.count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Filter By Year</h3>
                            <ul className="space-y-1 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                                {facets.years.map((year) => (
                                    <li key={year.name} className="flex items-center justify-between group cursor-pointer">
                                        <span className="text-sm text-gray-700 group-hover:text-red-800 transition-colors">{year.name}</span>
                                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{year.count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Filter By Location</h3>
                            <ul className="space-y-1">
                                {facets.locations.map((loc) => (
                                    <li key={loc.name} className="flex items-center justify-between group cursor-pointer">
                                        <span className="text-sm text-gray-700 group-hover:text-red-800 transition-colors">{loc.name}</span>
                                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{loc.count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Main Content - List View for Archival Feel */}
                    <main className="flex-1">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-800">Transcripts & Audio</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>Sort by:</span>
                                    <select className="bg-transparent border-none font-medium text-gray-800 focus:ring-0 cursor-pointer">
                                        <option>Date (Newest)</option>
                                        <option>Date (Oldest)</option>
                                        <option>Title</option>
                                    </select>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {lectures.map((lecture) => (
                                    <div key={lecture.id} className={`group hover:bg-red-50 transition-colors duration-200 ${currentLecture === lecture.id ? 'bg-red-50 ring-1 ring-inset ring-red-100' : ''}`}>
                                        <div className="px-6 py-4 cursor-pointer" onClick={() => handleLectureSelect(lecture.id)}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-base font-semibold text-red-900 group-hover:text-red-700 mb-1 font-serif">
                                                        {lecture.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                                        <span>{lecture.date}</span>
                                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                        <span>{lecture.location}</span>
                                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                        <span className="uppercase text-xs tracking-wide bg-gray-100 px-1.5 rounded">{lecture.type}</span>
                                                    </div>
                                                </div>
                                                <div className="text-gray-400">
                                                    {currentLecture === lecture.id ? <FaBookOpen className="text-red-800" /> : <FaPlay className="text-xs group-hover:text-red-500" />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Detail View - Like opening a drawer in the archive */}
                                        {currentLecture === lecture.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-6 pb-6 bg-red-50/50 border-t border-red-100"
                                            >
                                                <div className="pt-4 flex flex-col md:flex-row gap-6">
                                                    {/* Audio Player Section */}
                                                    <div className="md:w-1/3 space-y-4">
                                                        <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-xs font-semibold text-gray-500 uppercase">Audio Player</span>
                                                                <span className="text-xs text-gray-400">{lecture.duration}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
                                                                    className="w-10 h-10 flex items-center justify-center bg-red-800 text-white rounded-full hover:bg-red-700 transition"
                                                                >
                                                                    {isPlaying ? <FaPause className="text-sm" /> : <FaPlay className="text-sm ml-0.5" />}
                                                                </button>
                                                                <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-red-800 w-1/3"></div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-3 flex justify-end">
                                                                <button className="text-xs flex items-center gap-1 text-gray-600 hover:text-red-800">
                                                                    <FaDownload /> Download MP3
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Details & Summary */}
                                                    <div className="md:w-2/3">
                                                        <div className="prose prose-sm prose-red max-w-none">
                                                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Summary</h4>
                                                            <p className="text-gray-700 leading-relaxed">{lecture.summary}</p>

                                                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest mt-4 mb-2">References</h4>
                                                            <p className="font-serif italic text-gray-800 bg-white inline-block px-3 py-1 border border-gray-200 rounded-sm">
                                                                {lecture.verses}
                                                            </p>
                                                        </div>
                                                        <div className="mt-4 pt-4 border-t border-red-100 flex gap-3">
                                                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:border-red-800 hover:text-red-800 transition">
                                                                Read Full Transcript
                                                            </button>
                                                            <button className="px-4 py-2 bg-transparent text-gray-600 text-sm hover:text-red-800 transition">
                                                                Share
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center pb-8">
                            <nav className="flex items-center gap-1">
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                                <button className="px-3 py-1 bg-red-800 text-white border border-red-800 rounded-md text-sm">1</button>
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">2</button>
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">3</button>
                                <span className="px-2 text-gray-400">...</span>
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">Next</button>
                            </nav>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default LecturesClient;
