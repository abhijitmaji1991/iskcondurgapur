'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes, FaCalendarAlt, FaImage } from 'react-icons/fa';

interface GalleryDateGroup {
    date: string;
    images: string[];
}

export default function GalleryClient({ galleryData }: { galleryData: GalleryDateGroup[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Flatten all images for continuous navigation
    const allImages = galleryData.flatMap(group => group.images);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % allImages.length));
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + allImages.length) % allImages.length));
    };

    const handleClose = () => {
        setSelectedIndex(null);
    };

    // Calculate global index when an image is clicked
    const handleImageClick = (groupIndex: number, imgIndex: number) => {
        let globalIndex = 0;
        for (let i = 0; i < groupIndex; i++) {
            globalIndex += galleryData[i].images.length;
        }
        globalIndex += imgIndex;
        setSelectedIndex(globalIndex);
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === 'ArrowRight') {
                setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % allImages.length));
            } else if (e.key === 'ArrowLeft') {
                setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + allImages.length) % allImages.length));
            } else if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, allImages.length]);

    // Prevent body scrolling when lightbox is open
    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedIndex]);

    return (
        <>
            {galleryData.length > 0 ? (
                <div className="space-y-16">
                    {galleryData.map((group, groupIndex) => (
                        <div key={group.date} className="gallery-group">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                <div className="p-3 bg-orange-50 text-iskcon-orange rounded-xl">
                                    <FaCalendarAlt size={20} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {group.date === 'General' ? 'General Gallery' : new Date(group.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">{group.images.length} Photos</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {group.images.map((imageFile, imgIndex) => (
                                    <motion.div 
                                        key={imageFile} 
                                        className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                                        onClick={() => handleImageClick(groupIndex, imgIndex)}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Image 
                                            src={`/images/gallery/${imageFile}`} 
                                            alt={`Gallery Image from ${group.date}`}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold tracking-widest text-lg drop-shadow-md">VIEW</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-12 py-16 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="text-gray-400 mb-4 flex justify-center"><FaImage size={48} /></div>
                    <p className="text-xl text-gray-600 font-medium">More photos coming soon...</p>
                    <p className="text-gray-400 mt-2">Check back later for glimpses of our events.</p>
                </div>
            )}

            {/* Lightbox / Slider overlay */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-md"
                        onClick={handleClose}
                    >
                        {/* Close Button */}
                        <button 
                            className="absolute top-6 right-6 text-white text-3xl hover:text-orange-500 transition-colors z-50 p-2"
                            onClick={handleClose}
                            title="Close"
                        >
                            <FaTimes />
                        </button>

                        {/* Navigation Arrows */}
                        <button 
                            className="absolute left-2 md:left-8 text-white text-4xl hover:text-orange-500 transition-colors z-50 p-4"
                            onClick={handlePrev}
                            title="Previous"
                        >
                            <FaChevronLeft />
                        </button>
                        
                        <button 
                            className="absolute right-2 md:right-8 text-white text-4xl hover:text-orange-500 transition-colors z-50 p-4"
                            onClick={handleNext}
                            title="Next"
                        >
                            <FaChevronRight />
                        </button>

                        {/* Image Container */}
                        <div 
                            className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto flex items-center justify-center px-16 md:px-24"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative w-full h-full"
                                >
                                    <Image
                                        src={`/images/gallery/${allImages[selectedIndex]}`}
                                        alt={`Gallery Image ${selectedIndex + 1}`}
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        
                        {/* Image Counter */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/70 font-medium tracking-wide">
                            {selectedIndex + 1} / {allImages.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
