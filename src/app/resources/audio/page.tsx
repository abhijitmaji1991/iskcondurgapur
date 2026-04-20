import React from 'react';
import Image from 'next/image';
import { FaSearch, FaPlay, FaPause, FaDownload, FaHeart, FaRegHeart, FaShare } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface FeaturedContent {
  title: string;
  speaker: string;
  duration: string;
  description: string;
  date: string;
  image: string;
}

interface AudioCategory {
  name: string;
  description: string;
  count: number;
  icon: React.ReactNode;
}

// Sample audio content
const featuredContent: FeaturedContent[] = [
  {
    title: "Introduction to Bhagavad Gita",
    speaker: "Srila Prabhupada",
    duration: "45:30",
    description: "A comprehensive introduction to the timeless wisdom of Bhagavad Gita.",
    date: "May 15, 2023",
    image: "/images/bhagavad-gita-intro.jpg"
  },
  {
    title: "Hare Krishna Maha Mantra Kirtan",
    speaker: "Aindra Prabhu",
    duration: "1:12:45",
    description: "Beautiful kirtan of the Hare Krishna Maha Mantra.",
    date: "June 3, 2023",
    image: "/images/kirtan-1.jpg"
  },
  {
    title: "The Science of Self-Realization",
    speaker: "Radhanath Swami",
    duration: "52:15",
    description: "Exploring the deep science behind self-realization and spiritual consciousness.",
    date: "July 10, 2023",
    image: "/images/self-realization.jpg"
  }
];

const audioCategories: AudioCategory[] = [
  {
    name: "Lectures",
    description: "Philosophical and spiritual discourses",
    count: 245,
    icon: <FaSearch className="text-iskcon-orange text-2xl" />
  },
  {
    name: "Kirtans",
    description: "Devotional chanting and songs",
    count: 187,
    icon: <FaPlay className="text-iskcon-orange text-2xl" />
  },
  {
    name: "Bhajans",
    description: "Traditional devotional songs",
    count: 142,
    icon: <FaHeart className="text-iskcon-orange text-2xl" />
  },
  {
    name: "Guided Meditations",
    description: "Spiritual meditation sessions",
    count: 78,
    icon: <FaPause className="text-iskcon-orange text-2xl" />
  }
];

export default function AudioPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="relative py-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-iskcon-orange/20 to-iskcon-blue/20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Spiritual Audio Resources</h1>
            <p className="text-xl text-gray-600 mb-8">
              Explore an extensive collection of lectures, kirtans, bhajans, and guided meditations to deepen your spiritual practice.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for lectures, kirtans, bhajans..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
              />
              <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-iskcon-orange text-white px-4 py-1.5 rounded-full hover:bg-iskcon-orange-dark transition">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured content section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Featured Audio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredContent.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
                <div className="relative h-48 bg-iskcon-orange/10">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-iskcon-orange hover:bg-iskcon-orange-dark rounded-full p-4 text-white shadow-lg transition">
                    <FaPlay className="text-2xl" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg line-clamp-1 text-gray-800">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.speaker}</p>
                    </div>
                    <span className="bg-iskcon-orange/10 text-gray-700 text-xs px-2 py-1 rounded">
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-iskcon-orange">
                        <FaRegHeart />
                      </button>
                      <button className="text-gray-400 hover:text-iskcon-orange">
                        <FaShare />
                      </button>
                      <button className="text-gray-400 hover:text-iskcon-orange">
                        <FaDownload />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="bg-iskcon-orange text-white px-6 py-2 rounded-full hover:bg-iskcon-orange-dark transition">
              View All Featured Content
            </button>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="py-12 bg-gradient-to-r from-iskcon-blue/10 to-iskcon-orange/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {audioCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-16 h-16 mx-auto bg-iskcon-orange/10 rounded-full flex items-center justify-center mb-4">
                  {category.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                <span className="text-iskcon-orange font-medium text-sm hover:underline cursor-pointer">
                  Browse {category.count} audios →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular series section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Popular Series</h2>

          <div className="overflow-x-auto">
            <div className="inline-flex space-x-6 min-w-full py-4 px-2">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden min-w-[280px] hover:shadow-lg transition-shadow flex-shrink-0 border border-gray-100">
                  <div className="relative h-40 bg-iskcon-orange/10">
                    <Image
                      src={`/images/audio-series-${index + 1}.jpg`}
                      alt={`Audio Series ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1 text-gray-800">Bhagavad Gita Chapter {index + 1}</h3>
                    <p className="text-gray-600 text-sm mb-2">By Srila Prabhupada</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{10 + index} episodes</span>
                      <button className="bg-iskcon-orange text-white text-xs px-3 py-1 rounded-full hover:bg-iskcon-orange-dark transition">
                        Listen
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="bg-iskcon-orange text-white px-6 py-2 rounded-full hover:bg-iskcon-orange-dark transition">
              View All Series
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter section */}
      <section className="py-12 bg-iskcon-saffron/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Stay Updated</h2>
            <p className="text-gray-600 text-center mb-6">
              Subscribe to receive notifications about new audio uploads and featured content.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
              />
              <button className="bg-iskcon-orange text-white px-6 py-2 rounded-lg hover:bg-iskcon-orange-dark transition sm:w-auto w-full">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 