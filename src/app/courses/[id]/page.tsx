'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCalendarAlt, FaClock, FaGraduationCap, FaUsers, FaStar,
    FaArrowLeft, FaCheckCircle, FaPlayCircle, FaBook, FaUser,
    FaMapMarkerAlt, FaLanguage, FaChevronDown, FaChevronUp,
    FaWhatsapp, FaPhone, FaEnvelope, FaShieldAlt, FaTag
} from 'react-icons/fa';
import { useParams } from 'next/navigation';

interface Module {
    title: string;
    topics: string[];
}

interface CourseFull {
    id: string;
    title: string;
    tagline: string;
    longDescription: string;
    image: string;
    bannerColor: string;
    duration: string;
    schedule: string;
    startDate: string;
    instructor: string;
    instructorTitle: string;
    instructorBio: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    category: string;
    rating: number;
    enrolledCount: number;
    maxSeats: number;
    price: number | 'Free';
    originalPrice?: number;
    language: string;
    location: string;
    mode: 'Online' | 'Offline' | 'Hybrid';
    certificate: boolean;
    prerequisites: string[];
    outcomes: string[];
    curriculum: Module[];
    faqs: { q: string; a: string }[];
    status: 'upcoming' | 'ongoing' | 'completed';
}

const allCourses: CourseFull[] = [
    {
        id: 'bhagavad-gita-essentials',
        title: 'Bhagavad Gita Essentials',
        tagline: 'Unlock the timeless wisdom of the Song of God',
        longDescription: 'The Bhagavad Gita is one of the most revered spiritual texts in the world. In this 8-week foundational course, we explore its 700 verses covering karma yoga, jnana yoga, and bhakti yoga with practical applications for modern life. Each session includes scriptural study, guided meditation, and group discussion.',
        image: '/images/courses/bhagavad-gita.jpg',
        bannerColor: 'from-orange-600 to-amber-500',
        duration: '8 weeks',
        schedule: 'Saturdays, 10:00 AM to 12:00 PM',
        startDate: '2026-03-08',
        instructor: 'HH Radha Krishna Das',
        instructorTitle: 'Senior Devotee & Vedic Scholar',
        instructorBio: 'HH Radha Krishna Das has been practising and teaching Krishna consciousness for over 25 years. He has facilitated Bhagavad Gita courses across 15+ countries and is a disciple of HH Bhakti Charu Swami.',
        level: 'Beginner',
        category: 'Scripture Study',
        rating: 4.9,
        enrolledCount: 1245,
        maxSeats: 60,
        price: 'Free',
        language: 'English / Bengali',
        location: 'ISKCON Durgapur Temple Hall',
        mode: 'Hybrid',
        certificate: true,
        prerequisites: ['No prior knowledge required', 'Open to all age groups'],
        outcomes: [
            'Understand the 18 chapters of Bhagavad Gita',
            'Apply karma yoga in daily work and relationships',
            'Develop a regular meditation practice',
            'Understand the concept of the self (Atma)',
            'Build a solid foundation in Vaishnava philosophy',
        ],
        curriculum: [
            { title: 'Week 1 - Introduction & Setting the Scene', topics: ['Historical context of the Kurukshetra war', 'Overview of the 18 chapters', 'Who is Arjuna? Who is Krishna?'] },
            { title: 'Week 2 - Yoga of Knowledge (Sankhya Yoga)', topics: ['The eternal nature of the soul', 'Difference between body and self', 'Overcoming grief through knowledge'] },
            { title: 'Week 3 - Karma Yoga', topics: ['Action without attachment', 'Offering the fruits of work to God', 'Breaking the cycle of karma'] },
            { title: 'Week 4 - Renunciation & Steadiness', topics: ['Signs of a person of steady wisdom', 'Senses, mind, and intelligence', 'Practice of meditation'] },
            { title: 'Week 5 - Bhakti Yoga', topics: ['Nine processes of devotional service', 'How to approach the Supreme', 'Surrendering to Krishna'] },
            { title: 'Week 6 - Universal Form & Devotion', topics: ['Vishwarupa darshan', 'Pure devotion vs. mixed devotion', 'Qualities of a devotee'] },
            { title: 'Week 7 - Field & Knower of the Field', topics: ['Nature, enjoyer, and consciousness', 'The three modes of material nature', 'Transcending the three modes'] },
            { title: 'Week 8 - Conclusion & Surrender', topics: ['Secret of all secrets', 'Surrendering unto Krishna', 'Practical steps for daily sadhana', 'Q&A and Certificate Distribution'] },
        ],
        faqs: [
            { q: 'Is this course suitable for beginners with no prior knowledge?', a: 'Absolutely! This course is designed as a foundational study and welcomes everyone, regardless of their spiritual background.' },
            { q: 'Can I join online if I cannot attend in person?', a: 'Yes, the course is offered in Hybrid mode. You will receive a Zoom link after registration.' },
            { q: 'Will I receive a certificate?', a: 'Yes, ISKCON Durgapur issues a certificate of completion upon attending at least 6 of the 8 sessions.' },
            { q: 'Is there any homework or assignments?', a: 'There are optional verse memorisation exercises and a final reflection paper, but they are not mandatory for the certificate.' },
        ],
        status: 'upcoming',
    },
    {
        id: 'mantra-meditation',
        title: 'ISKCON Disciple Course',
        tagline: 'Prepare for initiation and deepen your commitment',
        longDescription: 'The ISKCON Disciple Course is a structured program designed for devotees who wish to take initiation. It covers the responsibilities and qualifications of a disciple, the importance of the guru-disciple relationship, and the foundational practices of Krishna consciousness.',
        image: '/images/courses/meditation.jpg',
        bannerColor: 'from-purple-600 to-indigo-700',
        duration: '4 weeks',
        schedule: 'Wednesdays, 6:30 PM to 8:00 PM',
        startDate: '2026-03-18',
        instructor: 'HG Yamuna Devi Dasi',
        instructorTitle: 'ISKCON Minister & Initiated Devotee',
        instructorBio: 'HG Yamuna Devi Dasi has been a dedicated practitioner for 18 years and serves as a mentor at ISKCON Durgapur, guiding hundreds of devotees through the initiation process.',
        level: 'Beginner',
        category: 'Devotee Training',
        rating: 4.8,
        enrolledCount: 890,
        maxSeats: 40,
        price: 400,
        originalPrice: 600,
        language: 'English / Hindi',
        location: 'ISKCON Durgapur Seminar Room',
        mode: 'Offline',
        certificate: true,
        prerequisites: ['Basic familiarity with ISKCON practices', 'Chanting at least 4 rounds of japa'],
        outcomes: [
            'Understand the guru-disciple relationship',
            'Know the qualifications and responsibilities of a disciple',
            'Learn about the ISKCON disciplic succession',
            'Appreciate the importance of sadhana and service',
        ],
        curriculum: [
            { title: 'Week 1 - The Guru & Disciplic Succession', topics: ['Importance of accepting a bona fide guru', 'Sampradaya and parampara', 'ISKCON founding acharya - Srila Prabhupada'] },
            { title: 'Week 2 - Qualities of a Disciple', topics: ['Humility, service attitude, and surrender', 'Avoiding the 10 offences to the holy name', 'Chanting with attention'] },
            { title: 'Week 3 - Vows & Commitments', topics: ['Four regulative principles', 'Minimum 16 rounds of japa', 'Service within ISKCON'] },
            { title: 'Week 4 - Review, Q&A & Ceremony Preparation', topics: ['Review of all topics', 'Panel Q&A with senior devotees', 'What to expect during initiation ceremony'] },
        ],
        faqs: [
            { q: 'Do I have to take initiation after completing this course?', a: 'No, the course is informational. Taking initiation is a personal decision made in consultation with your guru.' },
            { q: 'What is the registration fee for?', a: 'The Rs.400 fee covers course materials, prasadam on session days, and the certificate.' },
        ],
        status: 'upcoming',
    },
    {
        id: 'bhakti-yoga-philosophy',
        title: 'Pujari Course',
        tagline: 'Learn the sacred art of Deity worship',
        longDescription: 'The Pujari Course is an intensive 12-week training program that teaches the proper procedures for Deity worship (seva) in a Vaishnava temple. Participants will learn everything from morning mangal-arati to dressing, ornamentation, and offering of bhoga.',
        image: '/images/courses/bhakti-yoga.jpg',
        bannerColor: 'from-rose-600 to-pink-500',
        duration: '12 weeks',
        schedule: 'Tuesdays & Thursdays, 7:00 PM to 8:30 PM',
        startDate: '2026-04-01',
        instructor: 'HG Govinda Das',
        instructorTitle: 'Head Pujari, ISKCON Durgapur',
        instructorBio: 'HG Govinda Das has served as the Head Pujari of ISKCON Durgapur for over 12 years. He trained under guidance of senior pujaris at ISKCON Mayapur.',
        level: 'Intermediate',
        category: 'Temple Service',
        rating: 4.7,
        enrolledCount: 675,
        maxSeats: 25,
        price: 1200,
        language: 'Bengali / Hindi',
        location: 'ISKCON Durgapur Temple',
        mode: 'Offline',
        certificate: true,
        prerequisites: ['Initiated devotee preferred', 'Chanting 16 rounds', 'Following 4 regulative principles'],
        outcomes: [
            'Perform all 8 daily aratis correctly',
            'Know the proper procedures for dressing the Deities',
            'Understand the meaning of each offering',
            'Maintain the standard of cleanliness required for puja',
        ],
        curriculum: [
            { title: 'Weeks 1-3 - Foundations', topics: ['Philosophy of Deity worship', 'Cleanliness and purity standards', 'Introduction to the paraphernalia'] },
            { title: 'Weeks 4-6 - Arati Procedures', topics: ['Mangal-arati', 'Sringar-arati', 'Rajabhoga and Sandhya arati'] },
            { title: 'Weeks 7-9 - Dressing & Ornamentation', topics: ['Sewing and fitting garments', 'Flower ornamentation', 'Seasonal dressing themes'] },
            { title: 'Weeks 10-12 - Advanced Service & Practical Exam', topics: ['Abhishek (bathing ceremony)', 'Preparing and offering bhoga', 'Practical assessment in the temple'] },
        ],
        faqs: [
            { q: 'Is initiation required for this course?', a: 'Preference is given to initiated devotees, but serious aspiring devotees with proper sadhana may also apply.' },
            { q: 'Will I be able to serve in the temple after completing this course?', a: 'Yes, graduates are eligible to join the pujari team at ISKCON Durgapur on a scheduled rota.' },
        ],
        status: 'ongoing',
    },
    {
        id: 'vedic-cooking',
        title: 'Vedic Cooking & Prasadam Preparation',
        tagline: 'Cook with devotion, offer with love',
        longDescription: 'Food prepared and offered to Krishna becomes prasadam — spiritually purifying food. This course teaches classic Vedic recipes, the philosophy of cooking as devotional service, how to set up a proper offering, and the etiquette of taking prasadam.',
        image: '/images/courses/vedic-cooking.jpg',
        bannerColor: 'from-green-600 to-emerald-500',
        duration: '6 weeks',
        schedule: 'Sundays, 3:00 PM to 5:00 PM',
        startDate: '2025-10-05',
        instructor: 'HG Lakshmi Devi Dasi',
        instructorTitle: 'Temple Cook & Prasadam Coordinator',
        instructorBio: 'HG Lakshmi Devi Dasi has been cooking prasadam at ISKCON Durgapur for over 14 years and has trained hundreds of devotees in the art of Vedic cuisine.',
        level: 'Beginner',
        category: 'Lifestyle',
        rating: 4.9,
        enrolledCount: 750,
        maxSeats: 30,
        price: 1499,
        originalPrice: 1999,
        language: 'Bengali / English',
        location: 'ISKCON Durgapur Community Kitchen',
        mode: 'Offline',
        certificate: true,
        prerequisites: ['Basic cooking ability', 'Vegetarian diet preferred during course'],
        outcomes: [
            'Prepare 20+ traditional Vaishnava recipes',
            'Understand the philosophy of prasadam',
            'Set up a proper offering plate for the Deities',
            'Cook with mindfulness and devotion',
        ],
        curriculum: [
            { title: 'Week 1 - Philosophy of Prasadam', topics: ['Why we offer food to Krishna', 'The three modes of food', 'Setting up a home altar for offerings'] },
            { title: 'Weeks 2-3 - Basic Recipes', topics: ['Chaval (rice preparations)', 'Dal and sabzi', 'Rotis and puris'] },
            { title: 'Weeks 4-5 - Festival Sweets', topics: ['Halwa and kheer', 'Sandesh and rasgulla', 'Ekadashi recipes'] },
            { title: 'Week 6 - Full Meal Preparation & Offering', topics: ['56-item offering (Chappan Bhog)', 'Group cooking and offering ceremony', 'Certificate distribution and prasadam feast'] },
        ],
        faqs: [
            { q: 'Do I need to bring my own ingredients?', a: 'No, all ingredients are provided. The course fee covers all materials.' },
            { q: 'Can men join this course?', a: 'Absolutely! The course is open to everyone who wishes to cook with devotion.' },
        ],
        status: 'completed',
    },
    {
        id: 'sanskrit-basics',
        title: 'Mridanga & Kartal Course',
        tagline: 'Master the divine rhythms of kirtan',
        longDescription: 'Mridanga and kartal are the traditional percussion instruments of Vaishnava kirtan. This 10-week course covers the basics of rhythm (tala), common kirtan beats, and how to lead kirtan accompaniment at ISKCON programmes.',
        image: '/images/courses/sanskrit.jpg',
        bannerColor: 'from-blue-600 to-cyan-500',
        duration: '10 weeks',
        schedule: 'Mondays, 6:00 PM to 7:30 PM',
        startDate: '2025-09-01',
        instructor: 'HG Dr. Nityananda Das',
        instructorTitle: 'Kirtan Leader & Music Teacher',
        instructorBio: 'HG Nityananda Das has been leading kirtans at ISKCON Durgapur for 20 years. He has represented ISKCON at state-level cultural festivals.',
        level: 'Beginner',
        category: 'Music',
        rating: 4.6,
        enrolledCount: 420,
        maxSeats: 20,
        price: 1999,
        language: 'Bengali',
        location: 'ISKCON Durgapur Music Room',
        mode: 'Offline',
        certificate: true,
        prerequisites: ['No prior music experience required', 'Willingness to practice 15 minutes daily'],
        outcomes: [
            'Play 5 common kirtan rhythms on mridanga',
            'Keep proper tala with kartal',
            'Lead basic kirtan accompaniment',
            'Understand the spiritual significance of kirtan music',
        ],
        curriculum: [
            { title: 'Weeks 1-3 - Introduction & Basic Strokes', topics: ['Parts of the mridanga', 'Basic strokes: dha, ge, na, ti', 'Introduction to kartal technique'] },
            { title: 'Weeks 4-6 - Common Rhythms', topics: ['Ekadashi tala', 'Prabhupada rhythm', 'Slow and fast kirtan beats'] },
            { title: 'Weeks 7-9 - Practice with Kirtan', topics: ['Playing along with recorded kirtans', 'Group session with harmonium', 'Coordination between mridanga and kartal'] },
            { title: 'Week 10 - Performance & Assessment', topics: ['Group kirtan performance', 'Individual assessment', 'Certificate distribution'] },
        ],
        faqs: [
            { q: 'Will I be provided a mridanga to practice with?', a: 'Instruments are available in class. For home practice, we can guide you on where to buy one at a discounted price.' },
        ],
        status: 'completed',
    },
    {
        id: 'srimad-bhagavatam',
        title: 'Srimad Bhagavatam: First Canto',
        tagline: 'The ripened fruit of the tree of Vedic knowledge',
        longDescription: 'Srimad Bhagavatam is considered the supreme Vedic scripture. This 16-week course covers the First Canto in depth, exploring the dialogues of Suta Goswami, the teachings to Parikshit Maharaj, and the profound philosophical insights on creation, devotion, and liberation.',
        image: '/images/courses/bhagavatam.jpg',
        bannerColor: 'from-amber-600 to-yellow-500',
        duration: '16 weeks',
        schedule: 'Fridays, 5:30 PM to 7:30 PM',
        startDate: '2026-05-01',
        instructor: 'HG Madhava Das',
        instructorTitle: 'Advanced Scripture Course Facilitator',
        instructorBio: 'This course features recorded lectures by the late HH Bhakti Charu Swami, supplemented by live sessions run by HG Madhava Das, a senior devotee with 20+ years of scriptural study.',
        level: 'Advanced',
        category: 'Scripture Study',
        rating: 4.9,
        enrolledCount: 560,
        maxSeats: 35,
        price: 2499,
        language: 'English',
        location: 'ISKCON Durgapur Seminar Hall',
        mode: 'Hybrid',
        certificate: true,
        prerequisites: ['Completion of Bhagavad Gita Essentials', 'Regular chanting practice', 'Basic understanding of Vaishnava philosophy'],
        outcomes: [
            'Comprehend all 13 chapters of the First Canto',
            'Understand the parampara and disciplic succession',
            'Explore devotional service in context of creation',
            'Build advanced scriptural study habits',
        ],
        curriculum: [
            { title: 'Chapters 1-3 - Questions by the Sages', topics: ['The Srimad Bhagavatam purpose', 'Symptoms of Kali-yuga', 'The supreme religion'] },
            { title: 'Chapters 4-6 - The Meeting of Narada & Vyasa', topics: ['Why Vyasa was dissatisfied', 'Narada\'s previous life', 'Instructions on devotional service'] },
            { title: 'Chapters 7-9 - Dhritarashtra & Bhishma', topics: ['Liberation of Dhritarashtra', 'Bhishma\'s departure', 'Prayers of Queen Kunti'] },
            { title: 'Chapters 10-13 - Pandavas & King Parikshit', topics: ['Krishna\'s departure', 'Parikshit\'s birth', 'Kaliyuga and Dharma', 'The meeting with Suta Goswami'] },
        ],
        faqs: [
            { q: 'Is prior completion of the Gita course mandatory?', a: 'Yes, we recommend completing the Bhagavad Gita Essentials course or having an equivalent level of Vaishnava understanding.' },
        ],
        status: 'upcoming',
    },
];

