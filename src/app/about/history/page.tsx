'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGlobeAsia, FaBookOpen, FaQuoteLeft, FaLandmark, FaUsers } from 'react-icons/fa';

export default function HistoryPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-4 flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/history-of-iskcon.jpg"
            alt="History of ISKCON"
            fill
            sizes="100vw"
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              History of ISKCON
            </motion.h1>
            <motion.p
              className="text-xl text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              From humble beginnings to a global spiritual movement
            </motion.p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">The Origins of ISKCON</h2>
            <p className="text-lg text-gray-600 mb-6">
              The International Society for Krishna Consciousness (ISKCON), also known as the Hare Krishna movement, was founded in 1966 in New York City by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada. The movement belongs to the Gaudiya-Vaishnava sampradaya, a monotheistic tradition within Vedic culture.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              ISKCON traces its origins to the teachings of Lord Chaitanya Mahaprabhu (1486-1534), who is considered by followers as an incarnation of Krishna Himself. Lord Chaitanya revitalized the bhakti tradition in India through His emphasis on the congregational chanting of God&apos;s holy names as the most effective means of spiritual awakening in the current age.
            </p>
            <p className="text-lg text-gray-600">
              This spiritual lineage was preserved through the centuries by a succession of self-realized spiritual masters, which ultimately led to Srila Prabhupada bringing these ancient teachings to the Western world in the mid-20th century, fulfilling the prediction that the holy name of Krishna would be heard &quot;in every town and village&quot; across the globe.
            </p>

            <div className="bg-gradient-to-r from-iskcon-blue/10 to-iskcon-orange/10 p-6 rounded-lg my-8">
              <div className="flex">
                <FaQuoteLeft className="text-4xl text-iskcon-orange opacity-40 mr-4 flex-shrink-0" />
                <blockquote className="text-xl italic text-gray-700">
                  &quot;In these Western countries, the Krishna consciousness movement was first started in New York in 1966. From New York, it spread to San Francisco, Montreal, Boston, Los Angeles, and Buffalo, and now we have twenty-two centers all over the United States, Canada, England, and Germany.&quot;
                  <footer className="text-right text-gray-600 text-base mt-2">— Srila Prabhupada in 1970</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Key Milestones in ISKCON&apos;s History</h2>

          <div className="max-w-4xl mx-auto">
            {[
              {
                year: "1896",
                title: "Birth of Srila Prabhupada",
                description: "A.C. Bhaktivedanta Swami Prabhupada was born in Calcutta, India, on September 1, 1896."
              },
              {
                year: "1922",
                title: "First Meeting with Spiritual Master",
                description: "Srila Prabhupada met his spiritual master, Srila Bhaktisiddhanta Sarasvati Thakura, who requested him to spread Krishna consciousness to the English-speaking world."
              },
              {
                year: "1944",
                title: "Back to Godhead Magazine",
                description: "Srila Prabhupada began publishing Back to Godhead magazine, which continues to be published today in multiple languages."
              },
              {
                year: "1965",
                title: "Journey to America",
                description: "At the age of 69, Srila Prabhupada traveled to the United States on the cargo ship Jaladuta, arriving in Boston with only a few rupees and his translations of sacred texts."
              },
              {
                year: "1966",
                title: "Founding of ISKCON",
                description: "Srila Prabhupada officially established the International Society for Krishna Consciousness in a small storefront at 26 Second Avenue in New York City."
              },
              {
                year: "1967",
                title: "First Ratha Yatra in the West",
                description: "The first Ratha Yatra (Festival of the Chariots) outside of India was held in San Francisco, now an annual tradition in major cities worldwide."
              },
              {
                year: "1970",
                title: "First Temples in Europe",
                description: "ISKCON expanded to Europe with centers established in London and other major European cities."
              },
              {
                year: "1971",
                title: "Return to India",
                description: "Srila Prabhupada returned to India with Western disciples, significantly impacting the revival of Vaishnava traditions in its homeland."
              },
              {
                year: "1972",
                title: "Gurukula System Established",
                description: "The first ISKCON gurukula (school) was established in Dallas, Texas, to provide spiritual education for children."
              },
              {
                year: "1974",
                title: "Food for Life Begins",
                description: "The Food for Life program was initiated, which would later become the world's largest vegetarian food relief organization."
              },
              {
                year: "1977",
                title: "Passing of Srila Prabhupada",
                description: "Srila Prabhupada passed away in Vrindavan, India, on November 14, leaving a worldwide movement with over 100 temples, farms, and educational centers."
              },
              {
                year: "1980s",
                title: "Global Expansion",
                description: "ISKCON continued to grow globally, establishing temples in Africa, Australia, and throughout Asia."
              },
              {
                year: "1996",
                title: "Centennial Celebrations",
                description: "ISKCON celebrated the centennial of Srila Prabhupada's appearance with worldwide festivities and special publications."
              },
              {
                year: "2016",
                title: "50th Anniversary",
                description: "ISKCON celebrated its 50th anniversary, marking half a century of spreading Krishna consciousness around the world."
              },
              {
                year: "Present Day",
                title: "Continued Growth",
                description: "ISKCON has grown to include over 650 centers, temples, rural communities, schools, and restaurants worldwide, with millions of congregational members."
              }
            ].map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex mb-12 relative"
              >
                <div className="w-24 flex-shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 bg-iskcon-orange text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {milestone.year}
                  </div>
                  {index < 14 && <div className="h-full w-1 bg-iskcon-orange/30 mt-2"></div>}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">ISKCON Worldwide</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-lg shadow-md bg-gradient-to-r from-iskcon-blue/5 to-iskcon-orange/5"
            >
              <FaLandmark className="text-5xl text-iskcon-orange mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2 text-gray-800">650+</h3>
              <p className="text-lg text-gray-600">Temples & Centers Worldwide</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-lg shadow-md bg-gradient-to-r from-iskcon-blue/5 to-iskcon-orange/5"
            >
              <FaGlobeAsia className="text-5xl text-iskcon-orange mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2 text-gray-800">120+</h3>
              <p className="text-lg text-gray-600">Countries with ISKCON Presence</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-lg shadow-md bg-gradient-to-r from-iskcon-blue/5 to-iskcon-orange/5"
            >
              <FaUsers className="text-5xl text-iskcon-orange mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2 text-gray-800">Millions</h3>
              <p className="text-lg text-gray-600">Of Practicing Members</p>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Notable ISKCON Temples Around the World</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: "Sri Sri Radha Krishna Temple",
                  location: "Mayapur, India",
                  description: "ISKCON's world headquarters and site of the Temple of the Vedic Planetarium, one of the largest Vedic temples in the world."
                },
                {
                  name: "Sri Sri Radha London-isvara",
                  location: "London, UK",
                  description: "Historic Bhaktivedanta Manor, gifted to ISKCON by George Harrison of the Beatles, serves as a major spiritual and cultural center."
                },
                {
                  name: "Krishna Balaram Mandir",
                  location: "Vrindavan, India",
                  description: "A significant pilgrimage site where Srila Prabhupada spent his final days, featuring beautiful marble architecture."
                },
                {
                  name: "ISKCON Temple of the Vedic Planetarium",
                  location: "Mayapur, India",
                  description: "An ambitious project showcasing Vedic cosmology and housing the world's largest Vedic chandelier."
                },
                {
                  name: "New Vrindaban",
                  location: "West Virginia, USA",
                  description: "One of the first ISKCON farm communities, featuring the magnificent Palace of Gold, often called 'America's Taj Mahal'."
                },
                {
                  name: "Sri Sri Radha Parthasarathi Mandir",
                  location: "New Delhi, India",
                  description: "An iconic temple complex that attracts millions of visitors annually and houses a world-class Vedic cultural center."
                }
              ].map((temple, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 border border-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h4 className="text-xl font-bold mb-1 text-gray-800">{temple.name}</h4>
                  <p className="text-iskcon-orange mb-3 font-medium">{temple.location}</p>
                  <p className="text-gray-600">{temple.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Contributions Section */}
      <section className="py-16 bg-gradient-to-r from-iskcon-blue/10 to-iskcon-orange/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Cultural Contributions</h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <FaBookOpen className="text-iskcon-orange mr-2" /> Literary Legacy
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Publication of hundreds of books on Vedic philosophy, culture, and spirituality</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Translations of ancient sacred texts like Bhagavad-gita and Srimad-Bhagavatam into over 80 languages</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Back to Godhead magazine, published continuously since 1944</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <FaUsers className="text-iskcon-orange mr-2" /> Spiritual Practices
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Introduction of mantra meditation to millions worldwide</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Popularization of kirtan (devotional music) in mainstream culture</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Establishment of vegetarianism as a spiritual and ethical practice</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Festivals & Celebrations</h3>
              <p className="text-gray-600 mb-4">
                ISKCON has introduced traditional Vedic festivals to people around the world, including:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800">Ratha Yatra</h4>
                  <p className="text-gray-600">The Festival of Chariots, celebrated in major cities globally</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800">Janmashtami</h4>
                  <p className="text-gray-600">The appearance day of Lord Krishna</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800">Gaura Purnima</h4>
                  <p className="text-gray-600">Celebrating the appearance of Lord Chaitanya Mahaprabhu</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800">Diwali & Govardhan Puja</h4>
                  <p className="text-gray-600">Festival of Lights and honoring of Govardhan Hill</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">The Future of ISKCON</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              As ISKCON continues to grow in the 21st century, the society remains committed to Srila Prabhupada&apos;s original vision of spreading Krishna consciousness globally while adapting to modern challenges and opportunities.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/about/mission" className="btn-primary">
                Our Mission
              </Link>
              <Link href="/about/prabhupada" className="btn-secondary">
                About Srila Prabhupada
              </Link>
              <Link href="/temples" className="btn-secondary">
                Find a Temple
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 