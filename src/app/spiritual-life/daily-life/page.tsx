'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaPrayingHands, FaBook, FaUtensils, FaBell, FaUserFriends, FaChevronDown } from 'react-icons/fa';

const dailySchedule = [
  {
    id: 1,
    time: "4:00 AM - 4:30 AM",
    activity: "Wake Up & Fresh Up",
    icon: <FaSun className="text-2xl text-iskcon-orange" />,
    description: "Rise early during the Brahma-muhurta period, the most auspicious time for spiritual activities.",
    tips: [
      "Set multiple alarms if needed",
      "Sleep early the night before",
      "Keep water by your bedside"
    ]
  },
  {
    id: 2,
    time: "4:30 AM - 6:30 AM",
    activity: "Mangala Arati & Japa Meditation",
    icon: <FaPrayingHands className="text-2xl text-iskcon-orange" />,
    description: "Attend temple service and chant the Hare Krishna Maha-mantra on beads.",
    tips: [
      "Keep your japa beads in a clean bag",
      "Find a quiet spot for chanting",
      "Focus on hearing the holy name"
    ]
  },
  {
    id: 3,
    time: "6:30 AM - 7:30 AM",
    activity: "Scripture Reading",
    icon: <FaBook className="text-2xl text-iskcon-orange" />,
    description: "Study Srila Prabhupada's books, particularly Srimad-Bhagavatam with devotees.",
    tips: [
      "Read at least one verse daily",
      "Take notes of important points",
      "Discuss with other devotees"
    ]
  },
  {
    id: 4,
    time: "7:30 AM - 8:30 AM",
    activity: "Prasadam & Preparation",
    icon: <FaUtensils className="text-2xl text-iskcon-orange" />,
    description: "Honor breakfast prasadam and prepare for the day ahead.",
    tips: [
      "Offer food to Krishna before eating",
      "Eat in a clean and peaceful environment",
      "Practice mindful eating"
    ]
  }
];

const spiritualPractices = [
  {
    title: "Morning Program",
    practices: [
      "Mangala Arati attendance",
      "Tulasi Puja",
      "Japa meditation",
      "Guru Puja",
      "Scripture class"
    ]
  },
  {
    title: "Daily Devotional Practices",
    practices: [
      "16 rounds of Hare Krishna mantra",
      "Reading Bhagavad-gita",
      "Offering food to Krishna",
      "Serving the devotees",
      "Evening arati"
    ]
  },
  {
    title: "Regulated Lifestyle",
    practices: [
      "Early rising",
      "Following four regulative principles",
      "Eating only prasadam",
      "Association with devotees",
      "Temple service"
    ]
  }
];

export default function DailyLifePage() {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-4 flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/images/krishna-temple.jpg"
            alt="Temple Morning Program"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Daily Spiritual Life</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Transform your daily routine into a spiritual journey
          </p>
        </div>
      </section>

      {/* Daily Schedule Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Daily Schedule</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {dailySchedule.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
              >
                <div className="flex items-center space-x-4">
                  {item.icon}
                  <div>
                    <p className="text-sm text-gray-500">{item.time}</p>
                    <h3 className="text-xl font-semibold">{item.activity}</h3>
                  </div>
                </div>
                <FaChevronDown
                  className={`text-iskcon-orange transform transition-transform ${expandedItem === item.id ? 'rotate-180' : ''
                    }`}
                />
              </div>

              {expandedItem === item.id && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Helpful Tips:</h4>
                    <ul className="space-y-2">
                      {item.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-iskcon-orange mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Spiritual Practices Grid */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Essential Spiritual Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {spiritualPractices.map((section, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 shadow-md"
              >
                <h3 className="text-xl font-bold text-iskcon-orange mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.practices.map((practice, practiceIndex) => (
                    <li key={practiceIndex} className="flex items-center">
                      <FaPrayingHands className="text-iskcon-orange mr-3" />
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-iskcon-orange text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Your Spiritual Journey Today</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our community and experience the transformative power of Krishna consciousness
            in your daily life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/temples"
              className="bg-white text-iskcon-orange px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Find Nearest Temple
            </a>
            <a
              href="/resources/books"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-iskcon-orange transition"
            >
              Explore Resources
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
