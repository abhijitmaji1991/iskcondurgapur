import React from 'react';
import fs from 'fs';
import path from 'path';
import GalleryClient from './GalleryClient';

export default function GalleryPage() {
    // Read the gallery directory
    const galleryDir = path.join(process.cwd(), 'public', 'images', 'gallery');
    let images: string[] = [];
    
    try {
        if (fs.existsSync(galleryDir)) {
            const files = fs.readdirSync(galleryDir);
            // Filter for image files
            images = files.filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
        }
    } catch (error) {
        console.error("Error reading gallery directory:", error);
    }

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
                    <GalleryClient images={images} />
                </div>
            </section>
        </main>
    );
}
