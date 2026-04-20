'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaBookOpen, FaPrayingHands, FaHeart, FaOm, FaUserFriends } from 'react-icons/fa';

interface Article {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

interface Category {
  name: string;
  icon: React.ReactNode;
}

const articles: Article[] = [
  {
    id: 1,
    category: 'Vedic Philosophy',
    title: 'Understanding Karma: The Law of Action and Reaction',
    excerpt: 'Explore the deep meaning of karma and how it affects our lives...',
    image: '/images/articles/karma.jpg',
    author: 'H.G. Krishna Das',
    date: 'March 15, 2024',
    readTime: '8 min read',
    tags: ['karma', 'philosophy', 'vedic-knowledge']
  },
  {
    id: 2,
    category: 'Bhagavad Gita',
    title: 'The Science of Self-Realization in Bhagavad Gita',
    excerpt: 'Discover how the Bhagavad Gita explains the nature of consciousness...',
    image: '/images/articles/self-realization.jpg',
    author: 'H.G. Radha Krishna Das',
    date: 'March 10, 2024',
    readTime: '10 min read',
    tags: ['bhagavad-gita', 'self-realization', 'consciousness']
  },
  {
    id: 3,
    category: 'Spiritual Life',
    title: 'The Power of Holy Name: Understanding the Hare Krishna Mahamantra',
    excerpt: 'Learn about the significance and benefits of chanting the Hare Krishna mantra...',
    image: '/images/articles/holy-name.jpg',
    author: 'H.G. Nityananda Das',
    date: 'March 5, 2024',
    readTime: '7 min read',
    tags: ['holy-name', 'chanting', 'spiritual-practice']
  },
  {
    id: 4,
    category: 'Temple Life',
    title: 'A Day in the Life of a Temple Devotee',
    excerpt: 'Experience the daily spiritual practices and activities in an ISKCON temple...',
    image: '/images/articles/temple-life.jpg',
    author: 'H.G. Bhakti Devi Dasi',
    date: 'March 1, 2024',
    readTime: '12 min read',
    tags: ['temple', 'devotee-life', 'spiritual-practice']
  },
  {
    id: 5,
    category: 'Festivals',
    title: 'The Spiritual Significance of Janmashtami',
    excerpt: "Understand the deep meaning behind the celebration of Lord Krishna's appearance...",
    image: '/images/articles/janmashtami.jpg',
    author: 'H.G. Govinda Das',
    date: 'February 25, 2024',
    readTime: '9 min read',
    tags: ['festivals', 'janmashtami', 'krishna']
  },
  {
    id: 6,
    category: 'Vedic Culture',
    title: 'The Art of Prasadam: Cooking with Devotion',
    excerpt: 'Learn about the spiritual practice of cooking and offering food to Krishna...',
    image: '/images/articles/prasadam.jpg',
    author: 'H.G. Radharani Devi Dasi',
    date: 'February 20, 2024',
    readTime: '15 min read',
    tags: ['prasadam', 'cooking', 'devotional-service']
  }
];

const categories: Category[] = [
  { name: 'All', icon: <FaBookOpen /> },
  { name: 'Vedic Philosophy', icon: <FaOm /> },
  { name: 'Bhagavad Gita', icon: <FaBookOpen /> },
  { name: 'Spiritual Life', icon: <FaPrayingHands /> },
  { name: 'Temple Life', icon: <FaHeart /> },
  { name: 'Festivals', icon: <FaUserFriends /> },
  { name: 'Vedic Culture', icon: <FaOm /> }
];

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 ||
      article.tags.some(tag => selectedTags.includes(tag));

    return matchesSearch && matchesCategory && matchesTags;
  });

  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)));

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/articles/articles-hero.jpg"
            alt="Articles Hero"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Spiritual Articles & Resources
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Explore our collection of articles on Vedic philosophy, spirituality, and Krishna consciousness
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-colors ${selectedCategory === category.name
                      ? 'bg-iskcon-orange text-white'
                      : 'bg-white text-gray-600 hover:bg-iskcon-orange/10'
                    }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTags.includes(tag)
                    ? 'bg-iskcon-orange text-white'
                    : 'bg-white text-gray-600 hover:bg-iskcon-orange/10'
                  }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-iskcon-orange text-white px-3 py-1 rounded-full text-sm">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 text-gray-800 hover:text-iskcon-orange transition-colors">
                    <Link href={`/resources/articles/${article.id}`}>
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.author}</span>
                    <span>{article.readTime}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter to receive the latest articles and spiritual insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
              />
              <button className="bg-iskcon-orange text-white px-6 py-2 rounded-lg hover:bg-iskcon-orange-dark transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 