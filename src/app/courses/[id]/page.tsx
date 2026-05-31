'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCalendarAlt, FaClock, FaGraduationCap, FaUsers, FaStar,
    FaArrowLeft, FaCheckCircle, FaPlayCircle, FaBook, FaUser,
    FaMapMarkerAlt, FaLanguage, FaChevronDown, FaChevronUp,
    FaWhatsapp, FaPhone, FaEnvelope, FaShieldAlt, FaTag, FaSpinner
} from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { getCourse, ApiCourse } from '@/lib/api';

const levelColor: Record<string, string> = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-blue-100 text-blue-800',
    Advanced: 'bg-purple-100 text-purple-800',
};

function RegistrationForm({ course }: { course: ApiCourse }) {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate registration call
        await new Promise(r => setTimeout(r, 1500));
        setSubmitting(false);
        setSuccess(true);
    };

    if (success) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 px-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-green-500 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Registration Received!</h3>
                <p className="text-gray-600 mb-6">
                    Thank you, <strong>{form.name}</strong>! We will contact you within 24 hours on <strong>{form.email}</strong>.
                </p>
                <Link href="/courses" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors">
                    Browse More Courses
                </Link>
            </motion.div>
        );
    }

    const priceNum = typeof course.price === 'number' ? course.price : Number(course.price) || 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                <input required type="text" placeholder="Your full name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 text-sm" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                <input required type="email" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 text-sm" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                <input required type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 text-sm" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Any Questions? (Optional)</label>
                <textarea rows={3} placeholder="Write anything you would like us to know..." value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 text-sm resize-none" />
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Course Fee</span>
                    <span className="font-bold text-gray-800">
                        {priceNum === 0 ? 'Free' : `Rs.${priceNum.toLocaleString()}`}
                    </span>
                </div>
            </div>

            <button type="submit" disabled={submitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {submitting ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Processing...
                    </span>
                ) : (
                    <>{priceNum === 0 ? 'Register for Free' : 'Pay & Register'}</>
                )}
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
                <FaShieldAlt className="text-green-500" />
                <span>Secure registration. No spam, ever.</span>
            </div>

            <div className="flex gap-3 pt-2">
                <a href="https://wa.me/916291436256" target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 border border-green-400 text-green-700 rounded-xl text-sm hover:bg-green-50 transition-colors">
                    <FaWhatsapp /> WhatsApp
                </a>
                <a href="tel:+916291436256"
                    className="flex-1 flex items-center justify-center gap-2 py-2 border border-blue-300 text-blue-700 rounded-xl text-sm hover:bg-blue-50 transition-colors">
                    <FaPhone /> Call Us
                </a>
            </div>
        </form>
    );
}

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
            <button onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center px-5 py-4 text-left bg-white hover:bg-orange-50 transition-colors">
                <span className="font-semibold text-gray-800 text-sm">{faq.q}</span>
                {open ? <FaChevronUp className="text-orange-500 shrink-0" /> : <FaChevronDown className="text-gray-400 shrink-0" />}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <p className="px-5 py-4 text-sm text-gray-600 bg-gray-50 border-t border-gray-100">{faq.a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function CourseDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    
    const [course, setCourse] = useState<ApiCourse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourse() {
            try {
                const res = await getCourse(id);
                setCourse(res.data);
            } catch (error) {
                console.error("Failed to fetch course", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="flex items-center justify-center flex-col">
                    <FaSpinner className="animate-spin text-orange-500 text-4xl mb-4" />
                    <span className="text-gray-500 text-lg">Loading course details...</span>
                </div>
            </main>
        );
    }

    if (!course) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaGraduationCap className="mx-auto text-6xl text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Course Not Found</h2>
                    <p className="text-gray-500 mb-6">The course you are looking for does not exist.</p>
                    <Link href="/courses" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors">
                        Back to Courses
                    </Link>
                </div>
            </main>
        );
    }

    const maxSeats = course.max_seats || 0;
    const enrolled = course.enrolled_count || 0;
    const seatsLeft = maxSeats > 0 ? Math.max(0, maxSeats - enrolled) : 0;
    const seatsPercent = maxSeats > 0 ? ((maxSeats - seatsLeft) / maxSeats) * 100 : 0;
    const priceNum = typeof course.price === 'number' ? course.price : Number(course.price) || 0;

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Banner */}
            <section className={`relative bg-gradient-to-r from-orange-600 to-amber-500 py-16 pt-28`}>
                <div className="absolute inset-0 bg-black/30" />
                <div className="container mx-auto px-4 relative z-10">
                    <Link href="/courses" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors">
                        <FaArrowLeft /> Back to Courses
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {course.level && (
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${levelColor[course.level] || 'bg-white/20 text-white'}`}>
                                {course.level}
                            </span>
                        )}
                        {course.category && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white">{course.category}</span>
                        )}
                        {course.status && (
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${course.status === 'upcoming' ? 'bg-green-400/90 text-green-900' :
                                course.status === 'ongoing' ? 'bg-blue-400/90 text-blue-900' :
                                    'bg-gray-400/90 text-gray-900'
                                }`}>
                                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">{course.title}</h1>
                    <p className="text-white/90 text-lg mb-6 max-w-2xl">{course.tagline || course.description}</p>
                    <div className="flex flex-wrap gap-6 text-white/90 text-sm">
                        {course.rating && <span className="flex items-center gap-2"><FaStar className="text-amber-400" /> {course.rating} Rating</span>}
                        {enrolled > 0 && <span className="flex items-center gap-2"><FaUsers /> {enrolled.toLocaleString()} Enrolled</span>}
                        {course.duration && <span className="flex items-center gap-2"><FaClock /> {course.duration}</span>}
                        {course.language && <span className="flex items-center gap-2"><FaLanguage /> {course.language}</span>}
                        {course.mode && <span className="flex items-center gap-2"><FaMapMarkerAlt /> {course.mode}</span>}
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left: Details */}
                    <div className="lg:col-span-2 space-y-8">

                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                                <FaBook className="text-orange-500" /> About This Course
                            </h2>
                            <p className="text-gray-600 leading-relaxed">{course.description || "No description provided."}</p>
                        </section>

                        {course.outcomes && course.outcomes.length > 0 && (
                            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <FaCheckCircle className="text-green-500" /> What You Will Learn
                                </h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {course.outcomes.map((o, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                            <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" /> {o}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { icon: <FaClock className="text-orange-500" />, label: 'Duration', value: course.duration },
                                    { icon: <FaCalendarAlt className="text-blue-500" />, label: 'Schedule', value: course.schedule },
                                    { icon: <FaCalendarAlt className="text-green-500" />, label: 'Start Date', value: course.start_date ? new Date(course.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A' },
                                    { icon: <FaMapMarkerAlt className="text-red-500" />, label: 'Location', value: course.location },
                                    { icon: <FaLanguage className="text-purple-500" />, label: 'Language', value: course.language },
                                    { icon: <FaGraduationCap className="text-amber-500" />, label: 'Certificate', value: course.certificate ? 'Yes, included' : 'No' },
                                ].filter(item => item.value).map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                                        <div className="text-xl mt-0.5">{item.icon}</div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</p>
                                            <p className="text-sm font-medium text-gray-800">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {course.prerequisites && course.prerequisites.length > 0 && (
                            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Prerequisites</h2>
                                <ul className="space-y-2">
                                    {course.prerequisites.map((p, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                            <span className="text-orange-500 font-bold mt-0.5">-</span> {p}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {course.instructor && (
                            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <FaUser className="text-orange-500" /> Your Instructor
                                </h2>
                                <div className="flex items-start gap-5">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-amber-400 flex items-center justify-center shrink-0 text-white text-2xl font-bold">
                                        {course.instructor.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{course.instructor}</h3>
                                        {course.instructor_title && <p className="text-sm text-orange-600 font-medium mb-3">{course.instructor_title}</p>}
                                    </div>
                                </div>
                            </section>
                        )}

                        {course.faqs && course.faqs.length > 0 && (
                            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
                                {course.faqs.map((faq, i) => <FaqItem key={i} faq={faq} />)}
                            </section>
                        )}
                    </div>

                    {/* Right: Registration Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-5">
                            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                                <div className={`bg-gradient-to-r from-orange-600 to-amber-500 p-6 text-white`}>
                                    <div className="flex items-end gap-3">
                                        <span className="text-4xl font-black">
                                            {priceNum === 0 ? 'Free' : `Rs.${priceNum.toLocaleString()}`}
                                        </span>
                                    </div>
                                </div>

                                {course.status !== 'completed' && maxSeats > 0 && (
                                    <div className="px-6 pt-5">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>{seatsLeft} seats left</span>
                                            <span>{maxSeats} total</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all"
                                                style={{ width: `${seatsPercent}%` }} />
                                        </div>
                                        <p className="text-xs text-red-500 font-medium mt-1">
                                            {seatsLeft <= 5 ? 'Almost full!' : `${seatsLeft} spots remaining`}
                                        </p>
                                    </div>
                                )}

                                <div className="p-6 pt-4">
                                    {course.status === 'completed' ? (
                                        <div className="text-center py-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <FaGraduationCap className="text-gray-400 text-xl" />
                                            </div>
                                            <p className="text-gray-500 text-sm font-medium">This course has ended.</p>
                                            <p className="text-gray-400 text-xs mt-1 mb-4">Check back later for future dates.</p>
                                        </div>
                                    ) : (
                                        <RegistrationForm course={course} />
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-sm space-y-3">
                                <h4 className="font-bold text-gray-700">This course includes:</h4>
                                {[
                                    course.certificate && '📜 Certificate of completion',
                                    course.mode === 'Hybrid' && '💻 Online + offline access',
                                    '📚 Course materials provided',
                                ].filter(Boolean).map((item, i) => (
                                    <p key={i} className="text-gray-600">{item as string}</p>
                                ))}
                            </div>

                            <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                                <h4 className="font-bold text-gray-700 mb-3">Need Help?</h4>
                                <div className="space-y-2">
                                    <a href="https://wa.me/916291436256" target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-green-700 text-sm hover:underline">
                                        <FaWhatsapp className="text-lg" /> +91 62914 36256
                                    </a>
                                    <a href="mailto:info.iskcondurgapur@gmail.com"
                                        className="flex items-center gap-3 text-blue-700 text-sm hover:underline">
                                        <FaEnvelope className="text-lg" /> info.iskcondurgapur@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
