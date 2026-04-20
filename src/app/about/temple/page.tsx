'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaCalendarAlt, FaHandsHelping } from 'react-icons/fa';

export default function TemplePage() {
    return (
        <main className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="relative py-4 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-iskcon-blue/20 to-iskcon-orange/20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Temple Info</h1>
                        <p className="text-xl text-gray-600 mb-8">
                            A spiritual oasis in the heart of Durgapur
                        </p>
                    </div>
                </div>
            </section>

            {/* Temple Overview */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome to ISKCON Durgapur</h2>
                                <p className="text-lg text-gray-600 mb-6">
                                    Established to propagate the timeless science of Krishna Consciousness, ISKCON Durgapur is more than just a temple; it is a vibrant community center offering spiritual education, culture, and service opportunities.
                                </p>
                                <div className="flex items-start mb-4">
                                    <FaMapMarkerAlt className="text-iskcon-orange mt-1 mr-3 text-xl" />
                                    <div>
                                        <h3 className="font-bold text-gray-800">Location</h3>
                                        <p className="text-gray-600">Nachan Road, Benachity, Durgapur, West Bengal, India</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaClock className="text-iskcon-orange mt-1 mr-3 text-xl" />
                                    <div>
                                        <h3 className="font-bold text-gray-800">Darshan Timings</h3>
                                        <p className="text-gray-600">Morning: 4:30 AM – 1:00 PM</p>
                                        <p className="text-gray-600">Evening: 4:00 PM – 8:30 PM</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 opacity-20"></div>
                                {/* Placeholder for temple image if real one not available */}
                                <div className="flex items-center justify-center h-full bg-gray-200">
                                    <span className="text-gray-500">Temple Image</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Facilities */}
            <section className="py-16 bg-amber-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Temple Facilities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                            <FaCalendarAlt className="text-4xl text-iskcon-orange mb-4" />
                            <h3 className="text-xl font-bold mb-2">Temple Hall</h3>
                            <p className="text-gray-600">A spacious prayer hall for kirtans, lectures, and finding inner peace.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                            <FaHandsHelping className="text-4xl text-iskcon-orange mb-4" />
                            <h3 className="text-xl font-bold mb-2">Guest House</h3>
                            <p className="text-gray-600">Clean and comfortable accommodation for visiting devotees and life members.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                            <FaCalendarAlt className="text-4xl text-iskcon-orange mb-4" />
                            <h3 className="text-xl font-bold mb-2">Govinda&apos;s Restaurant</h3>
                            <p className="text-gray-600">Pure vegetarian sattvic meals offered to the Lord and distributed as prasadam.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
