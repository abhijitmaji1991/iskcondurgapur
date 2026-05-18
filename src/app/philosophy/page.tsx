'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaBookOpen, FaHeart, FaOm, FaPrayingHands, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaVolumeDown } from 'react-icons/fa';

export default function PhilosophyPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Audio started playing');
              })
              .catch(error => {
                console.error('Error playing audio:', error);
              });
          }
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error handling play/pause:', error);
      }
    }
  };

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.target as HTMLAudioElement;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Initialize audio element
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-iskcon-orange/20 to-iskcon-blue/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Krishna Consciousness Philosophy</h1>
            <p className="text-xl text-gray-600 mb-8">
              Timeless Vedic wisdom for the modern age
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">The Science of Self-Realization</h2>
            <p className="text-lg text-gray-600 mb-8">
              The philosophy of Krishna consciousness, as presented by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada,
              is a profound spiritual science drawn from the ancient Vedic texts of India, particularly the Bhagavad-gita
              and Srimad-Bhagavatam. This timeless wisdom addresses fundamental questions about life, consciousness,
              and reality, offering practical methods for spiritual advancement in today&apos;s world.
            </p>

            <div className="bg-gradient-to-r from-iskcon-blue/10 to-iskcon-orange/10 p-6 rounded-lg my-8">
              <div className="flex">
                <FaQuoteLeft className="text-4xl text-iskcon-orange opacity-40 mr-4 flex-shrink-0" />
                <blockquote className="text-xl italic text-gray-700">
                  &quot;Krishna consciousness is not a fabrication of the mind or an artificial imposition on the mind.
                  This consciousness is the original energy of the living entity.&quot;
                  <footer className="text-right text-gray-600 text-base mt-2">— Srila Prabhupada</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bhagavad Gita Audio Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={handlePlayPause}
                className="bg-iskcon-orange text-white px-8 py-4 rounded-lg shadow-lg hover:bg-iskcon-orange-dark transition-colors flex items-center space-x-3 relative"
              >
                <span className="text-2xl">{isPlaying ? <FaPause /> : <FaPlay />}</span>
                <span className="text-xl font-bold">Introduction to Bhagavad Gita</span>
                {isPlaying && (
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
                    Playing...
                  </span>
                )}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Bhagavad Gita Introduction</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleMute}
                      className="text-gray-600 hover:text-iskcon-orange transition-colors"
                    >
                      {isMuted ? <FaVolumeMute className="text-xl" /> :
                        volume > 0.5 ? <FaVolumeUp className="text-xl" /> :
                          volume > 0 ? <FaVolumeDown className="text-xl" /> :
                            <FaVolumeMute className="text-xl" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-iskcon-orange transition-all duration-300"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
              </div>

              <audio
                ref={audioRef}
                id="gita-audio"
                src="/audio/bg.mp3"
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => console.error('Audio error:', e)}
              />
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                &quot;The Bhagavad Gita is the essence of all Vedic knowledge and one of the most important Upanishads in Vedic literature.&quot;
              </p>
              <p className="text-gray-500">— Srila Prabhupada</p>
            </div>

            {/* Transcript Section */}
            <div className="mt-8">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full bg-iskcon-orange/10 text-iskcon-orange p-4 rounded-lg hover:bg-iskcon-orange/20 transition-colors flex items-center justify-between"
              >
                <span className="font-medium">View Transcript</span>
                <span className="transform transition-transform duration-300">
                  {showTranscript ? '▼' : '▶'}
                </span>
              </button>

              {showTranscript && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 bg-white rounded-lg shadow-lg p-6"
                >
                  <h4 className="text-xl font-bold mb-4 text-gray-800">Transcript</h4>
                  <div className="prose max-w-none text-gray-600">
                    <p className="mb-4">
                      The Bhagavad Gita is the essence of all Vedic knowledge and one of the most important Upanishads in Vedic literature. It is a conversation between Lord Krishna and His devotee Arjuna, taking place on the battlefield of Kurukshetra just prior to the start of a great war.
                    </p>
                    <p className="mb-4">
                      In this sacred dialogue, Lord Krishna imparts the highest spiritual knowledge to Arjuna, who represents the common man. The Gita contains the essence of all Vedic wisdom and provides practical guidance for living a meaningful and purposeful life.
                    </p>
                    <p className="mb-4">
                      The teachings of the Bhagavad Gita are universal and eternal, relevant to all people in all times. They address fundamental questions about life, death, the soul, and our relationship with the Supreme.
                    </p>
                    <p>
                      Through the Bhagavad Gita, Lord Krishna reveals the science of self-realization and the process of bhakti-yoga, or devotional service, as the most direct means to spiritual perfection in this age.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Key Principles Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Key Philosophical Principles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "The Soul",
                description: "We are not these material bodies, but eternal spiritual souls (atma), part and parcel of the Supreme Soul, Krishna.",
                icon: <FaHeart className="text-4xl text-iskcon-orange mb-4" />
              },
              {
                title: "Karma",
                description: "The law of action and reaction governs the material world. Every action we perform brings corresponding reactions.",
                icon: <FaOm className="text-4xl text-iskcon-orange mb-4" />
              },
              {
                title: "Reincarnation",
                description: "The soul transmigrates from one body to another after death, according to one's desires and karma.",
                icon: <FaPrayingHands className="text-4xl text-iskcon-orange mb-4" />
              },
              {
                title: "Bhakti Yoga",
                description: "The path of loving devotional service to Krishna is the most direct means to spiritual perfection in this age.",
                icon: <FaHeart className="text-4xl text-iskcon-orange mb-4" />
              },
              {
                title: "The Supreme Person",
                description: "Krishna is the Supreme Personality of Godhead, the cause of all causes and the source of all existence.",
                icon: <FaPrayingHands className="text-4xl text-iskcon-orange mb-4" />
              },
              {
                title: "Sacred Texts",
                description: "Bhagavad-gita and Srimad-Bhagavatam provide essential knowledge about self-realization and God consciousness.",
                icon: <FaBookOpen className="text-4xl text-iskcon-orange mb-4" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
              >
                {item.icon}
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Explore the Vedic Literature</h2>
            <p className="text-lg text-gray-600">
              Delve deeper into the philosophy of Krishna consciousness through Srila Prabhupada&apos;s authoritative translations and commentaries.
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/resources/books" className="btn-primary text-lg flex items-center">
              <FaBookOpen className="mr-2" /> Browse Srila Prabhupada&apos;s Books
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-r from-iskcon-blue/10 to-iskcon-orange/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Frequently Asked Questions</h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "What is the goal of human life according to Krishna consciousness?",
                answer: "The ultimate goal of human life is to revive our dormant love of God, Krishna, and return to the spiritual world. This is achieved through bhakti-yoga, or devotional service to Krishna."
              },
              {
                question: "What are the four regulative principles in Krishna consciousness?",
                answer: "Practitioners of Krishna consciousness follow four regulative principles: no meat-eating, no illicit sex, no intoxication, and no gambling. These principles help purify consciousness and advance spiritually."
              },
              {
                question: "Why is chanting the Hare Krishna mantra recommended?",
                answer: "The Hare Krishna maha-mantra (Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare / Hare Rama, Hare Rama, Rama Rama, Hare Hare) is a spiritual sound vibration that cleanses the heart of material desires and awakens love for Krishna."
              },
              {
                question: "How is Krishna consciousness different from other religions?",
                answer: "Krishna consciousness is not a sectarian religion but the eternal function of the soul (sanatana-dharma). It is scientific and philosophical in its approach, compatible with the essential teachings of all genuine religious paths."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-iskcon-saffron/10 rounded-xl p-8 shadow-md flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Experience Krishna Consciousness</h2>
              <p className="text-gray-600 mb-6">
                Join us for classes, festivals, and programs to experience the philosophy and culture of Krishna consciousness firsthand.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/events" className="btn-primary">
                  Upcoming Events
                </Link>
                <Link href="/temples" className="btn-secondary">
                  Find a Temple
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <FaPrayingHands className="text-8xl text-iskcon-orange opacity-20" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 