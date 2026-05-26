'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    FaCalendarAlt, FaClock, FaUsers, FaStar, FaSearch,
    FaFilter, FaMapMarkerAlt, FaGraduationCap, FaArrowRight,
    FaTag, FaChevronDown, FaChevronUp
} from 'react-icons/fa';

// ─── Reusing shared course data ───────────────────────────────────────────────
const upcomingCourses = [
    {
        id: 'bhagavad-gita-essentials',
        title: 'Bhagavad Gita Essentials',
        tagline: 'Unlock the timeless wisdom of the Song of God',
        description: 'A comprehensive foundational study of all 18 chapters of the Bhagavad Gita with practical application for modern life.',
        image: '/images/courses/bhagavad-gita.jpg',
        bannerColor: 'from-orange-500 to-amber-500',
        duration: '8 weeks',
        schedule: 'Saturdays, 10:00 AM – 12:00 PM',
        startDate: '2026-03-08',
        enrolledCount: 1245,
        maxSeats: 60,
        instructor: 'HH Radha Krishna Das',
        level: 'Beginner' as const,
        category: 'Scripture Study',
        rating: 4.9,
        featured: true,
        price: 'Free' as const,
        language: 'English / Bengali',
        location: 'ISKCON Durgapur + Online',
        mode: 'Hybrid',
        certificate: true,
        daysLeft: 13,
    },
    {
        id: 'mantra-meditation',
        title: 'ISKCON Disciple Course',
        tagline: 'Prepare for initiation with depth and clarity',
        description: 'Official ISKCON preparation course covering the guru-disciple relationship, Vaishnava etiquette, and sadhana standards.',
        image: '/images/courses/meditation.jpg',
        bannerColor: 'from-purple-600 to-indigo-600',
        duration: '4 weeks',
        schedule: 'Wednesdays, 6:30 PM – 8:00 PM',
        startDate: '2026-03-18',
        enrolledCount: 890,
        maxSeats: 40,
        instructor: 'HG Yamuna Devi Dasi',
        level: 'Beginner' as const,
        category: 'Devotee Training',
        rating: 4.8,
        featured: true,
        price: 400,
        originalPrice: 600,
        language: 'English / Hindi',
        location: 'ISKCON Durgapur',
        mode: 'Offline',
        certificate: true,
        daysLeft: 23,
    },
    {
        id: 'bhakti-yoga-philosophy',
        title: 'Pujari Course',
        tagline: 'Learn the sacred art of Deity worship',
        description: 'Intensive 12-week hands-on training in all aspects of Deity seva — from arati procedures to dressing and offering bhoga.',
        image: '/images/courses/bhakti-yoga.jpg',
        bannerColor: 'from-rose-600 to-pink-500',
        duration: '12 weeks',
        schedule: 'Tuesdays & Thursdays, 7:00 PM – 8:30 PM',
        startDate: '2026-04-01',
        enrolledCount: 675,
        maxSeats: 25,
        instructor: 'HG Govinda Das',
        level: 'Intermediate' as const,
        category: 'Temple Service',
        rating: 4.7,
        featured: false,
        price: 1200,
        language: 'Bengali / Hindi',
        location: 'ISKCON Durgapur Temple',
        mode: 'Offline',
        certificate: true,
        daysLeft: 37,
    },
    {
        id: 'srimad-bhagavatam',
        title: 'Srimad Bhagavatam: First Canto',
        tagline: 'The ripened fruit of the tree of Vedic knowledge',
        description: 'A 16-week deep study of the First Canto with recorded lectures by HH Bhakti Charu Swami, supplemented by live discussions.',
        image: '/images/courses/bhagavatam.jpg',
        bannerColor: 'from-amber-600 to-yellow-500',
        duration: '16 weeks',
        schedule: 'Fridays, 5:30 PM – 7:30 PM',
        startDate: '2026-05-01',
        enrolledCount: 560,
        maxSeats: 35,
        instructor: 'HG Madhava Das',
        level: 'Advanced' as const,
        category: 'Scripture Study',
        rating: 4.9,
        featured: false,
        price: 2499,
        language: 'English',
        location: 'ISKCON Durgapur + Online',
        mode: 'Hybrid',
        certificate: true,
        daysLeft: 67,
    },
];

const levelColor: Record<string, string> = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-blue-100 text-blue-800',
    Advanced: 'bg-purple-100 text-purple-800',
};

const categories = Array.from(new Set(upcomingCourses.map(c => c.category)));

