'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes, FaDownload, FaShare } from 'react-icons/fa';

// Updated gallery data with correct image paths and more images
const galleryItems = [
  {
    id: 1,
    title: 'Srila Prabhupada - ISKCON Founder-Acharya',
    image: '/images/prabhupada/founder-acharya.jpg',
    category: 'Historical',
    year: '1971',
    description: 'His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, the Founder-Acharya of ISKCON.'
  },
  {
    id: 2,
    title: 'Srila Prabhupada',
    image: '/images/srila-prabhupada.jpg',
    category: 'Historical',
    year: '1970s',
    description: 'His Divine Grace A.C. Bhaktivedanta Swami Prabhupada.'
  },
  {
    id: 3,
    title: 'A.C. Bhaktivedanta Swami',
    image: '/images/prabhupada.jpg',
    category: 'Historical',
    year: '1970s',
    description: 'Srila Prabhupada deep in thought.'
  }
];

const categories = ['All', 'Historical', 'Temples', 'Festivals'];
const decades = ['All', '1970s'];

export default function PrabhupadaGallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDecade, setSelectedDecade] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDecade = selectedDecade === 'All' || item.year.startsWith(selectedDecade.slice(0, 3));
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDecade && matchesSearch;
  });

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">          <Image
          src="/images/srila-prabhupada.jpg"
          alt="Srila Prabhupada"
          fill
          className="object-cover brightness-50"
        />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Srila Prabhupada Gallery
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            A collection of precious moments capturing the divine journey of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-16 z-20 bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search gallery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-400" />
                <span className="text-sm text-gray-600">Category:</span>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedCategory === category
                        ? 'bg-iskcon-orange text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-iskcon-orange/10'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Decade:</span>
                {decades.map((decade) => (
                  <button
                    key={decade}
                    onClick={() => setSelectedDecade(decade)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedDecade === decade
                        ? 'bg-iskcon-orange text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-iskcon-orange/10'
                      }`}
                  >
                    {decade}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                onClick={() => setSelectedImage(item.id)}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="text-sm text-white/80">{item.year}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-iskcon-orange"
            onClick={() => setSelectedImage(null)}
          >
            <FaTimes />
          </button>

          <div className="max-w-4xl mx-auto p-4">
            <div className="relative aspect-[4/3] w-full">
              {galleryItems.find(item => item.id === selectedImage) && (
                <Image
                  src={galleryItems.find(item => item.id === selectedImage)!.image}
                  alt={galleryItems.find(item => item.id === selectedImage)!.title}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="mt-4 text-white">
              <h2 className="text-2xl font-bold">
                {galleryItems.find(item => item.id === selectedImage)?.title}
              </h2>
              <p className="text-white/80 mt-2">
                {galleryItems.find(item => item.id === selectedImage)?.description}
              </p>
              <div className="flex space-x-4 mt-4">
                <button className="flex items-center space-x-2 text-white/80 hover:text-white">
                  <FaDownload />
                  <span>Download</span>
                </button>
                <button className="flex items-center space-x-2 text-white/80 hover:text-white">
                  <FaShare />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}