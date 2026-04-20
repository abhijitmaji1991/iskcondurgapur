'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaQuoteLeft } from 'react-icons/fa';

export default function PrabhupadaBiographyPage() {
    return (
        <main className="min-h-screen pt-20">
            {/* Hero */}
            <section className="relative py-4 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-amber-700 to-amber-900"></div>
                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Srila Prabhupada</h1>
                    <p className="text-xl md:text-2xl font-light">Founder-Acharya of the International Society for Krishna Consciousness</p>
                </div>
            </section>

            {/* Biography Content */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="prose prose-lg mx-auto text-gray-700">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">A Lifetime in Preparation</h2>
                        <p className="mb-6">
                            Abhay Charan De was born on September 1, 1896, in Calcutta, India. His father, Gour Mohan De, was a pure Vaishnava who raised his son to be a devotee of Krishna. In 1922, Abhay met his spiritual master, Srila Bhaktisiddhanta Sarasvati Thakura, who requested him to spread the message of Lord Chaitanya in the English language.
                        </p>
                        <p className="mb-6">
                            In 1933, Abhay was formally initiated, and in 1959 he took the vow of sannyasa (renunciation), becoming A.C. Bhaktivedanta Swami. He then began working on his life&apos;s masterpiece: a translation and commentary on the 18,000-verse Srimad-Bhagavatam.
                        </p>

                        <div className="my-10 p-8 bg-amber-50 rounded-lg border-l-4 border-iskcon-orange">
                            <FaQuoteLeft className="text-3xl text-iskcon-orange mb-4" />
                            <p className="text-xl italic font-serif">
                                &quot;I shall never undergo the grief of being unable to work. I shall work until the last moment of my life.&quot;
                            </p>
                        </div>

                        <h2 className="text-3xl font-bold mb-6 text-gray-800">The Journey West</h2>
                        <p className="mb-6">
                            At the age of 69, Srila Prabhupada traveled to New York City aboard a cargo ship, suffering two heart attacks on the way. He arrived in 1965 with just seven dollars in Indian rupees and a crate of his books.
                        </p>
                        <p className="mb-6">
                            In July 1966, he incorporated the International Society for Krishna Consciousness (ISKCON). In the eleven years that followed, he circled the globe fourteen times on lecture tours, spreading the teachings of Lord Krishna to thousands of people.
                        </p>

                        <h2 className="text-3xl font-bold mb-6 text-gray-800">Literary Legacy</h2>
                        <p className="mb-6">
                            Despite his rigorous travel schedule, Srila Prabhupada wrote over eighty volumes of authoritative translations, commentaries, and summary studies of the philosophical and religious classics of India. His writings have been translated into over eighty languages.
                        </p>
                    </div>
                </div>
            </section>

            {/* Timeline Section Placeholder */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8">Timeline of Achievements</h2>
                    <div className="max-w-3xl mx-auto">
                        <div className="border-l-2 border-iskcon-orange pl-8 text-left space-y-8">
                            <div>
                                <span className="font-bold text-iskcon-orange">1896</span>
                                <p>Born in Calcutta.</p>
                            </div>
                            <div>
                                <span className="font-bold text-iskcon-orange">1922</span>
                                <p>Meets Srila Bhaktisiddhanta Sarasvati Thakura.</p>
                            </div>
                            <div>
                                <span className="font-bold text-iskcon-orange">1965</span>
                                <p>Arrives in New York City.</p>
                            </div>
                            <div>
                                <span className="font-bold text-iskcon-orange">1977</span>
                                <p>Enters Samadhi in Vrindavan.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
