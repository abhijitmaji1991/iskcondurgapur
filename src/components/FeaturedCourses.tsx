'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaGraduationCap, FaArrowRight, FaCalendarAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { getCourses, ApiCourse } from '@/lib/api';

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

export default function FeaturedCourses() {
    const [courses, setCourses] = useState<ApiCourse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeatured() {
            try {
                // Fetch courses, assuming the API returns latest first
                const res = await getCourses({ per_page: '10' });
                // Filter to show either featured courses or just the latest 3
                const fetched = res.data || [];
                const featured = fetched.filter(c => c.featured);
                const toShow = featured.length > 0 ? featured.slice(0, 3) : fetched.slice(0, 3);
                setCourses(toShow);
            } catch (error) {
                console.error("Failed to load featured courses", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeatured();
    }, []);

    if (loading) {
        return (
            <div className="py-16 bg-white text-center">
                <FaSpinner className="animate-spin text-orange-500 text-3xl mx-auto mb-4" />
                <p className="text-gray-500">Loading featured courses...</p>
            </div>
        );
    }

    if (courses.length === 0) {
        return null; // Don't show the section if there are no courses
    }

    return (
        <section className="py-20 bg-gray-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <span className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-2 block">Education</span>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Featured Courses</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Deepen your spiritual understanding with our expertly guided courses and scripture studies.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {courses.map((course, i) => (
                        <motion.div 
                            key={course._id} 
                            initial={{ opacity: 0, y: 30 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }} 
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full"
                        >
                            <div className={`h-2 bg-gradient-to-r ${course.banner_color || 'from-orange-500 to-amber-400'}`} />
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex gap-2 mb-3">
                                    {course.level && (
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${levelColor[course.level] || 'bg-gray-100 text-gray-600'}`}>
                                            {course.level}
                                        </span>
                                    )}
                                    {course.status && (
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md capitalize ${statusColor[course.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {course.status}
                                        </span>
                                    )}
                                    {course.certificate && (
                                        <span className="text-xs font-bold px-2 py-1 rounded-md bg-purple-100 text-purple-700 flex items-center gap-1">
                                            <FaCheckCircle className="text-xs" /> Cert
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">
                                    {course.tagline || course.description}
                                </p>
                                
                                <div className="space-y-2 mb-6 border-t border-gray-50 pt-4">
                                    {course.duration && (
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <FaClock className="text-orange-400" /> 
                                            <span>{course.duration}</span>
                                        </div>
                                    )}
                                    {course.start_date && (
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <FaCalendarAlt className="text-orange-400" /> 
                                            <span>Starts {new Date(course.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                    <span className="font-black text-lg text-gray-900">
                                        {course.price === 0 || course.price === 'Free' ? 'Free' : `₹${course.price}`}
                                    </span>
                                    <Link 
                                        href={`/courses/${course._id}`} 
                                        className="inline-flex items-center justify-center gap-2 bg-orange-50 text-orange-600 font-bold px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-colors text-sm"
                                    >
                                        View Details <FaArrowRight />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link 
                        href="/courses" 
                        className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 hover:border-orange-500 hover:text-orange-600 font-bold px-8 py-3 rounded-xl transition-all shadow-sm"
                    >
                        View All Courses <FaArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
}
