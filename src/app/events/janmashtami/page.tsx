'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaArrowLeft, FaPrayingHands, FaMusic, FaUtensils, FaGift, FaTimes } from 'react-icons/fa';

export default function JanmashtamiPage() {
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactNo: '',
    whatsappNo: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can add the logic to send the form data
    const message = `Name: ${formData.name}\nContact No: ${formData.contactNo}\nWhatsApp No: ${formData.whatsappNo}\nAddress: ${formData.address}`;
    const whatsappUrl = `https://wa.me/919563786224?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowWhatsAppForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/events/janmashtami-celebration.jpg"
            alt="Janmashtami Celebration"
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
              Janmashtami Celebration
            </motion.h1>
            <motion.p
              className="text-xl text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Celebrating the Appearance Day of Lord Krishna
            </motion.p>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/events"
              className="inline-flex items-center text-iskcon-orange hover:text-iskcon-orange-dark mb-8"
            >
              <FaArrowLeft className="mr-2" /> Back to Events
            </Link>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/2">
                  <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                    <Image
                      src="/images/events/janmashtami-celebration.jpg"
                      alt="Janmashtami Celebration"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold mb-6 text-gray-800">Event Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-iskcon-orange mr-3 text-xl" />
                      <span className="text-gray-600">August 30, 2023</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="text-iskcon-orange mr-3 text-xl" />
                      <span className="text-gray-600">6:00 PM - 12:00 AM</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-iskcon-orange mr-3 text-xl" />
                      <span className="text-gray-600">ISKCON Temple Main Hall</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">About Janmashtami</h3>
                <p className="text-gray-600 mb-4">
                  Janmashtami is the celebration of Lord Krishna&apos;s appearance day, one of the most important festivals in the Vedic calendar. Join us for this special occasion filled with devotional activities, kirtan, and spiritual discourses.
                </p>
                <p className="text-gray-600 mb-4">
                  The celebration includes:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6">
                  <li>Midnight abhishek ceremony</li>
                  <li>Devotional kirtan and bhajans</li>
                  <li>Spiritual discourses</li>
                  <li>Prasadam feast</li>
                  <li>Cultural performances</li>
                </ul>

                <div className="bg-iskcon-orange/10 p-6 rounded-lg mb-6">
                  <h4 className="text-xl font-bold mb-4 text-gray-800">How to Participate</h4>
                  <p className="text-gray-600 mb-4">
                    Everyone is welcome to join this auspicious celebration. Please arrive early to secure a good seat and participate in all the festivities.
                  </p>
                  <p className="text-gray-600">
                    For more information or to register for special programs, please contact the temple office.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Schedule Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Program Schedule</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-6">
                {[
                  { time: "6:00 PM", activity: "Opening Kirtan & Welcome", icon: <FaMusic className="text-iskcon-orange" /> },
                  { time: "7:00 PM", activity: "Spiritual Discourse", icon: <FaPrayingHands className="text-iskcon-orange" /> },
                  { time: "8:30 PM", activity: "Cultural Performances", icon: <FaMusic className="text-iskcon-orange" /> },
                  { time: "10:00 PM", activity: "Midnight Abhishek Ceremony", icon: <FaPrayingHands className="text-iskcon-orange" /> },
                  { time: "11:00 PM", activity: "Prasadam Feast", icon: <FaUtensils className="text-iskcon-orange" /> },
                  { time: "12:00 AM", activity: "Closing Kirtan", icon: <FaMusic className="text-iskcon-orange" /> }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center p-4 bg-amber-50/50 rounded-lg"
                  >
                    <div className="w-24 flex-shrink-0">
                      <span className="font-bold text-gray-800">{item.time}</span>
                    </div>
                    <div className="flex-grow flex items-center">
                      <div className="mr-4 text-2xl">{item.icon}</div>
                      <span className="text-gray-600">{item.activity}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Register for Janmashtami</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="guests" className="block text-gray-700 font-medium mb-2">Number of Guests</label>
                  <input
                    type="number"
                    id="guests"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
                    placeholder="Number of people"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Special Requests</label>
                  <textarea
                    id="message"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
                    placeholder="Any special requests or questions?"
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-iskcon-orange text-white px-8 py-3 rounded-md hover:bg-iskcon-orange-dark transition-colors"
                  >
                    Register Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Share with Friends</h2>
            <p className="text-gray-600 mb-8">
              Help spread the word about this auspicious celebration
            </p>
            <div className="flex justify-center space-x-6">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                Share on Facebook
              </button>
              <button className="bg-sky-500 text-white px-6 py-3 rounded-md hover:bg-sky-600 transition-colors">
                Share on Twitter
              </button>
              <button
                onClick={() => setShowWhatsAppForm(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Form Modal */}
      {showWhatsAppForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
          >
            <button
              onClick={() => setShowWhatsAppForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>

            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Share on WhatsApp</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactNo" className="block text-gray-700 font-medium mb-2">Contact Number</label>
                <input
                  type="tel"
                  id="contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
                  placeholder="Enter your contact number"
                  required
                />
              </div>

              <div>
                <label htmlFor="whatsappNo" className="block text-gray-700 font-medium mb-2">WhatsApp Number</label>
                <input
                  type="tel"
                  id="whatsappNo"
                  name="whatsappNo"
                  value={formData.whatsappNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
                  placeholder="Enter your WhatsApp number"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange"
                  placeholder="Enter your address"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                >
                  Share on WhatsApp
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </main>
  );
} 