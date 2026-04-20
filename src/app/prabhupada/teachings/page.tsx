'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaBook, FaHeart, FaPrayingHands, FaChevronDown } from 'react-icons/fa';

const teachings = [
  {
    id: 1,
    title: "The Science of Self-Realization",
    description: "Understanding our true spiritual identity beyond the temporary material body.",
    principles: [
      "We are not this body but eternal spirit souls",
      "The soul is part and parcel of Krishna (God)",
      "Our natural position is one of service to the Supreme"
    ],
    image: "/images/srila-prabhupada.jpg"
  },
  {
    id: 2,
    title: "The Process of Bhakti Yoga",
    description: "The practical application of devotional service in everyday life.",
    principles: [
      "Chanting of the Hare Krishna Maha-mantra",
      "Following the four regulative principles",
      "Engaging in devotional service"
    ],
    image: "/images/krishna-temple.jpg"
  },
  {
    id: 3,
    title: "Understanding Krishna Consciousness",
    description: "The ultimate goal of life and the meaning of Krishna Consciousness.",
    principles: [
      "Krishna is the Supreme Personality of Godhead",
      "Love of God is our natural state",
      "Pure devotional service leads to perfect happiness"
    ],
    image: "/images/iskcon-temple-dome.jpg"
  }
];

export default function TeachingsPage() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="relative py-4 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/srila-prabhupada.jpg"
            alt="Srila Prabhupada Teaching"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Srila Prabhupada&apos;s Teachings
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Timeless wisdom for the modern age
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Quote */}
          <div className="bg-white rounded-lg p-8 shadow-lg mb-12">
            <FaQuoteLeft className="text-4xl text-iskcon-orange mb-4" />
            <blockquote className="text-xl italic text-gray-700 mb-4">
              &quot;Krishna consciousness is not an artificial imposition on the mind.
              This consciousness is the original energy of the living entity.&quot;
            </blockquote>
            <p className="text-right text-gray-600">- Srila Prabhupada</p>
          </div>

          {/* Teachings Sections */}
          <div className="space-y-6">
            {teachings.map((teaching) => (
              <motion.div
                key={teaching.id}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-6 cursor-pointer"
                  onClick={() => setExpandedSection(expandedSection === teaching.id ? null : teaching.id)}
                >
                  <h2 className="text-2xl font-bold text-gray-800">{teaching.title}</h2>
                  <FaChevronDown
                    className={`text-iskcon-orange transform transition-transform ${expandedSection === teaching.id ? 'rotate-180' : ''
                      }`}
                  />
                </div>

                {expandedSection === teaching.id && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 mb-4">{teaching.description}</p>
                    <ul className="space-y-3">
                      {teaching.principles.map((principle, index) => (
                        <li key={index} className="flex items-start">
                          <FaPrayingHands className="text-iskcon-orange mt-1 mr-3" />
                          <span>{principle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-iskcon-orange text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Begin Your Spiritual Journey</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Explore Srila Prabhupada&apos;s books and lectures to deepen your understanding
            of Krishna Consciousness.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/resources/books"
              className="bg-white text-iskcon-orange px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Explore Books
            </Link>
            <Link
              href="/resources/prabhupada/lectures"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-iskcon-orange transition"
            >
              Listen to Lectures
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
