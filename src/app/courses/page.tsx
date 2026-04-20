'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  FaCalendarAlt, FaClock, FaGraduationCap, FaUsers, FaStar,
  FaSearch, FaArrowRight, FaCheckCircle, FaBookOpen, FaSpinner, FaSyncAlt
} from 'react-icons/fa';
import { getCourses, ApiCourse } from '@/lib/api';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const STATUSES = ['All', 'upcoming', 'ongoing', 'completed'];

export default function CoursesPage() {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [status, setStatus] = useState('All');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = { per_page: '50' };
      if (search) params.search = search;
      if (level !== 'All') params.level = level;
      if (status !== 'All') params.status = status;
      const res = await getCourses(params);
      setCourses(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [search, level, status]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const featured = courses.filter(c => c.featured);
  const seatsLeft = (c: ApiCourse) => (c.max_seats ?? 0) - (c.enrolled_count ?? 0);

  const levelColor: Record<string, string> = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-700',
  };
  const statusColor: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-600',
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative py-16 pt-28 bg-gradient-to-br from-orange-700 via-orange-600 to-amber-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FaBookOpen /> Spiritual Education
          </motion.div>
          <motion.h1 className="text-5xl md:text-6xl font-black mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Spiritual Courses
          </motion.h1>
          <motion.p className="text-xl max-w-2xl mx-auto text-white/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Deepen your understanding of Vedic wisdom through expert-led courses
          </motion.p>
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center"><div className="text-3xl font-black">{courses.length || '—'}</div><div className="text-xs text-white/60 uppercase">Total Courses</div></div>
            <div className="text-center"><div className="text-3xl font-black">{featured.length || '—'}</div><div className="text-xs text-white/60 uppercase">Featured</div></div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input type="text" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <select value={level} onChange={e => setLevel(e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
            {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button onClick={fetchCourses} className="p-2 text-orange-500 hover:text-orange-700" title="Refresh"><FaSyncAlt /></button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <FaSpinner className="animate-spin text-orange-500 text-4xl" />
            <span className="ml-4 text-gray-500 text-lg">Loading courses from database…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="max-w-lg mx-auto text-center py-16">
            <p className="text-red-500 font-semibold mb-2">{error}</p>
            <p className="text-sm text-gray-500 mb-6">Make sure the Laravel backend is running on port 8080.</p>
            <button onClick={fetchCourses} className="bg-orange-500 text-white px-6 py-2 rounded-lg">Retry</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-24">
            <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-6" />
            <p className="text-2xl text-gray-400 mb-2">No courses found</p>
            <p className="text-gray-500 text-sm mb-6">Add courses via the admin panel or adjust your filters.</p>
            <Link href="/admin/courses/add" className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm">Add First Course</Link>
          </div>
        )}

        {/* Featured */}
        {!loading && !error && featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-orange-700 mb-6">⭐ Featured Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(course => (
                <motion.div key={course._id} whileHover={{ y: -4 }} className="bg-white rounded-2xl shadow-md overflow-hidden border border-orange-100">
                  <div className={`h-3 bg-gradient-to-r ${course.banner_color || 'from-orange-500 to-amber-400'}`} />
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      {course.level && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor[course.level] || 'bg-gray-100 text-gray-600'}`}>{course.level}</span>}
                      {course.status && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor[course.status] || 'bg-gray-100 text-gray-600'}`}>{course.status}</span>}
                    </div>
                    <h3 className="text-lg font-black mb-1">{course.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                      {course.duration && <span className="flex items-center gap-1"><FaClock className="text-orange-400" />{course.duration}</span>}
                      {course.instructor && <span className="flex items-center gap-1"><FaGraduationCap className="text-orange-400" />{course.instructor}</span>}
                      {course.enrolled_count !== undefined && <span className="flex items-center gap-1"><FaUsers className="text-orange-400" />{course.enrolled_count} enrolled</span>}
                      {course.rating && <span className="flex items-center gap-1"><FaStar className="text-yellow-400" />{course.rating}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-orange-600 text-lg">{course.price === 0 || course.price === 'Free' ? 'Free' : `₹${course.price}`}</span>
                      <Link href={`/courses/${course._id}`} className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-orange-600 transition-colors">
                        Enroll <FaArrowRight className="text-xs" />
                      </Link>
                    </div>
                    {course.max_seats && course.max_seats > 0 && seatsLeft(course) <= 10 && seatsLeft(course) > 0 && (
                      <p className="text-xs text-red-500 mt-2 font-medium">Only {seatsLeft(course)} seats left!</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All Courses */}
        {!loading && !error && courses.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-orange-700 mb-6">All Courses ({courses.length})</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <motion.div key={course._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className={`h-2 bg-gradient-to-r ${course.banner_color || 'from-orange-500 to-amber-400'}`} />
                  <div className="p-5">
                    <div className="flex gap-2 mb-2">
                      {course.level && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColor[course.level] || 'bg-gray-100 text-gray-600'}`}>{course.level}</span>}
                      {course.status && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[course.status] || 'bg-gray-100 text-gray-600'}`}>{course.status}</span>}
                      {course.certificate && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 flex items-center gap-1"><FaCheckCircle className="text-xs" />Certificate</span>}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{course.title}</h3>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-3">
                      {course.duration && <span><FaClock className="inline text-orange-400 mr-1" />{course.duration}</span>}
                      {course.start_date && <span><FaCalendarAlt className="inline text-orange-400 mr-1" />{new Date(course.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                      {course.language && <span>🌐 {course.language}</span>}
                    </div>
                    <div className="flex items-center justify-between border-t pt-3 mt-1">
                      <span className="font-black text-orange-600">{course.price === 0 || course.price === 'Free' ? '🆓 Free' : `₹${course.price}`}</span>
                      <Link href={`/courses/${course._id}`} className="text-orange-500 text-sm font-medium hover:underline flex items-center gap-1">
                        Details <FaArrowRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}