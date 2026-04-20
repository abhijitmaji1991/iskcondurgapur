'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaQuoteLeft, FaQuoteRight, FaGlobe, FaUsers, FaPrayingHands, FaBookOpen } from 'react-icons/fa';

export default function AboutPage() {
  // Animation setup
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggeredContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] lg:h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/iskcon-temple-dome.jpg"
            alt="ISKCON Temple Dome"
            layout="fill"
            objectFit="cover"
            priority
            className="brightness-75"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-sanskrit">About ISKCON</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            The International Society for Krishna Consciousness - Connecting the world through spiritual wisdom
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Journey</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 1966 by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, ISKCON belongs to the Gaudiya-Vaishnava sampradāya, a monotheistic tradition within Vedic or Hindu culture. The antiquity of this tradition is revealed through ancient Sanskrit texts known as the Vedas.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                ISKCON follows the teachings of the Vedas and the Vedic scriptures, including Bhagavad-gita and Srimad-Bhagavatam. These teachings present the most elevated and intimate understanding of God in the form of Sri Krishna, the All-Attractive One.
              </p>
              <div className="flex space-x-4">
                <Link href="/about/prabhupada" className="btn-primary">
                  About Srila Prabhupada
                </Link>
                <Link href="/about/history" className="btn-secondary">
                  Our History
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative h-96 w-full rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/prabhupada.jpg"
                  alt="Srila Prabhupada, the founder of ISKCON"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-iskcon-orange/10 rounded-full"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-iskcon-gold/10 rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Mission</h2>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <FaQuoteLeft className="absolute -left-8 -top-2 text-2xl text-iskcon-orange opacity-30" />
                <p className="text-xl text-gray-600 italic">
                  To systematically propagate spiritual knowledge to society at large and to educate all people in the techniques of spiritual life in order to check the imbalance of values in life and to achieve real unity and peace in the world.
                </p>
                <FaQuoteRight className="absolute -right-8 -bottom-2 text-2xl text-iskcon-orange opacity-30" />
              </div>
            </div>
          </div>

          <motion.div
            ref={ref}
            variants={staggeredContainer}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <FaGlobe className="text-iskcon-orange text-4xl" />,
                title: "Global Community",
                description: "ISKCON has established over 650 temples, centers, rural communities, schools, and restaurants around the world."
              },
              {
                icon: <FaUsers className="text-iskcon-orange text-4xl" />,
                title: "All-Inclusive",
                description: "We welcome people from all backgrounds, regardless of race, gender, or nationality, to join in exploring Vedic wisdom."
              },
              {
                icon: <FaPrayingHands className="text-iskcon-orange text-4xl" />,
                title: "Spiritual Practice",
                description: "ISKCON promotes the practice of bhakti-yoga, focusing on devotional service to Lord Krishna through various activities."
              },
              {
                icon: <FaBookOpen className="text-iskcon-orange text-4xl" />,
                title: "Ancient Wisdom",
                description: "We distribute Vedic literature translated into modern languages to make this timeless knowledge accessible to all."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-iskcon-orange"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Beliefs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Core Beliefs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
            {[
              {
                title: "The Holy Name",
                content: "We practice the chanting of the Hare Krishna mantra: Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare / Hare Rama, Hare Rama, Rama Rama, Hare Hare. This transcendental sound vibration connects us directly with God."
              },
              {
                title: "Lord Krishna",
                content: "We understand Krishna as the Supreme Personality of Godhead, the origin of all that exists. Krishna is all-attractive and the source of all pleasure, knowledge, and existence."
              },
              {
                title: "Bhakti Yoga",
                content: "The path of devotional service is the primary spiritual practice we follow. It involves dedicating one's thoughts, words, and actions to please the Supreme Lord."
              },
              {
                title: "Four Regulative Principles",
                content: "Practitioners follow four regulative principles: no meat-eating, no intoxication, no gambling, and no illicit sex. These principles help in maintaining physical, mental, and spiritual well-being."
              },
            ].map((belief, index) => (
              <motion.div
                key={index}
                className="flex"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mr-6">
                  <div className="w-12 h-12 rounded-full bg-iskcon-orange/10 flex items-center justify-center text-iskcon-orange font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{belief.title}</h3>
                  <p className="text-gray-600">{belief.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-iskcon-orange/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 font-sanskrit">Join Our Spiritual Community</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Experience the transformation of consciousness and discover inner peace through the practice of Krishna consciousness. Visit our nearest center or connect with us online.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/temples" className="btn-primary">
              Find a Temple
            </Link>
            <Link href="/events" className="btn-secondary">
              Upcoming Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 