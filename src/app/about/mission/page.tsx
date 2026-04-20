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

      {/* Core Values Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Our Core Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Compassion",
                description: "Extending love and kindness to all living beings, recognizing them as spiritual souls worthy of respect and care.",
                icon: <FaHeart className="text-4xl text-iskcon-orange mb-4" />
              },
              {
                title: "Service",
                description: "Dedicating ourselves to selflessly serving Krishna and all living beings, which is the essence of spiritual practice.",
                icon: <FaHandsHelping className="text-4xl text-iskcon-orange mb-4" />
              },
              {
                title: "Education",
                description: "Sharing authentic spiritual knowledge from authorized Vedic texts to help people understand their true spiritual identity.",
                icon: <FaBookOpen className="text-4xl text-iskcon-orange mb-4" />
              },
              {
                title: "Community",
                description: "Building a global family of devotees and spiritual seekers who support each other in their spiritual journey.",
                icon: <FaUsers className="text-4xl text-iskcon-orange mb-4" />
              },
              {
                title: "Sustainability",
                description: "Promoting a balanced, simple lifestyle in harmony with nature and Earth's resources, based on spiritual principles.",
                icon: <FaGlobeAsia className="text-4xl text-iskcon-orange mb-4" />
              },
              {
                title: "Cultural Preservation",
                description: "Preserving and sharing the rich spiritual heritage of India's Vedic culture through art, music, and traditions.",
                icon: <FaBookOpen className="text-4xl text-iskcon-orange mb-4" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow"
              >
                {item.icon}
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Our Global Impact</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Spiritual Education</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Over 700 temples, centers, rural communities, schools, and restaurants worldwide</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Millions of books distributed on spiritual knowledge, philosophy, and self-realization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Educational programs reaching universities, schools, and communities</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Humanitarian Efforts</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Food for Life Global: world&apos;s largest plant-based food relief program</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Millions of free vegetarian meals distributed annually to those in need</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iskcon-orange mr-2">•</span>
                    <span>Disaster relief programs providing aid during natural calamities worldwide</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-iskcon-blue/10 to-iskcon-orange/10 p-6 rounded-lg my-8">
              <div className="flex">
                <FaQuoteLeft className="text-4xl text-iskcon-orange opacity-40 mr-4 flex-shrink-0" />
                <blockquote className="text-xl italic text-gray-700">
                  &quot;I have started this International Society for Krishna Consciousness with this mission:
                  to save the human society from spiritual death.&quot;
                  <footer className="text-right text-gray-600 text-base mt-2">— Srila Prabhupada</footer>
                </blockquote>
              </div>
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