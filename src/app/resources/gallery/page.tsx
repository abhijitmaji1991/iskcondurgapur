'use client';

import React from 'react';
import Image from 'next/image';

export default function GalleryPage() {
    return (
        <main className="min-h-screen pt-20">
            <section className="relative py-4 flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 opacity-40 bg-[url('/images/lotus-pattern.png')]"></div>
                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Photo Gallery</h1>
                    <p className="text-xl text-gray-300">Glimpses of devotion and festivities</p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Placeholder Images */}
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    Image {i + 1}
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center mt-12 text-gray-500">More photos coming soon...</p>
                </div>
            </section>
        </main>
    );
}
