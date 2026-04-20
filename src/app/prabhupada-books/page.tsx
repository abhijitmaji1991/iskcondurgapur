'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBook, FaBookOpen, FaPrayingHands, FaUserFriends, FaGlobe, FaVrCardboard } from 'react-icons/fa';

// Featured books data
const featuredBooks = [
  {
    id: 1,
    title: "Bhagavad-gita As It Is",
    description: "Experience the timeless wisdom of Bhagavad-gita with interactive study tools, audio narration, and virtual reality temple tours. Perfect for modern spiritual seekers.",
    icon: <FaBook className="text-5xl text-iskcon-orange" />,
    readLink: "/resources/books/bhagavad-gita",
    features: ["Interactive Commentary", "Audio Narration", "Virtual Temple Tours"]
  },
  {
    id: 2,
    title: "Srimad-Bhagavatam",
    description: "Dive deep into the ocean of spiritual knowledge with our enhanced digital edition featuring cross-references, study guides, and multimedia content.",
    icon: <FaBookOpen className="text-5xl text-iskcon-orange" />,
    readLink: "/resources/books/srimad-bhagavatam",
    features: ["Digital Enhancement", "Study Guides", "Multimedia Integration"]
  },
  {
    id: 3,
    title: "Sri Caitanya-caritamrta",
    description: "Follow the footsteps of Sri Caitanya Mahaprabhu through immersive storytelling, historical maps, and virtual pilgrimage experiences.",
    icon: <FaVrCardboard className="text-5xl text-iskcon-orange" />,
    readLink: "/resources/books/caitanya-caritamrta",
    features: ["Virtual Pilgrimage", "Historical Maps", "Cultural Insights"]
  },
  {
    id: 4,
    title: "Beyond Time and Space",
    description: "Explore the convergence of Vedic wisdom and modern science in this groundbreaking new work.",
    icon: <FaGlobe className="text-5xl text-iskcon-orange" />,
    readLink: "/resources/books/beyond-time-space",
    features: ["Scientific Research", "Quantum Physics", "Consciousness Studies"]
  }
];

export default function PrabhupadaBooksPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <FaBook className="text-iskcon-orange text-xl mr-2" />
            <span className="text-xl font-bold text-iskcon-orange">Prabhupada Books</span>
          </div>
          <nav className="flex space-x-6">
            <Link href="#" className="text-gray-700 hover:text-iskcon-orange">Home</Link>
            <Link href="#" className="text-gray-700 hover:text-iskcon-orange">Library</Link>
            <Link href="#" className="text-gray-700 hover:text-iskcon-orange">Reader</Link>
            <Link href="#" className="text-gray-700 hover:text-iskcon-orange">Bookmarks</Link>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Srila Prabhupada&apos;s
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-iskcon-orange mb-8">
              Divine Literature
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore the spiritual wisdom through Srila Prabhupada&apos;s books. Start your journey of
              self-realization today.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">Featured Books</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-md shadow-md overflow-hidden transition-transform hover:shadow-lg"
              >
                <div className="p-6 flex flex-col items-center">
                  <div className="mb-4">
                    {book.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3">{book.title}</h3>
                  <p className="text-gray-600 text-center mb-6">{book.description}</p>
                  <Link
                    href={book.readLink}
                    className="bg-iskcon-orange text-white px-6 py-2 rounded-md hover:bg-iskcon-orange-dark transition-colors"
                  >
                    Start Reading
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Explore More Books</h2>
              <p className="text-gray-600">Discover the complete collection of Srila Prabhupada&apos;s literary works</p>
            </div>
            <Link
              href="/resources/books"
              className="mt-4 md:mt-0 bg-iskcon-orange text-white px-6 py-3 rounded-md hover:bg-iskcon-orange-dark transition-colors"
            >
              Browse All Books
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}