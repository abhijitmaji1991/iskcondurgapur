'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaPlay, FaPause, FaMusic, FaBookOpen, FaTimes, FaUser, FaQuoteLeft, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface Bhajan {
  id: string;
  title: string;
  author: string;
  preview: string;
  lyrics: {
    devanagari: string[];
    roman: string[];
    translation: string[];
  }[];
  audioUrl: string;
}

const BHAJANS: Bhajan[] = [
  {
    id: 'jaya-radha-madhava',
    title: 'Jaya Radha Madhava',
    author: 'Srila Bhaktivinoda Thakura',
    preview: 'jaya rādhā-mādhava kuñja-bihārī...',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // High-quality royalty-free sample stream
    lyrics: [
      {
        devanagari: [
          '(१) जय राधा-माधव कुञ्ज-बिहारी',
          'गोपी-जन-वल्लभ गिरि-वर-धारी'
        ],
        roman: [
          '(1) jaya rādhā-mādhava kuñja-bihārī',
          'gopī-jana-vallabha giri-vara-dhārī'
        ],
        translation: [
          'Krishna is the lover of Radha. He displays many amorous pastimes in the groves of Vrindavana, He is the lover of the cowherd maidens of Vraja, and the holder of the great hill named Govardhana.'
        ]
      },
      {
        devanagari: [
          '(२) यशोदा-नन्दन व्रज-जन-रञ्जन',
          'यामुना-तीर-वन-चारी'
        ],
        roman: [
          '(2) yaśodā-nandana vraja-jana-rañjana',
          'yāmunā-tīra-vana-cārī'
        ],
        translation: [
          'He is the beloved son of Mother Yasoda, the delighter of the inhabitants of Vraja, and He wanders in the forests along the banks of the River Yamuna.'
        ]
      }
    ]
  },
  {
    id: 'damodarashtakam',
    title: 'Sri Damodarashtakam',
    author: 'Satyavrata Muni',
    preview: 'namāmīśvaraṁ sac-cid-ānanda-rūpaṁ...',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    lyrics: [
      {
        devanagari: [
          '(१) नमामीश्वरं सच्चिदानन्दरूपं',
          'लसत्कुण्डलं गोकुले भ्राजमानम्',
          'यशोदाभियोलूखलाद्धावमानं',
          'परामृष्टमत्यन्ततो द्रुत्या गोप्या'
        ],
        roman: [
          '(1) namāmīśvaraṁ sac-cid-ānanda-rūpaṁ',
          'lasat-kuṇḍalaṁ gokule bhrājamānam',
          'yaśodābhiyolūkhalād dhāvamānaṁ',
          'parāmṛṣṭam atyantato drutyā gopyā'
        ],
        translation: [
          'To the supreme controller, who possesses an eternal form of absolute existence, knowledge, and bliss, whose glistening earrings swing to and fro, who manifested Himself in Gokula, who stole butter and ran in fear of Mother Yasoda, but was captured from behind by her fast chase—to that Lord Damodara, I offer my respectful obeisances.'
        ]
      },
      {
        devanagari: [
          '(२) रुदन्तं मुहुर्नेत्रयुग्मं मृजन्तं',
          'कराम्भोजयुग्मेन सातङ्कनेत्रम्',
          'मुहुः श्वासकम्पत्रिरेखाङ्ककण्ठ-',
          'स्थितग्रैवं दामोदरं भक्तिबद्धम्'
        ],
        roman: [
          '(2) rudantaṁ muhur netra-yugmaṁ mṛjantaṁ',
          'karāmbhoja-yugmena sātanka-netram',
          'muhuḥ śvāsa-kampa-trirekhāṅka-kaṇṭha-',
          'sthita-graivaṁ dāmodaraṁ bhakti-baddham'
        ],
        translation: [
          'He cries and rubs His eyes again and again with His two lotus-like hands. His eyes are filled with fear, and the necklace of pearls around His neck, marked with three lines like a conchshell, trembles due to His quick breathing while sobbing. To this Lord Damodara, who is bound not by ropes but by His mother\'s pure love, I offer my obeisances.'
        ]
      }
    ]
  },
  {
    id: 'gurvastakam',
    title: 'Sri Gurvastakam',
    author: 'Srila Visvanatha Cakravarti Thakura',
    preview: 'saṁsāra-dāvānal-līḍha-loka...',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    lyrics: [
      {
        devanagari: [
          '(१) संसारदावानललीढलोक-',
          'त्राणाय कारुण्यघनाघनत्वम्',
          'प्राप्तस्य कल्याणगुणार्णवस्य',
          'वन्दे गुरोः श्रीचरणारविन्दम्'
        ],
        roman: [
          '(1) saṁsāra-dāvānala-līḍha-loka-',
          'trāṇāya kāruṇya-ghanāghanatvam',
          'prāptasya kalyāṇa-guṇārṇavasya',
          'vande guroḥ śrī-caraṇāravindam'
        ],
        translation: [
          'The spiritual master is receiving benediction from the ocean of mercy. Just as a cloud pours rain on a forest fire to extinguish it, so the spiritual master delivers the materially afflicted world by extinguishing the blazing fire of material existence. I offer my respectful obeisances unto the lotus feet of such a spiritual master, who is an ocean of auspicious qualities.'
        ]
      },
      {
        devanagari: [
          '(२) महाप्रभोः कीर्तननृत्यगीत-',
          'वादित्रमाद्यन्मनसो रसेन',
          'रोमाञ्चकम्पाश्रुतरङ्गभाजो',
          'वन्दे गुरोः श्रीचरणारविन्दम्'
        ],
        roman: [
          '(2) mahāprabhoḥ kīrtana-nṛtya-gīta-',
          'vāditra-mādyan-manaso rasena',
          'romāñca-kampāśru-taraṅga-bhājo',
          'vande guroḥ śrī-caraṇāravindam'
        ],
        translation: [
          'Chanting the holy name, dancing in ecstasy, singing, and playing musical instruments, the spiritual master is always gladdened by the sankirtana movement of Lord Chaitanya Mahaprabhu. Because he is relishing the mellows of pure devotion, he sometimes feels hair standing on end, quivering in the body, and tears flowing from his eyes like waves. I offer my respectful obeisances unto the lotus feet of such a spiritual master.'
        ]
      }
    ]
  },
  {
    id: 'hari-haraye',
    title: 'Hari Haraye Namah Krsna',
    author: 'Srila Narottama Dasa Thakura',
    preview: 'hari haraye namaḥ kṛṣṇa yādavāya...',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    lyrics: [
      {
        devanagari: [
          '(१) हरि हरये नमः कृष्ण यादवाय नमः',
          'यादवाय माधवाय केशवाय नमः'
        ],
        roman: [
          '(1) hari haraye namaḥ kṛṣṇa yādavāya namaḥ',
          'yādavāya mādhavāya keśavāya namaḥ'
        ],
        translation: [
          'O Lord Hari, O Lord Krishna, I offer my respectful obeisances unto You. You are the descendant of Yadu, the beloved of Radha, and the killer of the Kesi demon.'
        ]
      },
      {
        devanagari: [
          '(२) गोपाल गोविन्द राम श्री-मधुसूदन',
          'गिरिधारी गोपीनाथ मदन-मोहन'
        ],
        roman: [
          '(2) gopāla govinda rāma śrī-madhusūdana',
          'giridhārī gopīnātha madana-mohana'
        ],
        translation: [
          'O protector of cows, Lord of pleasure, Lord Rama, killer of Madhu, lifter of Govardhana Hill, Lord of the Gopis, and the enchanter of Cupid!'
        ]
      }
    ]
  }
];

