'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaDownload, FaCalendar, FaMapMarkerAlt, FaSearch, FaFilter } from 'react-icons/fa';

// Sample lecture data
const lectures = [
  {
    id: 1,
    title: "The Purpose of Human Life",
    date: "June 12, 1966",
    location: "New York, USA",
    duration: "45:32",
    category: "Philosophy",
    description: "Srila Prabhupada explains the ultimate purpose of human existence and how to achieve it.",
    audioUrl: "/lectures/purpose-of-human-life.mp3",
    thumbnail: "/images/srila-prabhupada-teaching.jpg",
    tags: ["philosophy", "spirituality", "life-purpose"]
  },
  {
    id: 2,
    title: "Understanding Bhagavad-gita",
    date: "August 15, 1966",
    location: "New York, USA",
    duration: "52:18",
    category: "Scripture",
    description: "A comprehensive overview of the Bhagavad-gita's essential teachings.",
    audioUrl: "/lectures/understanding-gita.mp3",
    thumbnail: "/images/bhagavad-gita-class.jpg",
    tags: ["bhagavad-gita", "krishna", "dharma"]
  },
  {
    id: 3,
    title: "The Science of God Realization",
    date: "March 23, 1975",
    location: "Mayapur, India",
    duration: "63:45",
    category: "Science",
    description: "Exploring the scientific basis of God consciousness and spiritual practice.",
    audioUrl: "/lectures/god-realization.mp3",
    thumbnail: "/images/science-of-god.jpg",
    tags: ["science", "consciousness", "god-realization"]
  }
];

const categories = ["All", "Philosophy", "Scripture", "Science", "Culture", "Festivals"];

export default function LecturesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [playingLecture, setPlayingLecture] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredLectures = lectures.filter(lecture => {
    const matchesSearch = lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || lecture.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePlay = (lectureId: number) => {
    setPlayingLecture(lectureId);
    setIsPlaying(true);
    // In a real app, implement audio playback logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="relative py-4 flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/images/srila-prabhupada.jpg"
            alt="Srila Prabhupada"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Divine Lectures</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Timeless wisdom from His Divine Grace A.C. Bhaktivedanta Swami Prabhupada
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search lectures..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-iskcon-orange focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === category
                    ? 'bg-iskcon-orange text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lectures Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((lecture) => (
            <motion.div
              key={lecture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={lecture.thumbnail}
                  alt={lecture.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handlePlay(lecture.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 transition-opacity"
                >
                  {playingLecture === lecture.id && isPlaying ? (
                    <FaPause className="text-white text-4xl" />
                  ) : (
                    <FaPlay className="text-white text-4xl" />
                  )}
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{lecture.title}</h3>
                <p className="text-gray-600 mb-4">{lecture.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FaCalendar className="mr-2" />
                  {lecture.date}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FaMapMarkerAlt className="mr-2" />
                  {lecture.location}
                </div>
                <div className="flex flex-wrap gap-2">
                  {lecture.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{lecture.duration}</span>
                  <button
                    className="text-iskcon-orange hover:text-orange-700"
                    title="Download lecture"
                  >
                    <FaDownload />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