const levelColor: Record<string, string> = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-blue-100 text-blue-800',
    Advanced: 'bg-purple-100 text-purple-800',
};

function RegistrationForm({ course }: { course: CourseFull }) {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
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
                <Link href="/courses" className="btn-primary">Browse More Courses</Link>
            </motion.div>
        );
    }

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
                        {typeof course.price === 'number' ? `Rs.${course.price.toLocaleString()}` : course.price}
                    </span>
                </div>
                {course.originalPrice && (
                    <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-gray-500">Original Price</span>
                        <span className="line-through text-gray-400">Rs.{course.originalPrice.toLocaleString()}</span>
                    </div>
                )}
                {course.price === 'Free' && (
                    <p className="text-xs text-green-600 mt-2 font-medium">This course is completely free!</p>
                )}
            </div>

            <button type="submit" disabled={submitting}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
                {submitting ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Processing...
                    </span>
                ) : (
                    <>{typeof course.price === 'number' ? 'Pay & Register' : 'Register for Free'}</>
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

function CurriculumModule({ module, index }: { module: Module; index: number }) {
    const [open, setOpen] = useState(index === 0);
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center px-5 py-4 bg-gray-50 hover:bg-orange-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {index + 1}
                    </span>
                    <span className="font-semibold text-gray-800 text-sm">{module.title}</span>
                </div>
                {open ? <FaChevronUp className="text-orange-500 shrink-0" /> : <FaChevronDown className="text-gray-400 shrink-0" />}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <ul className="px-5 py-3 space-y-2 bg-white border-t border-gray-100">
                            {module.topics.map((t, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                    <FaPlayCircle className="text-orange-400 mt-0.5 shrink-0" /> {t}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function CourseDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const course = allCourses.find(c => c.id === id);

    if (!course) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaGraduationCap className="mx-auto text-6xl text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Course Not Found</h2>
                    <p className="text-gray-500 mb-6">The course you are looking for does not exist.</p>
                    <Link href="/courses" className="btn-primary">Back to Courses</Link>
                </div>
            </main>
        );
    }

    const seatsLeft = course.maxSeats - (course.enrolledCount % course.maxSeats);
    const seatsPercent = ((course.maxSeats - seatsLeft) / course.maxSeats) * 100;

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Banner */}
            <section className={`relative bg-gradient-to-r ${course.bannerColor} py-16 pt-28`}>
                <div className="absolute inset-0 bg-black/30" />
                <div className="container mx-auto px-4 relative z-10">
                    <Link href="/courses" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors">
                        <FaArrowLeft /> Back to Courses
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${levelColor[course.level]}`}>{course.level}</span>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white">{course.category}</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${course.status === 'upcoming' ? 'bg-green-400/90 text-green-900' :
                            course.status === 'ongoing' ? 'bg-blue-400/90 text-blue-900' :
                                'bg-gray-400/90 text-gray-900'
                            }`}>
                            {course.status === 'upcoming' ? 'Upcoming' : course.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">{course.title}</h1>
                    <p className="text-white/90 text-lg mb-6 max-w-2xl">{course.tagline}</p>
                    <div className="flex flex-wrap gap-6 text-white/90 text-sm">
                        <span className="flex items-center gap-2"><FaStar className="text-amber-400" /> {course.rating} Rating</span>
                        <span className="flex items-center gap-2"><FaUsers /> {course.enrolledCount.toLocaleString()} Enrolled</span>
                        <span className="flex items-center gap-2"><FaClock /> {course.duration}</span>
                        <span className="flex items-center gap-2"><FaLanguage /> {course.language}</span>
                        <span className="flex items-center gap-2"><FaMapMarkerAlt /> {course.mode}</span>
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
                            <p className="text-gray-600 leading-relaxed">{course.longDescription}</p>
                        </section>

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

                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { icon: <FaClock className="text-orange-500" />, label: 'Duration', value: course.duration },
                                    { icon: <FaCalendarAlt className="text-blue-500" />, label: 'Schedule', value: course.schedule },
                                    { icon: <FaCalendarAlt className="text-green-500" />, label: 'Start Date', value: new Date(course.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                                    { icon: <FaMapMarkerAlt className="text-red-500" />, label: 'Location', value: course.location },
                                    { icon: <FaLanguage className="text-purple-500" />, label: 'Language', value: course.language },
                                    { icon: <FaGraduationCap className="text-amber-500" />, label: 'Certificate', value: course.certificate ? 'Yes, included' : 'No' },
                                ].map((item, i) => (
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

                        {course.prerequisites.length > 0 && (
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

                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <FaPlayCircle className="text-orange-500" /> Course Curriculum
                            </h2>
                            <div className="space-y-3">
                                {course.curriculum.map((mod, i) => (
                                    <CurriculumModule key={i} module={mod} index={i} />
                                ))}
                            </div>
                        </section>

                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <FaUser className="text-orange-500" /> Your Instructor
                            </h2>
                            <div className="flex items-start gap-5">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-amber-400 flex items-center justify-center shrink-0 text-white text-2xl font-bold">
                                    {course.instructor.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{course.instructor}</h3>
                                    <p className="text-sm text-orange-600 font-medium mb-3">{course.instructorTitle}</p>
                                    <p className="text-gray-600 text-sm leading-relaxed">{course.instructorBio}</p>
                                </div>
                            </div>
                        </section>

                        {course.faqs.length > 0 && (
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
                                <div className={`bg-gradient-to-r ${course.bannerColor} p-6 text-white`}>
                                    <div className="flex items-end gap-3">
                                        <span className="text-4xl font-black">
                                            {typeof course.price === 'number' ? `Rs.${course.price.toLocaleString()}` : 'Free'}
                                        </span>
                                        {course.originalPrice && (
                                            <span className="text-white/70 line-through text-lg mb-1">Rs.{course.originalPrice.toLocaleString()}</span>
                                        )}
                                    </div>
                                    {course.originalPrice && typeof course.price === 'number' && (
                                        <div className="mt-2 inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-bold">
                                            <FaTag /> {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF - Limited Seats
                                        </div>
                                    )}
                                </div>

                                {course.status !== 'completed' && (
                                    <div className="px-6 pt-5">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>{seatsLeft} seats left</span>
                                            <span>{course.maxSeats} total</span>
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
                                            <p className="text-gray-400 text-xs mt-1 mb-4">Join our mailing list to know when it runs again.</p>
                                            <Link href="/courses/upcoming" className="btn-primary w-full block">
                                                View Upcoming Courses
                                            </Link>
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
                                    '🍛 Prasadam on session days',
                                    '👥 Community group access',
                                ].filter(Boolean).map((item, i) => (
                                    <p key={i} className="text-gray-600">{item}</p>
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
