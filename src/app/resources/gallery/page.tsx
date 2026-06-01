import React from 'react';
import fs from 'fs';
import path from 'path';
import GalleryClient from './GalleryClient';

interface GalleryDateGroup {
    date: string;
    images: string[];
}

export default function GalleryPage() {
    // Read the gallery directory
    const galleryDir = path.join(process.cwd(), 'public', 'images', 'gallery');
    let galleryData: GalleryDateGroup[] = [];
    
    try {
        if (fs.existsSync(galleryDir)) {
            const entries = fs.readdirSync(galleryDir, { withFileTypes: true });
            
            // Backwards compatibility: check for images in the root of gallery
            const rootImages = entries
                .filter(entry => entry.isFile() && /\.(jpg|jpeg|png|webp|gif)$/i.test(entry.name))
                .map(entry => entry.name);
                
            if (rootImages.length > 0) {
                galleryData.push({
                    date: 'General',
                    images: rootImages.map(img => img) // They are in the root
                });
            }

            // Check for date directories
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const dateFolder = entry.name;
                    const folderPath = path.join(galleryDir, dateFolder);
                    const files = fs.readdirSync(folderPath);
                    const images = files.filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
                    
                    if (images.length > 0) {
                        galleryData.push({
                            date: dateFolder,
                            images: images.map(img => `${dateFolder}/${img}`)
                        });
                    }
                }
            }
            
            // Sort by date (folders that look like dates will be sorted chronologically descending)
            galleryData.sort((a, b) => {
                if (a.date === 'General') return 1;
                if (b.date === 'General') return -1;
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
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
                    <GalleryClient galleryData={galleryData} />
                </div>
            </section>
        </main>
    );
}
