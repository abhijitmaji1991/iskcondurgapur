import fs from 'fs';
import path from 'path';

// Seed data merging basic tour metadata and detailed itineraries
export const DEFAULT_SEED_TOURS = [
  {
    _id: '1',
    name: 'Vrindavan & Mathura Pilgrimage',
    location: 'Uttar Pradesh, India',
    description: 'Explore the divine birthplace of Lord Krishna and the sacred forests where He performed His pastimes. Visit temples like Banke Bihari, ISKCON Vrindavan, Krishna Balaram Mandir, and boat on the Yamuna River.',
    image: '/images/tours/vrindavan.jpg',
    duration: '5 days',
    price: 15000,
    rating: 4.9,
    groupSize: '10-20',
    dates: ['June 15-20, 2026', 'September 10-15, 2026', 'November 5-10, 2026'],
    category: 'Krishna Pastimes',
    features: ['Temple visits', 'Sacred sites', 'Spiritual discourses', 'Prasadam', 'Cultural programs'],
    highlights: [
      'Aarti ceremony on the banks of Yamuna River',
      'Guided parikrama (circumambulation) of Govardhan Hill',
      'Visit to the famous Krishna Balaram Temple (ISKCON)',
      'Exploration of quiet and sacred forests of Vrindavan'
    ],
    inclusions: [
      '3-Star accommodation on double sharing basis',
      'All pure vegetarian Meals (breakfast, lunch, dinner) offered to the Lord',
      'AC transport for sightseeing in Mathura & Vrindavan',
      'Local spiritual guide fees',
      'Yamuna boat ride charges'
    ],
    exclusions: [
      'To and from travel to Mathura/Vrindavan station/airport',
      'Personal expenses, laundry, telephone calls',
      'Camera / Video camera fees at monuments',
      'Extra food items or snacks not in main menu'
    ],
    gallery: [
      '/images/tours/vrindavan.jpg',
      '/images/iskcon-temple-dome.jpg',
      '/images/krishna-temple.jpg'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Yamuna Aarti',
        description: 'Arrive at Mathura and check-in to your Vrindavan hotel. In the evening, witness a magnificent and soul-stirring Aarti at the Kesi Ghat on the banks of the sacred Yamuna River.',
        activities: ['Welcome Drink & Check-in', 'Evening Yamuna Aarti', 'Introduction session with spiritual guide', 'Dinner Prasadam']
      },
      {
        day: 2,
        title: 'Vrindavan Main Temples Darshan',
        description: 'Explore the heart of Vrindavan. Visit the historic Banke Bihari Mandir, Radha Raman Temple, and the majestic Krishna Balaram Mandir (ISKCON Vrindavan).',
        activities: ['Manga Aarti (optional)', 'Radha Raman Darshan', 'Banke Bihari Darshan', 'Spiritual discourse at ISKCON Vrindavan']
      },
      {
        day: 3,
        title: 'Govardhan Parikrama',
        description: 'Embark on a sacred parikrama of the Govardhan Hill by AC vehicle (or by foot for those who wish). Visit the serene Radha Kund and Syama Kund, and the historic Kusum Sarovar.',
        activities: ['Govardhan Parikrama', 'Holy dip at Radha Kund', 'Visit Kusum Sarovar', 'Evening Bhajan session']
      },
      {
        day: 4,
        title: 'Barsana & Nandgaon Excursion',
        description: 'Travel to Barsana, the birthplace of Srimati Radharani, to visit the beautiful Ladliji Temple. Proceed to Nandgaon, the home of Nanda Maharaja and Krishna during childhood.',
        activities: ['Barsana Hill Climb (ropeway available)', 'Ladliji Temple Darshan', 'Nandgaon Temple visit', 'Radha Krishna pastimes lecture']
      },
      {
        day: 5,
        title: 'Gokul Visit & Departure',
        description: 'Visit Gokul, where Lord Krishna spent his infancy in secret. Visit Brahmand Ghat (where Krishna ate clay) and Raman Reti, before proceeding for your return journey.',
        activities: ['Brahmand Ghat visit', 'Raman Reti holy sand experience', 'Shopping for deities & scriptures', 'Departure from Mathura Station']
      }
    ]
  },
  {
    _id: '2',
    name: 'Jagannath Puri Yatra',
    location: 'Odisha, India',
    description: 'Experience the ancient city of Lord Jagannath with visits to the magnificent Jagannath Temple, the pristine Puri Beach, and participate in the traditional Rath Yatra if timed accordingly.',
    image: '/images/tours/puri.jpg',
    duration: '6 days',
    price: 18000,
    rating: 4.8,
    groupSize: '15-25',
    dates: ['July 18-24, 2026', 'October 12-18, 2026', 'December 15-21, 2026'],
    category: 'Temple Pilgrimage',
    features: ['Rath Yatra', 'Temple darshan', 'Prasadam', 'Beach meditation', 'Cultural exposure'],
    highlights: [
      'VIP Darshan at the world-famous Jagannath Temple in Puri',
      'Meditative sessions at the serene Puri Beach',
      'Exclusive tour of Tota Gopinath, where Mahaprabhu disappeared',
      'Excursion to Konark Sun Temple, a UNESCO World Heritage site'
    ],
    inclusions: [
      'Premium rooms near the sea beach',
      'Freshly prepared Jagannath Mahaprasadam daily',
      'AC Coach for local travels and Konark excursion',
      'Temple entry permissions and guide support',
      'Special sand art session'
    ],
    exclusions: [
      'Flight or train tickets to Bhubaneswar/Puri',
      'Tips to priests and drivers',
      'Personal puja or offerings costs',
      'Any personal boating charges'
    ],
    gallery: [
      '/images/tours/puri.jpg',
      '/images/iskcon-temple-dome.jpg',
      '/images/events-and-festival.jpg'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Jagannath Puri',
        description: 'Arrive at Puri/Bhubaneswar airport or station. Transfer to your seaside hotel. Spend the evening resting and walking on the Puri golden beach.',
        activities: ['Transfer to Hotel', 'Seaside meditation', 'Evening welcome orientation', 'Mahaprasadam dinner']
      },
      {
        day: 2,
        title: 'Lord Jagannath Darshan',
        description: 'Proceed for early morning darshan of Lord Jagannath, Baladeva, and Subhadra Devi. Explore the massive temple complex containing 50+ smaller shrines.',
        activities: ['Jagannath Temple Darshan', 'Viewing of temple kitchen', 'Lunch at Ananda Bazar', 'Evening lecture on Jagannath pastimes']
      },
      {
        day: 3,
        title: 'Gundicha & Tota Gopinath visit',
        description: 'Visit Gundicha Temple, the garden house of Lord Jagannath. Followed by visits to Tota Gopinath Mandir, Siddha Bakula, and the house of Sarvabhauma Bhattacharya.',
        activities: ['Gundicha Temple darshan', 'Tota Gopinath self-manifested deity', 'Siddha Bakula parikrama', 'Haridas Thakura Samadhi visit']
      },
      {
        day: 4,
        title: 'Konark Sun Temple & Chandrabhaga',
        description: 'Take a morning excursion to Konark to witness the outstanding 13th-century Sun Temple. On the way back, spend time at the serene Chandrabhaga beach.',
        activities: ['Konark Sun Temple guided tour', 'Chandrabhaga Beach sunset', 'Evening cultural Odissi dance program']
      },
      {
        day: 5,
        title: 'Chilika Lake & Alarnath Mandir',
        description: 'Drive to Alarnath Temple at Brahmagiri, where Lord Jagannath is worshipped during the Anavasara period. Take a boat ride at Chilika Lake, home to dolphins.',
        activities: ['Alarnath Mandir Darshan', 'Chilika Lake boat cruise', 'Dolphin spotting', 'Kirtan at Alarnath']
      },
      {
        day: 6,
        title: 'Beach Meditation & Farewell',
        description: 'Begin the day with a seaside chanting session. Spend the afternoon packing and buying famous Puri Khaja sweets before departure.',
        activities: ['Sunrise beach chanting', 'Souvenir shopping', 'Transfer to Bhubaneswar airport/Puri station']
      }
    ]
  },
  {
    _id: '3',
    name: 'Mayapur Spiritual Retreat',
    location: 'West Bengal, India',
    description: 'Visit the world headquarters of ISKCON at Mayapur, the birthplace of Lord Chaitanya Mahaprabhu. Experience the massive Temple of Vedic Planetarium and daily kirtans and aarti ceremonies.',
    image: '/images/tours/mayapur.jpg',
    duration: '7 days',
    price: 20000,
    rating: 4.9,
    groupSize: '20-30',
    dates: ['November 10-17, 2026', 'January 15-22, 2027', 'March 5-12, 2027'],
    category: 'Spiritual Retreat',
    features: ['TOVP tour', 'Ganga arati', 'Spiritual classes', 'Prasadam', 'Kirtan sessions'],
    highlights: [
      'Detailed tour of the massive Temple of Vedic Planetarium (TOVP)',
      'Boat parikrama on the holy Ganges river',
      'Visit to Yoga Peeth, the actual birthplace of Sri Chaitanya Mahaprabhu',
      'Mesmerizing daily Kirtan and Ganga Aarti'
    ],
    inclusions: [
      'Accommodation in ISKCON Mayapur Guesthouse',
      'Sumptuous, sanctified prasadam meals daily',
      'Ganges boat ride and local site entry fees',
      'Spiritual workshops and seminars',
      'Assistance by Mayapur devotees'
    ],
    exclusions: [
      'Travel to and from Kolkata/Howrah/Mayapur',
      'Laundry and personal room service fees',
      'Donations to temples or ashrams',
      'Ropeway or electric vehicle fees'
    ],
    gallery: [
      '/images/tours/mayapur.jpg',
      '/images/srila-prabhupada.jpg',
      '/images/history-of-iskcon.jpg'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Welcome to Sri Mayapur Dham',
        description: 'Arrive at the holy land of Navadvipa, check-in to the ISKCON guesthouse. Attend the evening Gaura Aarti at the main temple.',
        activities: ['Check-in & Rest', 'Evening Gaura Aarti', 'Mayapur campus tour', 'Dinner Prasadam']
      },
      {
        day: 2,
        title: 'TOVP Tour & Srila Prabhupada Samadhi',
        description: 'Take a guided tour of the majestic Temple of Vedic Planetarium (TOVP) under construction. Visit Srila Prabhupada Pushpa Samadhi Mandir.',
        activities: ['TOVP Exhibition', 'Srila Prabhupada Samadhi Darshan', 'TOVP Dome view', 'Seminar on Navadvipa Dham glory']
      },
      {
        day: 3,
        title: 'Yoga Peeth & Srivas Angan',
        description: 'Visit Yoga Peeth, the birthplace of Lord Chaitanya, and see the ancient Neem tree. Visit Srivas Angan, the birthplace of congregational chanting (Sankirtan).',
        activities: ['Yoga Peeth Darshan', 'Srivas Angan visit', 'Advaita Acharya house visit', 'Interactive chanting workshop']
      },
      {
        day: 4,
        title: 'Ganga Boat Parikrama',
        description: 'Embark on a sacred boat journey down the Ganges River, visiting different islands (dvipas) of Navadvipa, including Godrumadvipa.',
        activities: ['Ganges Boat ride', 'Hari-katha on boat', 'Island excursions', 'Sunset Ganga Aarti from boat']
      },
      {
        day: 5,
        title: 'Jagannath Mandir (Rajapur)',
        description: 'Visit the ancient temple of Lord Jagannath in Rajapur, which is non-different from Puri Dham. Hear the pastimes of the deities.',
        activities: ['Jagannath Rajapur Darshan', 'Mahaprasadam Lunch', 'Dhama Seva activities', 'Mayapur local handicraft shopping']
      },
      {
        day: 6,
        title: 'Bhajan Kutir & Devotee Association',
        description: 'Spend a quiet day chanting at Srila Prabhupada\'s original Bhajan Kutir. Meet senior devotees and participate in a question and answer session.',
        activities: ['Bhajan Kutir meditation', 'Devotee Sangha meeting', 'Q&A session', 'Maha-kirtan evening celebration']
      },
      {
        day: 7,
        title: 'Holy Bath & Departure',
        description: 'Take a morning bath in the Ganges (optional). Check out from your guesthouse and proceed for your return journey to Kolkata.',
        activities: ['Ganga Snana', 'Morning temple activities', 'Check-out & Farwell blessing', 'Transfer to Kolkata']
      }
    ]
  },
  {
    _id: '4',
    name: 'Sacred Dwarka & Somnath Journey',
    location: 'Gujarat, India',
    description: 'Visit Dwarka, the kingdom of Lord Krishna, and the revered Somnath Temple. Experience the spiritual ambiance of these ancient sites and learn about their historical significance.',
    image: '/images/tours/dwarka.jpg',
    duration: '8 days',
    price: 25000,
    rating: 4.7,
    groupSize: '15-25',
    dates: ['October 8-16, 2026', 'December 20-28, 2026', 'February 15-23, 2027'],
    category: 'Krishna Pastimes',
    features: ['Temple visits', 'Boat rides', 'Spiritual discourses', 'Local cuisine', 'Beach meditation'],
    highlights: [
      'Visit the ancient Dwarkadhish Temple (Kingdom of Krishna)',
      'Boat cruise to Bet Dwarka island temple',
      'Visit Nageshwar Jyotirlinga, one of the 12 sacred Jyotirlingas',
      'Behold the magnificent sea-shore Somnath Temple'
    ],
    inclusions: [
      'Comfortable deluxe accommodation on twin sharing',
      'All vegetarian Meals prepared without onion and garlic',
      'AC vehicle for airport pickup, drop, and complete sightseeing',
      'Bet Dwarka ferry boat charges',
      'Experienced Tour Coordinator'
    ],
    exclusions: [
      'Air/Train fare to Rajkot/Jamnagar/Dwarka',
      'Pooja expenses or Dakshina to priests',
      'Any rides, sports, or personal boating',
      'Medical insurance'
    ],
    gallery: [
      '/images/tours/dwarka.jpg',
      '/images/iskcon-temple-dome.jpg',
      '/images/krishna-temple.jpg'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Dwarka',
        description: 'Arrive at Rajkot/Jamnagar and drive to Dwarka. Check-in at your hotel. In the evening, attend the Shringar Aarti at Dwarkadhish Temple.',
        activities: ['Travel to Dwarka', 'Hotel check-in', 'Evening Dwarkadhish Temple visit', 'Welcome dinner']
      },
      {
        day: 2,
        title: 'Bet Dwarka & Nageshwar Temple',
        description: 'Travel to Okha port and take a ferry boat to Bet Dwarka. Visit the ancient residence of Lord Krishna. On return, visit Nageshwar Jyotirlinga and Gopi Talav.',
        activities: ['Ferry boat ride to Bet Dwarka', 'Bet Dwarka Temple visit', 'Nageshwar Jyotirlinga darshan', 'Gopi Talav holy clay collection']
      },
      {
        day: 3,
        title: 'Rukmini Temple & Sudama Setu',
        description: 'Visit the Rukmini Devi Mandir, dedicated to Krishna\'s chief queen. Walk across the Sudama Setu hanging bridge over the Gomti River.',
        activities: ['Rukmini Mandir Darshan', 'Gomti River bath (optional)', 'Sudama Setu walk', 'Sunset at Dwarka Beach']
      },
      {
        day: 4,
        title: 'Somnath Shore Temple Excursion',
        description: 'Take a day trip to Somnath, visiting the historic shore temple, Triveni Sangam (confluence of three rivers), and the Bhalka Tirth (where Krishna left Earth).',
        activities: ['Somnath Temple Darshan', 'Triveni Sangam visit', 'Bhalka Tirth visit', 'Somnath Light and Sound Show']
      },
      {
        day: 5,
        title: 'Departure Journey',
        description: 'Participate in the morning prayers at Dwarkadhish. Proceed with shopping for local brass items and bandhani textiles before checking out.',
        activities: ['Morning Darshan', 'Local shopping', 'Check-out', 'Transfer to Rajkot/Jamnagar for departure']
      }
    ]
  },
  {
    _id: '5',
    name: 'Himalayan Spiritual Trek',
    location: 'Uttarakhand, India',
    description: 'Embark on a spiritual journey through the Himalayas, visiting sacred sites like Badrinath, Kedarnath, and Rishikesh. Experience meditation by the Ganges and visit ancient temples.',
    image: '/images/tours/himalaya.jpg',
    duration: '12 days',
    price: 35000,
    rating: 4.6,
    groupSize: '10-15',
    dates: ['June 1-12, 2026', 'September 10-22, 2026', 'May 10-22, 2027'],
    category: 'Pilgrimage Trek',
    features: ['Temple visits', 'Meditation', 'Yoga sessions', 'Ganga arati', 'Mountain trekking'],
    highlights: [
      'Ganga Aarti at Triveni Ghat in Rishikesh',
      'Holy Darshan of Lord Badrinath in the high Himalayas',
      'Visit Mana Village - the last village of India bordering Tibet',
      'Peaceful meditation and yoga sessions in mountain air'
    ],
    inclusions: [
      'Hotels and premium homestays in Rishikesh, Joshimath, and Badrinath',
      'Nutritious sattvic vegetarian food (suitable for high altitudes)',
      'AC SUV (Innova/similar) for mountain transport',
      'Trek guides and helper services',
      'Oxygen cylinder and first-aid kits on board'
    ],
    exclusions: [
      'Travel to Rishikesh/Dehradun airport',
      'Helicopter services (if chosen)',
      'Pony/Palki charges for trekking',
      'Hot water bath token costs'
    ],
    gallery: [
      '/images/tours/himalaya.jpg',
      '/images/iskcon-temple-dome.jpg',
      '/images/history-of-iskcon.jpg'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Rishikesh',
        description: 'Arrive at Dehradun airport or Haridwar station. Transfer to Rishikesh. Attend the iconic Ganga Aarti at Triveni Ghat.',
        activities: ['Airport pickup', 'Rishikesh check-in', 'Triveni Ghat Ganga Aarti', 'Satsang and orientation']
      },
      {
        day: 2,
        title: 'Scenic Drive to Joshimath',
        description: 'Embark on a beautiful mountain drive from Rishikesh to Joshimath, passing Devprayag (confluence of Alaknanda and Bhagirathi).',
        activities: ['Mountain drive', 'Devprayag photography stop', 'Check-in Joshimath', 'Evening meditation']
      },
      {
        day: 3,
        title: 'Badrinath Dham Darshan',
        description: 'Drive up to Badrinath Dham. Take a dip in the natural hot springs (Tapt Kund) and proceed for the magnificent Darshan of Lord Badrinarayan.',
        activities: ['Tapt Kund bath', 'Badrinath Temple Darshan', 'Evening Vishnu Sahasranama chanting', 'Overnight stay in Badrinath']
      },
      {
        day: 4,
        title: 'Mana Village & Vyas Gufa',
        description: 'Visit the historic Mana Village. Visit Vyas Gufa, where Sage Vyasa wrote Mahabharata, and see the origin of the Saraswati River.',
        activities: ['Mana Village walk', 'Vyas Gufa & Ganesha Gufa visit', 'Bhima Pul natural bridge', 'High-altitude meditation session']
      },
      {
        day: 5,
        title: 'Joshimath Narasimha Temple',
        description: 'Drive down to Joshimath. Visit the ancient Narasimha Temple, where Lord Narasimha is worshipped during winters when Badrinath is closed.',
        activities: ['Joshimath Narasimha darshan', 'Auli cable car ride (optional)', 'Campfire spiritual sharing session']
      },
      {
        day: 6,
        title: 'Return to Rishikesh',
        description: 'Drive back down to Rishikesh. Spend the evening relaxing, visiting Laxman Jhula and Ram Jhula, and packing.',
        activities: ['Scenic downward drive', 'Laxman Jhula exploration', 'Ganga meditation', 'Farewell Dinner']
      },
      {
        day: 7,
        title: 'Morning Yoga & Departure',
        description: 'Participate in a refreshing morning yoga and breathing class by the Ganges. Proceed to Dehradun/Haridwar for departure.',
        activities: ['Sunrise Yoga & Pranayama', 'Breakfast Prasadam', 'Check-out & drop at station/airport']
      }
    ]
  },
  {
    _id: '6',
    name: 'South India Temple Tour',
    location: 'Tamil Nadu & Kerala, India',
    description: 'Explore the magnificent temples of South India, including Srirangam, Madurai Meenakshi, and Krishna temples in Kerala. Learn about Dravidian architecture and culture.',
    image: '/images/tours/south-india.jpg',
    duration: '10 days',
    price: 30000,
    rating: 4.8,
    groupSize: '15-20',
    dates: ['November 10-20, 2026', 'January 10-20, 2027', 'July 5-15, 2027'],
    category: 'Temple Pilgrimage',
    features: ['Temple architecture', 'Cultural programs', 'Traditional arts', 'Prasadam', 'Boat house stay'],
    highlights: [
      'Visit Sri Ranganathaswamy Temple (Srirangam), the largest active temple',
      'Marvel at the ancient architecture of Madurai Meenakshi Temple',
      'Special Darshan at the beach-side Rameshwaram temple and Ramanathaswamy wells',
      'Sacred darshan of Lord Padmanabhaswamy in Trivandrum'
    ],
    inclusions: [
      '4-star hotel stays throughout Tamil Nadu and Kerala',
      'All vegetarian South Indian meals and prasadam',
      'Private AC vehicle for all transfers',
      'Srirangam and Madurai temple guides',
      'Kanyakumari ferry boat tickets'
    ],
    exclusions: [
      'Flights to Chennai / from Trivandrum',
      'Special puja tokens',
      'Camera and entry fees where applicable',
      'Room service or mini-bar usage'
    ],
    gallery: [
      '/images/tours/south-india.jpg',
      '/images/iskcon-temple-dome.jpg',
      '/images/events-and-festival.jpg'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Chennai & Kanchipuram',
        description: 'Arrive in Chennai. Drive straight to the temple city of Kanchipuram, famous for its magnificent temples and silk sarees.',
        activities: ['Chennai airport pickup', 'Kanchipuram Shiva & Vishnu temples', 'Transfer to hotel', 'Traditional South Indian dinner']
      },
      {
        day: 2,
        title: 'Srirangam Ranganathaswamy Temple',
        description: 'Drive to Trichy and visit Srirangam Temple, the prime center of worship for Vaishnavas. Marvel at its 21 towering Gopurams.',
        activities: ['Drive to Trichy', 'Srirangam temple VIP darshan', 'Exquisite architectural walk', 'Evening lecture on Ramanujacharya']
      },
      {
        day: 3,
        title: 'Madurai Meenakshi & Palace',
        description: 'Travel to Madurai, the cultural capital. Visit the massive Meenakshi Amman Temple, famous for its intricate sculpted pillars.',
        activities: ['Travel to Madurai', 'Meenakshi Temple detailed tour', 'Thirumalai Nayakkar Palace light show', 'Local temple cuisine tasting']
      },
      {
        day: 4,
        title: 'Rameshwaram Holy Pilgrimage',
        description: 'Drive over the Pamban Sea Bridge to Rameshwaram Island. Bathe in the 22 holy water wells inside the temple, followed by darshan.',
        activities: ['Pamban Bridge crossing', '22 Wells bathing ritual', 'Rameshwaram Temple darshan', 'Sunset at Dhanushkodi beach']
      },
      {
        day: 5,
        title: 'Kanyakumari Confluence',
        description: 'Drive to Kanyakumari, the southernmost tip of India. Take a ferry to Swami Vivekananda Rock Memorial and see the Sunset over three seas.',
        activities: ['Vivekananda Rock ferry ride', 'Triveni Sangam view (ocean confluence)', 'Sunset viewing at beach', 'Bhajan session at hotel']
      },
      {
        day: 6,
        title: 'Padmanabhaswamy Temple & Departure',
        description: 'Drive to Trivandrum and visit the magnificent Padmanabhaswamy Temple (known for its spiritual wealth and strict dress code). Proceed to departure.',
        activities: ['Padmanabhaswamy temple darshan (traditional dress code mandatory)', 'Kerala style lunch', 'Check-out & Transfer to Trivandrum airport']
      }
    ]
  }
];

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'tours_fallback.json');

// Helper to ensure directory exists and file is initialized
function ensureInitialized(): any[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SEED_TOURS, null, 2), 'utf-8');
    return DEFAULT_SEED_TOURS;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading tours fallback JSON database, resetting:', err);
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SEED_TOURS, null, 2), 'utf-8');
    return DEFAULT_SEED_TOURS;
  }
}

export const toursFallbackDb = {
  getAll(): any[] {
    return ensureInitialized();
  },

  getById(id: string): any | null {
    const list = ensureInitialized();
    return list.find(t => t._id === id) || null;
  },

  create(data: any): any {
    const list = ensureInitialized();
    const newTour = {
      ...data,
      _id: data._id || `tour_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(newTour);
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return newTour;
  },

  update(id: string, data: any): any | null {
    const list = ensureInitialized();
    const index = list.findIndex(t => t._id === id);
    if (index === -1) return null;

    const updated = {
      ...list[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return updated;
  },

  delete(id: string): boolean {
    const list = ensureInitialized();
    const filtered = list.filter(t => t._id !== id);
    if (list.length === filtered.length) return false;
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
};
