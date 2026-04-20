"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const quotes = [
  {
    id: 1,
    text: "Brahmacārī life is meant for following the rules and regulations under the guidance of the spiritual master.",
    source: "Srimad-Bhagavatam 3.12.41, Purport"
  },
  {
    id: 2,
    text: "The basic principle of the brahmacārī's life is to have firm faith in the spiritual master. The brahmacārī is supposed to live under the care of the spiritual master and serve him with heart and soul.",
    source: "Srimad-Bhagavatam 7.12.1, Purport"
  },
  {
    id: 3,
    text: "A brahmacārī should have complete control over his senses and should be fully engaged in the service of the Lord.",
    source: "Bhagavad-gita As It Is, 6.14, Purport"
  },
  {
    id: 4,
    text: "The whole purpose of brahmacārī life is to become free from sexual attachment.",
    source: "Srimad-Bhagavatam 7.12.8, Purport"
  },
  {
    id: 5,
    text: "A brahmacārī is trained to be satisfied with eating simply to keep body and soul together. He is not allowed to eat anything and everything, as he pleases.",
    source: "Srimad-Bhagavatam 3.13.7, Purport"
  },
  {
    id: 6,
    text: "The brahmacārī system of education is especially intended for training both body and mind in spiritual values.",
    source: "Srimad-Bhagavatam 3.21.45, Purport"
  },
  {
    id: 7,
    text: "A brahmacārī should avoid talking with women as far as possible. Of course in Krishna consciousness we don't shun women as a class, but we don't talk with them unnecessarily.",
    source: "Perfect Questions, Perfect Answers"
  },
  {
    id: 8,
    text: "The life of a brahmacārī is meant for advancing in spiritual life and developing Krishna consciousness.",
    source: "Lecture, Vrindavan, 1976"
  },
  {
    id: 9,
    text: "A brahmacārī is supposed to rise early in the morning and render service to the spiritual master, study Vedic literature and perform other spiritual activities.",
    source: "Srimad-Bhagavatam 7.12.1-2, Purport"
  },
  {
    id: 10,
    text: "The brahmacārī system teaches one how to lead a life of austerities and penances in order to understand spiritual values.",
    source: "Science of Self-Realization"
  }
];

const PrabhupadaQuotesPage = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  const handleNextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  const handlePrevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Hero Section */}
      <section className="py-4 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-purple-900 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Prabhupada Quotes
          </motion.h1>
          <motion.p
            className="text-lg text-gray-700 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover the profound wisdom of Srila Prabhupada about brahmacharya - the spiritual path of celibacy and self-discipline.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4 mb-16">
        <div className="max-w-4xl mx-auto">
          {/* Quote Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
            <div className="p-8">
              <div className="flex justify-center mb-8">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200">
                  <Image
                    src="/images/iskcon-logo.png"
                    alt="Srila Prabhupada"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <blockquote className="text-xl italic text-center text-gray-700 mb-6 relative">
                <span className="text-5xl text-purple-300 absolute top-0 left-0">&quot;</span>
                <p className="px-10 py-2">{quotes[currentQuote].text}</p>
                <span className="text-5xl text-purple-300 absolute bottom-0 right-0">&quot;</span>
              </blockquote>

              <p className="text-center text-purple-800 font-medium">
                — {quotes[currentQuote].source}
              </p>

              <div className="flex justify-center mt-8 space-x-4">
                <button
                  onClick={handlePrevQuote}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300"
                >
                  Previous Quote
                </button>
                <button
                  onClick={handleNextQuote}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300"
                >
                  Next Quote
                </button>
              </div>
            </div>
          </div>

          {/* About Brahmachari Life */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">About Brahmacharya</h2>
              <p className="text-gray-700 mb-4">
                Brahmacharya is the first stage of life in the Vedic system, focused on spiritual education and self-discipline.
                It forms the foundation for a strong spiritual life through the practice of celibacy and devotional service.
              </p>
              <p className="text-gray-700 mb-4">
                Srila Prabhupada emphasized the importance of brahmacharya training for developing strong spiritual character
                and understanding the deeper aspects of Krishna consciousness.
              </p>
              <p className="text-gray-700">
                In ISKCON temples worldwide, many devotees practice brahmacharya life, dedicating themselves to spiritual study
                and service under the guidance of senior devotees and spiritual masters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* More Resources Section */}
      <section className="py-12 px-4 bg-purple-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">Explore More Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/resources/books" passHref>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">Sacred Books</h3>
                <p className="text-gray-600">Explore our collection of sacred books and scriptures.</p>
              </div>
            </Link>

            <Link href="/resources/audio" passHref>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">Audio Lectures</h3>
                <p className="text-gray-600">Listen to enlightening lectures and kirtans.</p>
              </div>
            </Link>

            <Link href="/resources/background-remover" passHref>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">Background Remover</h3>
                <p className="text-gray-600">Create professional-looking images for your devotional content.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-purple-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8 max-w-2xl mx-auto">Subscribe to our newsletter to receive updates on new resources and upcoming events.</p>

          <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-medium px-6 py-3 rounded-md transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PrabhupadaQuotesPage; 