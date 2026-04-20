'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaShareAlt, FaBookOpen } from 'react-icons/fa';

interface Verse {
    text: string;
    translation: string;
    reference: string;
    source: string;
}

const VERSES: Verse[] = [
    {
        text: "देहिर्नोऽस्मिन्यथा देहे कौमारं यौवनं जरा ।\nतथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति ॥",
        translation: "As the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death. A sober person is not bewildered by such a change.",
        reference: "BG 2.13",
        source: "Bhagavad Gita"
    },
    {
        text: "यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः ।\nस यत्प्रमाणं कुरुते लोकस्तदनुवर्तते ॥",
        translation: "Whatever action a great man performs, common men follow. And whatever standards he sets by exemplary acts, all the world pursues.",
        reference: "BG 3.21",
        source: "Bhagavad Gita"
    },
    {
        text: "परित्राणाय साधूनां विनाशाय च दुष्कृताम् ।\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे ॥",
        translation: "To deliver the pious and to annihilate the miscreants, as well as to reestablish the principles of religion, I Myself appear, millennium after millennium.",
        reference: "BG 4.8",
        source: "Bhagavad Gita"
    }
];

export default function VerseOfTheDay() {
    const [verse, setVerse] = useState<Verse | null>(null);

    useEffect(() => {
        // Random verse selection on mount
        const randomVerse = VERSES[Math.floor(Math.random() * VERSES.length)];
        setVerse(randomVerse);
    }, []);

    if (!verse) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
        >
            <div className="relative group">
                {/* Background Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative glass-morphism p-8 sm:p-12 rounded-3xl border border-white/40 shadow-2xl overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <FaBookOpen className="text-9xl text-orange-900" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="h-0.5 w-12 bg-orange-500 rounded-full"></span>
                            <span className="text-sm font-bold tracking-widest uppercase text-orange-600">Verse of the Day</span>
                            <span className="h-0.5 w-12 bg-orange-500 rounded-full"></span>
                        </div>

                        <FaQuoteLeft className="text-4xl text-orange-200 mb-6" />

                        <blockquote className="space-y-6">
                            <p className="text-2xl sm:text-3xl font-sanskrit font-bold text-gray-900 leading-relaxed mb-6">
                                {verse.text}
                            </p>
                            <p className="text-lg sm:text-xl text-gray-600 italic leading-relaxed border-l-4 border-orange-200 pl-6 py-2">
                                &quot;{verse.translation}&quot;
                            </p>

                            <footer className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div>
                                    <p className="text-xl font-bold text-gray-800">
                                        {verse.reference}
                                    </p>
                                    <p className="text-sm font-medium text-orange-600 uppercase tracking-widest">
                                        {verse.source}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-orange-50 text-orange-600 border border-orange-100 shadow-sm rounded-xl transition-all active:scale-95 font-semibold text-sm"
                                    >
                                        <FaShareAlt />
                                        Share Verse
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 rounded-xl transition-all hover:shadow-orange-500/40 active:scale-95 font-semibold text-sm"
                                    >
                                        <FaBookOpen />
                                        Study Now
                                    </button>
                                </div>
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