export default function BhajansPage() {
  const INITIAL_VOLUME = 0.8;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBhajan, setSelectedBhajan] = useState<Bhajan | null>(null);
  const [activeAuthor, setActiveAuthor] = useState('All');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [volume, setVolume] = useState(INITIAL_VOLUME);
  const [isMuted, setIsMuted] = useState(false);
  const [bhajans, setBhajans] = useState<Bhajan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Filter logic
  const authors = ['All', 'Srila Bhaktivinoda Thakura', 'Satyavrata Muni', 'Srila Visvanatha Cakravarti Thakura', 'Srila Narottama Dasa Thakura'];

  useEffect(() => {
    const fetchBhajans = async () => {
      try {
        const res = await fetch('/api/bhajans', { cache: 'no-store' });
        const result = await res.json();
        if (res.ok && result.data) {
          const mapped = result.data.map((item: any) => ({
            id: item._id,
            title: item.title,
            author: item.author,
            preview: item.preview || '',
            audioUrl: item.audioUrl || '',
            lyrics: item.lyrics || []
          }));
          setBhajans(mapped);
        } else {
          setBhajans([]);
        }
      } catch (err) {
        console.error("Error loading dynamic bhajans:", err);
        setBhajans([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBhajans();
  }, []);

  const filteredBhajans = bhajans.filter(bhajan => {
    const matchesSearch = bhajan.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          bhajan.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bhajan.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAuthor = activeAuthor === 'All' || bhajan.author === activeAuthor;
    return matchesSearch && matchesAuthor;
  });

  // Audio functions
  const playTrack = (bhajan: Bhajan) => {
    if (currentTrack === bhajan.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.src = bhajan.audioUrl;
        audioRef.current.load();
        audioRef.current.play()
          .then(() => {
            setCurrentTrack(bhajan.id);
            setIsPlaying(true);
          })
          .catch(err => console.error("Audio playback error:", err));
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (newVol === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    // Initialize audio instance
    audioRef.current = new Audio();
    audioRef.current.volume = INITIAL_VOLUME;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#faf8f5] pt-28 pb-16">
      <div className="container mx-auto px-4">
        
        {/* Decorative Header Banner */}
        <section className="relative rounded-2xl overflow-hidden glass-morphism p-8 md:p-12 mb-12 shadow-xl border border-white/50 bg-gradient-to-br from-amber-50/80 via-white/60 to-orange-50/50">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-left">
              <span className="text-orange-600 font-bold tracking-widest text-xs uppercase bg-orange-100/80 px-3 py-1 rounded-full border border-orange-200 inline-block mb-4">
                Timeless Devotion
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight font-sanskrit mb-4 leading-tight">
                Vaishnava Bhajan Kutir
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Immerse yourself in divine vibrations with our curated Vaishnava songbook. Access original Devanagari text, phonetic transliterations, beautiful translations, and audio recordings.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 italic bg-white/40 p-4 rounded-xl border border-orange-100">
                <FaQuoteLeft className="text-orange-400 text-xl flex-shrink-0" />
                <p>
                  &ldquo;Chanting the holy songs of the Vaishnava Acharyas opens the gates of Vrindavana and dissolves all material anxieties.&rdquo;
                </p>
              </div>
            </div>

            <div className="w-40 h-40 relative hidden lg:block opacity-80">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-orange-400 animate-spin-slow">
                <path d="M100 20C55.8 20 20 55.8 20 100C20 144.2 55.8 180 100 180C144.2 180 180 144.2 180 100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="10 15" />
                <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="10" fill="currentColor" />
              </svg>
              <FaMusic className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-600 text-3xl" />
            </div>
          </div>
        </section>

        {/* Live Search & Filters */}
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search Bhajans by title or lyrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-800 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex flex-wrap gap-2 overflow-x-auto py-1 max-w-full justify-start md:justify-end">
              {authors.map((author) => (
                <button
                  key={author}
                  onClick={() => setActiveAuthor(author)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    activeAuthor === author
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                      : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-orange-50/50 hover:text-orange-500'
                  }`}
                >
                  {author === 'All' ? 'All Acharyas' : author.replace('Srila ', '')}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid List of Bhajans */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredBhajans.map((bhajan) => (
            <motion.div
              key={bhajan.id}
              layout
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 hover:text-orange-500 transition cursor-pointer font-sanskrit" onClick={() => setSelectedBhajan(bhajan)}>
                      {bhajan.title}
                    </h3>
                    <p className="text-sm text-orange-600/80 font-medium flex items-center mt-1 font-sanskrit">
                      <FaUser className="mr-2 text-xs" /> {bhajan.author}
                    </p>
                  </div>
                  
                  {/* Circular Mini Play Button */}
                  <button
                    onClick={() => playTrack(bhajan)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentTrack === bhajan.id && isPlaying
                        ? 'bg-orange-500 text-white shadow-md rotate-180Scale'
                        : 'bg-orange-50 text-orange-500 hover:bg-orange-100'
                    }`}
                  >
                    {currentTrack === bhajan.id && isPlaying ? <FaPause className="text-xs" /> : <FaPlay className="text-xs ml-0.5" />}
                  </button>
                </div>

                <div className="bg-orange-50/30 p-4 rounded-xl border border-orange-100/40 my-4">
                  <p className="text-gray-500 font-sanskrit italic text-base leading-relaxed line-clamp-2">
                    {bhajan.preview}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4 border-t border-gray-50 pt-4">
                <button
                  onClick={() => setSelectedBhajan(bhajan)}
                  className="flex-1 bg-gray-50 hover:bg-orange-50/50 text-gray-700 hover:text-orange-500 border border-gray-100 hover:border-orange-100 text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <FaBookOpen /> View Lyrics
                </button>
                
                <button
                  onClick={() => {
                    setSelectedBhajan(bhajan);
                    playTrack(bhajan);
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm hover:shadow-md"
                >
                  <FaMusic /> Listen Audio
                </button>
              </div>
            </motion.div>
          ))}

          {filteredBhajans.length === 0 && (
            <div className="col-span-full bg-white rounded-xl border border-gray-100 p-12 text-center">
              <p className="text-gray-400 text-lg">No bhajan matches your search filter.</p>
            </div>
          )}
        </section>
      </div>

      {/* Floating Bottom Audio Player Widget */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-orange-100 shadow-2xl py-4 z-40 px-4"
          >
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 text-xl border border-orange-200">
                  <FaMusic className={isPlaying ? 'animate-bounce' : ''} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 font-sanskrit">
                    {bhajans.find(b => b.id === currentTrack)?.title}
                  </h4>
                  <p className="text-xs text-orange-600/80 font-medium font-sanskrit">
                    {bhajans.find(b => b.id === currentTrack)?.author}
                  </p>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => playTrack(bhajans.find(b => b.id === currentTrack)!)}
                  className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transition"
                >
                  {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                </button>
              </div>

              {/* Volume & Details Link */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-gray-500 hover:text-orange-500">
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 accent-orange-500"
                  />
                </div>
                <button
                  onClick={() => setSelectedBhajan(bhajans.find(b => b.id === currentTrack)!)}
                  className="text-sm bg-orange-50 hover:bg-orange-100 text-orange-500 font-semibold px-4 py-2 rounded-xl transition"
                >
                  View Lyrics
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lyrics & Translation Detail Modal overlay */}
      <AnimatePresence>
        {selectedBhajan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#faf8c5]/10 bg-gradient-to-b from-[#fffdfe] to-[#fbf8f3] rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-white"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-orange-100 flex justify-between items-center bg-white">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 font-sanskrit">{selectedBhajan.title}</h2>
                  <p className="text-orange-500 font-semibold text-sm mt-0.5 font-sanskrit">{selectedBhajan.author}</p>
                </div>
                <button
                  onClick={() => setSelectedBhajan(null)}
                  className="w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition border border-gray-100"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto space-y-8 flex-1 leading-relaxed">
                {selectedBhajan.lyrics.map((verse, index) => (
                  <div key={index} className="bg-white rounded-xl border border-orange-50 p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-orange-400"></div>
                    
                    {/* Devanagari */}
                    <div className="mb-4 text-center font-sanskrit text-lg text-gray-800 font-bold space-y-1">
                      {verse.devanagari.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>

                    {/* Phonetic Transliteration */}
                    <div className="mb-4 text-center font-mono text-sm text-orange-700/80 space-y-1">
                      {verse.roman.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>

                    {/* Translation */}
                    <div className="border-t border-gray-50 pt-4 text-gray-600 text-sm leading-relaxed flex gap-2">
                      <FaQuoteLeft className="text-orange-300 text-lg flex-shrink-0 mt-0.5" />
                      <p className="italic">
                        {verse.translation.map((line, i) => (
                          <span key={i}>{line}</span>
                        ))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-orange-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                <button
                  onClick={() => playTrack(selectedBhajan)}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 transition shadow-md"
                >
                  {currentTrack === selectedBhajan.id && isPlaying ? (
                    <>
                      <FaPause /> Pause Audio
                    </>
                  ) : (
                    <>
                      <FaPlay /> Listen to this Bhajan
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedBhajan(null)}
                  className="w-full sm:w-auto bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold border border-gray-100 transition"
                >
                  Close Songbook
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
