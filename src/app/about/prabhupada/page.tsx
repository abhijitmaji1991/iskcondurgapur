'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaBookOpen, FaGlobeAsia, FaBuilding, FaPenNib } from 'react-icons/fa';

export default function PrabhupadaPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-4 flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/srila-prabhupada.jpg"
            alt="His Divine Grace A.C. Bhaktivedanta Swami Prabhupada"
            fill
            sizes="100vw"
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            A.C. Bhaktivedanta Swami Prabhupada
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Founder-Acharya of the International Society for Krishna Consciousness
          </motion.p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
              <div className="md:w-1/3">
                <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/images/iskcon-logo.png"
                    alt="Srila Prabhupada"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">A Spiritual Ambassador to the World</h2>
                <p className="text-lg text-gray-600 mb-4">
                  His Divine Grace A.C. Bhaktivedanta Swami Prabhupada (1896-1977) is widely regarded as the foremost Vedic scholar, translator, and spiritual teacher of the modern era. He made an unparalleled contribution to the world through his life and teachings.
                </p>
                <p className="text-lg text-gray-600">
                  In just twelve years, from his arrival in America in 1965 to his passing in 1977, Srila Prabhupada circled the globe fourteen times, established more than 100 temples, wrote and published over 70 volumes of transcendental literature, initiated 5,000 disciples, and introduced Krishna consciousness to millions worldwide.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-iskcon-blue/10 to-iskcon-orange/10 p-6 rounded-lg my-8">
              <div className="flex">
                <FaQuoteLeft className="text-4xl text-iskcon-orange opacity-40 mr-4 flex-shrink-0" />
                <blockquote className="text-xl italic text-gray-700">
                  &quot;The spiritual master opens our eyes, blinded by the darkness of ignorance, with the torch of knowledge.&quot;
                  <footer className="text-right text-gray-600 text-base mt-2">— Mundaka Upanishad 1.2.9, often quoted by Srila Prabhupada</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">The Life of Srila Prabhupada</h2>

          <div className="max-w-4xl mx-auto">
            {[
              {
                year: "1896",
                title: "Birth in Kolkata",
                description: "Born as Abhay Charan De on September 1, 1896, in Kolkata, India, to a devout Vaishnava family."
              },
              {
                year: "1922",
                title: "First Meeting with His Spiritual Master",
                description: "Met his spiritual master, Srila Bhaktisiddhanta Sarasvati Thakura, who requested him to spread Vedic knowledge in the English language to the Western world."
              },
              {
                year: "1944",
                title: "Back to Godhead Magazine",
                description: "Single-handedly launched Back to Godhead, an English fortnightly magazine that continues publication today."
              },
              {
                year: "1959",
                title: "Acceptance of Sannyasa",
                description: "Accepted the renounced order of life (sannyasa) at Mathura, India, receiving the title Bhaktivedanta Swami."
              },
              {
                year: "1965",
                title: "Journey to America",
                description: "At the age of 69, traveled to the United States on the cargo ship Jaladuta with just 40 rupees and a few books, suffering two heart attacks during the journey."
              },
              {
                year: "1966",
                title: "Founding of ISKCON",
                description: "Established the International Society for Krishna Consciousness in New York City, beginning a worldwide spiritual movement."
              },
              {
                year: "1967-1975",
                title: "Global Expansion",
                description: "Traveled extensively, opening temples across six continents and initiating thousands of disciples into the Vaishnava tradition."
              },
              {
                year: "1977",
                title: "Final Instructions and Departure",
                description: "Left this world on November 14, 1977, in Vrindavan, India, surrounded by disciples chanting the holy names of Krishna."
              }
            ].map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex mb-12 relative"
              >
                <div className="w-24 flex-shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 bg-iskcon-orange text-white rounded-full flex items-center justify-center font-bold">
                    {event.year}
                  </div>
                  <div className="h-full w-1 bg-iskcon-orange/30 mt-2"></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex-grow relative">
                  <div className="absolute top-6 left-0 transform -translate-x-1/2 w-4 h-4 bg-iskcon-orange rotate-45"></div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Remarkable Achievements</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-iskcon-blue/5 to-iskcon-orange/5 p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <FaBookOpen className="text-4xl text-iskcon-orange mr-4" />
                <h3 className="text-xl font-bold text-gray-800">Literary Contribution</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Translated and elaborately commented on over 80 volumes of India&apos;s most important sacred texts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Complete translation with commentary on Bhagavad-gita, Srimad-Bhagavatam, and Chaitanya-charitamrita</span>
                </li>
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>His books have been translated into more than 80 languages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Over half a billion books distributed worldwide</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-iskcon-blue/5 to-iskcon-orange/5 p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <FaGlobeAsia className="text-4xl text-iskcon-orange mr-4" />
                <h3 className="text-xl font-bold text-gray-800">Global Movement</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Established 108 Krishna temples on six continents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Initiated 5,000 disciples from diverse backgrounds and nationalities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Traveled around the globe 14 times spreading Krishna consciousness</span>
                </li>
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Introduced Krishna conscious festivals, food, music, and culture worldwide</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-iskcon-blue/5 to-iskcon-orange/5 p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <FaBuilding className="text-4xl text-iskcon-orange mr-4" />
                <h3 className="text-xl font-bold text-gray-800">Educational Institutions</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Founded Bhaktivedanta Book Trust, now the world&apos;s largest publisher of Vedic literature</span>
                </li>
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Established Gurukula educational system for children&apos;s spiritual and academic education</span>
                </li>
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Initiated the Bhaktivedanta Institute for advanced studies in science and Vedic knowledge</span>
                </li>
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Created farm communities worldwide promoting self-sufficiency and simple living</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-iskcon-blue/5 to-iskcon-orange/5 p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <FaPenNib className="text-4xl text-iskcon-orange mr-4" />
                <h3 className="text-xl font-bold text-gray-800">Cultural Impact</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Introduced and popularized mantra meditation and kirtan worldwide</span>
                </li>
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Pioneered vegetarianism and cow protection as spiritual practices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Preserved ancient Vedic traditions and arts in modern contexts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-iskcon-orange mr-2">•</span>
                  <span>Inspired millions to adopt spiritual practices in their daily lives</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Legacy & Quotes Section */}
      <section className="py-16 bg-gradient-to-r from-iskcon-blue/10 to-iskcon-orange/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Enduring Legacy</h2>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FaQuoteLeft className="text-4xl text-iskcon-orange opacity-40 mb-4" />
              <blockquote className="text-lg italic text-gray-700 mb-4">
                &quot;The human body is a rare opportunity, not to be wasted in pursuit of sense gratification but to be used to achieve the highest perfection of life: revival of our dormant Krishna consciousness.&quot;
              </blockquote>
              <footer className="text-right text-gray-600">— Srila Prabhupada</footer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <FaQuoteLeft className="text-4xl text-iskcon-orange opacity-40 mb-4" />
              <blockquote className="text-lg italic text-gray-700 mb-4">
                &quot;We are not this body. We are spiritual souls, part and parcel of Krishna, and we have an eternal relationship with Him that we must revive.&quot;
              </blockquote>
              <footer className="text-right text-gray-600">— Srila Prabhupada</footer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <FaQuoteLeft className="text-4xl text-iskcon-orange opacity-40 mb-4" />
              <blockquote className="text-lg italic text-gray-700 mb-4">
                &quot;This Krishna consciousness movement is not a fabrication of the mind. It is the science of the relationship between the living entity and the Supreme Personality of Godhead.&quot;
              </blockquote>
              <footer className="text-right text-gray-600">— Srila Prabhupada</footer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <FaQuoteLeft className="text-4xl text-iskcon-orange opacity-40 mb-4" />
              <blockquote className="text-lg italic text-gray-700 mb-4">
                &quot;Books are the basis, purity is the force, preaching is the essence, utility is the principle.&quot;
              </blockquote>
              <footer className="text-right text-gray-600">— Srila Prabhupada</footer>
            </div>
          </div>

          <div className="text-center">
            <Link href="/prabhupada-books" className="btn-primary">
              Explore Srila Prabhupada&apos;s Books
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-iskcon-saffron/10 rounded-xl p-8 shadow-md flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Discover More About Srila Prabhupada</h2>
              <p className="text-gray-600 mb-6">
                Dive deeper into the life and teachings of Srila Prabhupada through documentaries,
                lectures, and remembrances from his disciples.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/prabhupada-books" className="btn-primary">
                  Books by Srila Prabhupada
                </Link>
                <Link href="/resources/audio" className="btn-secondary">
                  Listen to His Lectures
                </Link>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="relative w-full h-48 md:h-64">
                <Image
                  src="/images/iskcon-logo.png"
                  alt="Srila Prabhupada Books"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 