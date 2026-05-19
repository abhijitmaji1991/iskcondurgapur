'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

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
    </main>
  );
} 