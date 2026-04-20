'use client';

import React from 'react';
import Link from 'next/link';
import { FaUsers, FaHandsHelping, FaDonate, FaHandHoldingHeart } from 'react-icons/fa';

export default function GetInvolvedPage() {
    return (
        <main className="min-h-screen pt-20">
            <section className="py-4 bg-iskcon-orange flex items-center justify-center text-white">
                <div className="text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Involved</h1>
                    <p className="text-xl">Be a part of something bigger than yourself</p>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Link href="/get-involved/membership" className="group">
                            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition border-t-4 border-blue-500 h-full">
                                <FaUsers className="text-5xl text-blue-500 mb-6" />
                                <h2 className="text-2xl font-bold mb-4 text-gray-800">Become a Member</h2>
                                <p className="text-gray-600">Join our community as a life member and receive special benefits.</p>
                                <span className="mt-4 inline-block text-blue-500 font-bold group-hover:translate-x-2 transition-transform">Join Now →</span>
                            </div>
                        </Link>

                        <Link href="/get-involved/volunteer" className="group">
                            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition border-t-4 border-green-500 h-full">
                                <FaHandsHelping className="text-5xl text-green-500 mb-6" />
                                <h2 className="text-2xl font-bold mb-4 text-gray-800">Volunteer</h2>
                                <p className="text-gray-600">Offer your skills and time in service to the Lord and His devotees.</p>
                                <span className="mt-4 inline-block text-green-500 font-bold group-hover:translate-x-2 transition-transform">Apply Now →</span>
                            </div>
                        </Link>

                        <Link href="/donate" className="group">
                            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition border-t-4 border-red-500 h-full">
                                <FaDonate className="text-5xl text-red-500 mb-6" />
                                <h2 className="text-2xl font-bold mb-4 text-gray-800">Donate</h2>
                                <p className="text-gray-600">Support the temple activities and construction projects with your contribution.</p>
                                <span className="mt-4 inline-block text-red-500 font-bold group-hover:translate-x-2 transition-transform">Donate Now →</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
