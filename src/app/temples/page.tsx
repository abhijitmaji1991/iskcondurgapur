'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaMapMarkerAlt, FaPhone, FaGlobe, FaCalendarAlt, FaPrayingHands, FaHeart, FaSearch, FaSpinner } from 'react-icons/fa';
import { getTemples, ApiTemple } from '@/lib/api';

export default function TemplesPage() {
  // Animation setup
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const [temples, setTemples] = useState<ApiTemple[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchTemples = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      const res = await getTemples(params);
      setTemples(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load temples');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchTemples();
  }, [fetchTemples]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggeredContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const indiaTemples = temples.filter(temple => temple.country === "India");
  const globalTemples = temples.filter(temple => temple.country !== "India");

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-4 flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/iskcon-temple-dome.jpg"
            alt="ISKCON Temple"
            fill
            sizes="100vw"
            priority
            className="object-cover brightness-75"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-sanskrit">ISKCON Temples</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Discover spiritual sanctuaries around the world dedicated to the worship of Lord Krishna
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 font-sanskrit">Sacred Spaces for Spiritual Connection</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              ISKCON temples are not merely buildings, but vibrant spiritual communities where devotees gather to practice devotional service, study sacred texts, and engage in worship of Lord Krishna. These temples serve as cultural centers, educational institutions, and spiritual havens for people from all walks of life.
            </p>
            <p className="text-gray-600 mb-10 leading-relaxed">
              With over 650 temples worldwide, ISKCON offers spiritual sanctuaries where anyone can experience the peace and joy of Krishna consciousness. Each temple follows traditional Vedic principles and provides a nurturing environment for spiritual growth.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#featured-temples" className="btn-primary">
                Featured Temples
              </Link>
              <Link href="#temple-experiences" className="btn-secondary">
                Temple Experiences
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="sticky top-16 z-30 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search temples by name or location…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <span className="text-xs text-gray-400">{temples.length} temples</span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <FaSpinner className="animate-spin text-orange-500 text-4xl" />
          <span className="ml-4 text-gray-500 text-lg">Loading temples from database…</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchTemples} className="bg-orange-500 text-white px-6 py-2 rounded-lg">Retry</button>
        </div>
      )}

      {/* Featured Temples Section — India */}
      {!loading && !error && (
        <section id="featured-temples" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="section-title mb-4">Temples in India</h2>
            {indiaTemples.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No Indian temples found. Add temples via the admin panel.</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {indiaTemples.map((temple, index) => (
                  <motion.div
                    key={temple._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-t-4 border-iskcon-orange"
                  >
                    <div className="relative h-64">
                      <Image
                        src={temple.image || '/images/iskcon-logo.png'}
                        alt={temple.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{temple.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <FaMapMarkerAlt className="text-iskcon-orange mr-2" />
                        <span>{temple.location}, {temple.country}</span>
                      </div>
                      {temple.phone && <div className="flex items-center text-gray-500 text-sm mb-2"><FaPhone className="text-orange-400 mr-2" />{temple.phone}</div>}
                      {temple.website && <div className="flex items-center text-gray-500 text-sm mb-4"><FaGlobe className="text-orange-400 mr-2" /><a href={temple.website} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">{temple.website}</a></div>}
                      <p className="text-gray-600 mb-4 line-clamp-3">{temple.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Global Temples Section */}
      {!loading && !error && globalTemples.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="section-title mb-16">ISKCON Around the World</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {globalTemples.map((temple, index) => (
                <motion.div
                  key={temple._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-t-4 border-iskcon-orange"
                >
                  <div className="relative h-64">
                    <Image src={temple.image || '/images/iskcon-logo.png'} alt={temple.name} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{temple.name}</h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <FaMapMarkerAlt className="text-iskcon-orange mr-2" />
                      <span>{temple.location}, {temple.country}</span>
                    </div>
                    <p className="text-gray-600 mb-6 line-clamp-3">{temple.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Temple Experiences Section */}
      <section id="temple-experiences" className="py-20 bg-iskcon-orange/10">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-16">Temple Experiences</h2>

          <motion.div
            ref={ref}
            variants={staggeredContainer}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <FaPrayingHands className="text-iskcon-orange text-4xl" />,
                title: "Daily Worship",
                description: "Experience the sacred arati ceremonies, where deities are offered worship with incense, lamps, flowers, and food while devotees sing devotional songs."
              },
              {
                icon: <FaCalendarAlt className="text-iskcon-orange text-4xl" />,
                title: "Festivals",
                description: "Join vibrant celebrations of sacred festivals like Janmashtami, Gaura Purnima, and Ratha Yatra, featuring music, dance, drama, and spiritual discourses."
              },
              {
                icon: <FaHeart className="text-iskcon-orange text-4xl" />,
                title: "Prasadam",
                description: "Taste spiritually sanctified vegetarian food (prasadam) that is first offered to Krishna with love and devotion before being distributed to visitors."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Temple Visit Tips */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-16">Planning Your Temple Visit</h2>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Visitor Guidelines</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Dress modestly; covered shoulders and legs are appropriate</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Remove shoes before entering temple rooms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Avoid bringing non-vegetarian food onto temple premises</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Photography may be restricted in certain areas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Maintain a respectful demeanor during ceremonies</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Best Times to Visit</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Morning arati (7:15 AM) - peaceful start to the day</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Evening arati (7:00 PM) - energetic ceremony with music</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Sunday Feast - cultural program and free vegetarian meal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Major festivals - immersive spiritual celebrations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Weekday afternoons - quieter time for personal reflection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find a Temple Near You */}
      <section className="py-16 bg-iskcon-saffron/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 font-sanskrit">Find a Temple Near You</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Discover the nearest ISKCON temple in your area and begin your spiritual journey today. Our temples welcome visitors of all backgrounds who wish to learn about Krishna consciousness.
          </p>
          <div className="max-w-xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row mb-4">
                <input
                  type="text"
                  placeholder="Enter your location"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-iskcon-orange mb-3 sm:mb-0 sm:mr-3"
                />
                <button className="btn-primary whitespace-nowrap">
                  Search Temples
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Or browse our <a href="#" className="text-iskcon-orange hover:underline">global temple directory</a> to find locations worldwide
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 