export default function UpcomingCoursesPage() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<'date' | 'rating' | 'price'>('date');

    const filtered = upcomingCourses
        .filter(c => {
            const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                c.description.toLowerCase().includes(search.toLowerCase());
            const matchCategory = selectedCategory ? c.category === selectedCategory : true;
            const matchLevel = selectedLevel ? c.level === selectedLevel : true;
            return matchSearch && matchCategory && matchLevel;
        })
        .sort((a, b) => {
            if (sortBy === 'date') return a.daysLeft - b.daysLeft;
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'price') {
                const aPrice = typeof a.price === 'number' ? a.price : 0;
                const bPrice = typeof b.price === 'number' ? b.price : 0;
                return aPrice - bPrice;
            }
            return 0;
        });

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Hero */}
            <section className="relative bg-gradient-to-r from-teal-600 to-cyan-600 py-16 pt-28">
                <div className="absolute inset-0 bg-black/20" />
                {/* Decorative Om symbol */}
                <div className="absolute right-10 top-1/2 -translate-y-1/2 text-white/10 text-[12rem] font-serif select-none hidden lg:block">ॐ</div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                            <FaCalendarAlt /> Upcoming Courses
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                            Begin Your Spiritual Journey
                        </h1>
                        <p className="text-white/85 text-lg mb-8 max-w-2xl">
                            Register early to secure your seat. Our courses fill up fast — especially the popular ones!
                        </p>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-6 text-white">
                            <div className="text-center">
                                <div className="text-3xl font-black">{upcomingCourses.length}</div>
                                <div className="text-xs text-white/70 uppercase tracking-wider">Courses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black">
                                    {upcomingCourses.filter(c => c.price === 'Free').length}
                                </div>
                                <div className="text-xs text-white/70 uppercase tracking-wider">Free</div>
                            </div>
                            <div className="text-center">
                                    {Array.from(new Set(upcomingCourses.map(c => c.category))).length}
                                <div className="text-xs text-white/70 uppercase tracking-wider">Categories</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black">{Math.min(...upcomingCourses.map(c => c.daysLeft))}</div>
                                <div className="text-xs text-white/70 uppercase tracking-wider">Days to Earliest</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Countdown Banner ── */}
            <div className="bg-amber-50 border-b border-amber-200 py-3">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-sm text-amber-800">
                        {upcomingCourses.slice(0, 3).map(c => (
                            <span key={c.id} className="flex items-center gap-2">
                                <FaCalendarAlt className="text-amber-500" />
                                <strong>{c.title}</strong> starts in <strong>{c.daysLeft} days</strong>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="container mx-auto px-4 py-10">
                {/* Search & Filters */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search upcoming courses..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as 'date' | 'rating' | 'price')}
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm bg-white"
                        >
                            <option value="date">Sort: Earliest First</option>
                            <option value="rating">Sort: Highest Rated</option>
                            <option value="price">Sort: Lowest Price</option>
                        </select>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700"
                        >
                            <FaFilter /> Filters {showFilters ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                        </button>
                    </div>

                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100"
                        >
                            <select
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <select
                                value={selectedLevel}
                                onChange={e => setSelectedLevel(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                            >
                                <option value="">All Levels</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                            <button
                                onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedLevel(''); }}
                                className="px-4 py-2 text-sm text-gray-500 hover:text-red-500 underline"
                            >Clear all</button>
                        </motion.div>
                    )}
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600 text-sm">
                        Showing <strong>{filtered.length}</strong> upcoming course{filtered.length !== 1 ? 's' : ''}
                    </p>
                    <Link href="/courses/completed" className="text-sm text-teal-600 hover:underline flex items-center gap-1">
                        View Completed Courses <FaArrowRight size={12} />
                    </Link>
                </div>

                {/* Course Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {filtered.map((course, idx) => {
                            const seatsLeft = course.maxSeats - (course.enrolledCount % course.maxSeats);
                            const seatsPercent = ((course.maxSeats - seatsLeft) / course.maxSeats) * 100;

                            return (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.07 }}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group"
                                >
                                    {/* Image */}
                                    <div className={`relative h-44 bg-gradient-to-br ${course.bannerColor}`}>
                                        <Image
                                            src={course.image}
                                            alt={course.title}
                                            fill
                                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            {course.featured && (
                                                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">⭐ Featured</span>
                                            )}
                                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                🟢 {course.daysLeft}d to start
                                            </span>
                                        </div>
                                        {/* Price */}
                                        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow">
                                            <span className="text-orange-600 font-black text-sm">
                                                {typeof course.price === 'number' ? `₹${course.price.toLocaleString()}` : 'Free'}
                                            </span>
                                            {course.originalPrice && (
                                                <span className="text-gray-400 line-through text-xs ml-1">₹{course.originalPrice}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        {/* Level & Category */}
                                        <div className="flex gap-2 mb-2">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColor[course.level]}`}>{course.level}</span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{course.category}</span>
                                        </div>

                                        <h3 className="font-bold text-gray-800 text-lg leading-snug mb-1 group-hover:text-teal-700 transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-xs text-teal-600 font-medium mb-2">{course.tagline}</p>
                                        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{course.description}</p>

                                        {/* Details */}
                                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                                            <span className="flex items-center gap-1"><FaClock /> {course.duration}</span>
                                            <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(course.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                            <span className="flex items-center gap-1"><FaUsers /> {course.maxSeats - seatsLeft}/{course.maxSeats} enrolled</span>
                                            <span className="flex items-center gap-1"><FaStar className="text-amber-500" /> {course.rating}</span>
                                        </div>

                                        {/* Seats Progress */}
                                        <div className="mb-4">
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
                                                    style={{ width: `${seatsPercent}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{seatsLeft} seats remaining</p>
                                        </div>

                                        {/* Instructor & CTA */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-400">Instructor</p>
                                                <p className="text-xs font-semibold text-gray-700">{course.instructor}</p>
                                            </div>
                                            <Link
                                                href={`/courses/${course.id}`}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold rounded-xl hover:shadow-md transition-all"
                                            >
                                                Register Now <FaArrowRight size={10} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <FaGraduationCap className="mx-auto text-6xl text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-500 mb-2">No courses match your search</h3>
                        <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search terms.</p>
                        <button
                            onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedLevel(''); }}
                            className="btn-primary"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Newsletter CTA */}
                <div className="mt-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-2xl md:text-3xl font-black mb-3">Don&apos;t Miss a New Course Announcement!</h2>
                    <p className="text-white/80 mb-6 max-w-xl mx-auto text-sm">
                        Join 2,000+ devotees who receive our monthly course newsletter with early-bird registration offers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 px-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button className="px-6 py-3 bg-white text-teal-700 font-bold rounded-xl hover:bg-gray-50 transition text-sm">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
