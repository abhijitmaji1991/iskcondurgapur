'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign, FaUsers, FaStar } from 'react-icons/fa';

export default function SpiritualToursPage() {
  const [tours, setTours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTours = async () => {
      try {
        const response = await fetch('/api/tours');
        const result = await response.json();
        if (response.ok) {
          setTours(result.data || []);
        } else {
          setError(result.message || 'Failed to load spiritual tours');
        }
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError('Failed to connect to the server');
      } finally {
        setIsLoading(false);
      }
    };
    loadTours();
  }, []);

  return (
    <main className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative py-12 pt-24 bg-gradient-to-br from-orange-700 via-orange-600 to-amber-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-3xl md:text-5xl font-black mb-3 drop-shadow-md">Sacred Spiritual Tours</h1>
            <p className="text-base md:text-lg mb-4 text-white/95 max-w-2xl mx-auto">
              Embark on transformative journeys to India&apos;s holiest sites, guided by experienced devotees.
              Deepen your Krishna consciousness through immersive pilgrimage experiences.
            </p>
            <div className="mt-4 flex justify-center">
              <a href="#tours" className="btn-primary">
                Explore Tours
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Listings */}
      <section id="tours" className="py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-10 flex flex-col lg:flex-row justify-between items-start gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Available Tours</h2>
              <p className="text-gray-600">
                Discover our curated selection of spiritual journeys across sacred India
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 max-w-md mx-auto text-center">
              <p className="font-bold mb-1">Failed to load tours</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : tours.length > 0 ? (
            /* Tours Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map(tour => (
                <motion.div
                  key={tour._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-48 bg-gray-200 overflow-hidden flex-shrink-0">
                    <Image
                      src={tour.image}
                      alt={tour.name}
                      fill
                      className="object-cover"
                      onError={(e: any) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/tours/placeholder.jpg";
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-amber-500 text-white px-3 py-1 text-sm font-bold rounded-bl-lg">
                      {tour.category}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 leading-tight">{tour.name}</h3>
                      <div className="flex items-center text-amber-500 flex-shrink-0 ml-2">
                        <FaStar />
                        <span className="text-sm ml-1 text-gray-700">{tour.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="mr-2 text-red-500 flex-shrink-0" />
                      <span>{tour.location}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                      {tour.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="bg-orange-50/70 border border-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs flex items-center">
                        <FaCalendarAlt className="mr-1 text-orange-500" />
                        {tour.duration}
                      </div>
                      <div className="bg-green-50 border border-green-100 text-green-700 px-3 py-1 rounded-full text-xs flex items-center">
                        <FaRupeeSign className="mr-1 text-green-500" />
                        {tour.price.toLocaleString()}
                      </div>
                      <div className="bg-purple-50 border border-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs flex items-center">
                        <FaUsers className="mr-1 text-purple-500" />
                        {tour.groupSize} people
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                      <span className="text-xl font-black text-orange-600">₹{tour.price.toLocaleString()}</span>
                      <Link href={`/spiritual-tours/${tour._id}`} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-semibold shadow-sm hover:shadow active:scale-95">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 italic">
              No spiritual tours are currently scheduled. Please check back later.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}