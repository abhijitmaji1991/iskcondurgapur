'use client';

import React from 'react';
import Link from 'next/link';
import { FaBookOpen } from 'react-icons/fa';

export default function VedicLiteraturePage() {
    const books = [
        { title: "Bhagavad-gita As It Is", desc: "The essence of Vedic knowledge." },
        { title: "Srimad Bhagavatam", desc: "The natural commentary on Vedanta-sutra." },
        { title: "Sri Isopanishad", desc: "The knowledge that brings one nearer to the Supreme Personality of Godhead." },
        { title: "Nectar of Devotion", desc: "The complete science of Bhakti-yoga." }
    ];

    return (
        <main className="min-h-screen pt-20">
            <section className="py-4 bg-amber-800 flex items-center justify-center text-white">
                <div className="text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Vedic Literature</h1>
                    <p className="text-xl">Ancient wisdom for modern times</p>
                </div>
            </section>

            <section className="py-16 container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {books.map((book, i) => (
                        <div key={i} className="flex bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition items-start">
                            <FaBookOpen className="text-5xl text-amber-800 mr-6 flex-shrink-0" />
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h3>
                                <p className="text-gray-600 mb-4">{book.desc}</p>
                                <Link href="/resources/books" className="text-amber-600 font-bold hover:underline">Read More</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
