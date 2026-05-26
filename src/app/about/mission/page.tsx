'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHeart, FaHandsHelping, FaGlobeAsia, FaBookOpen, FaUsers, FaQuoteLeft } from 'react-icons/fa';

export default function MissionPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-iskcon-blue/20 to-iskcon-orange/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Our Mission</h1>
            <p className="text-xl text-gray-600 mb-8">
              Sharing the timeless wisdom of Vedic knowledge with the world
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">ISKCON&apos;s Seven Purposes</h2>
              <p className="text-lg text-gray-600">
                Srila Prabhupada established the International Society for Krishna Consciousness (ISKCON) with seven clearly defined purposes:
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  number: 1,
                  text: "To systematically propagate spiritual knowledge to society at large and to educate all people in the techniques of spiritual life in order to check the imbalance of values in life and to achieve real unity and peace in the world."
                },
                {
                  number: 2,
                  text: "To propagate a consciousness of Krishna (God), as it is revealed in the great scriptures of India, Bhagavad-gita and Srimad-Bhagavatam."
                },
                {
                  number: 3,
                  text: "To bring the members of the Society together with each other and nearer to Krishna, the prime entity, thus developing the idea within the members, and humanity at large, that each soul is part and parcel of the quality of Godhead (Krishna)."
                },
                {
                  number: 4,
                  text: "To teach and encourage the sankirtana movement, congregational chanting of the holy name of God, as revealed in the teachings of Lord Sri Caitanya Mahaprabhu."
                },
                {
                  number: 5,
                  text: "To erect for the members and for society at large a holy place of transcendental pastimes dedicated to the personality of Krishna."
                },
                {
                  number: 6,
                  text: "To bring the members closer together for the purpose of teaching a simpler, more natural way of life."
                },
                {
                  number: 7,
                  text: "With a view towards achieving the aforementioned purposes, to publish and distribute periodicals, magazines, books and other writings."
                }
              ].map((purpose, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-iskcon-orange text-white rounded-full flex items-center justify-center font-bold text-xl">
                      {purpose.number}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-700 text-lg">{purpose.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Join Our Mission CTA */}
      <section className="py-16 bg-iskcon-saffron/10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Join Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              There are many ways to be part of ISKCON&apos;s global mission to spread spiritual knowledge and serve humanity.
              Whether through volunteering, donation, or personal spiritual practice, your contribution matters.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/events" className="btn-primary">
                Attend Our Programs
              </Link>
              <Link href="/contact" className="btn-secondary">
                Volunteer Opportunities
              </Link>
              <Link href="/donate" className="btn-secondary">
                Support Our Mission
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 