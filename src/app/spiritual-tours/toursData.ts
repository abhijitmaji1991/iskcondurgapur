// Define interfaces for tour data
export interface TourDestination {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  rating: number;
  groupSize: string;
  dates: string[];
  category: string;
  features: string[];
}

// Sample data for spiritual tour destinations
export const tourDestinations: TourDestination[] = [
  {
    id: '1',
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
    features: ['Temple visits', 'Sacred sites', 'Spiritual discourses', 'Prasadam', 'Cultural programs']
  },
  {
    id: '2',
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
    features: ['Rath Yatra', 'Temple darshan', 'Prasadam', 'Beach meditation', 'Cultural exposure']
  },
  {
    id: '3',
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
    features: ['TOVP tour', 'Ganga arati', 'Spiritual classes', 'Prasadam', 'Kirtan sessions']
  },
  {
    id: '4',
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
    features: ['Temple visits', 'Boat rides', 'Spiritual discourses', 'Local cuisine', 'Beach meditation']
  },
  {
    id: '5',
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
    features: ['Temple visits', 'Meditation', 'Yoga sessions', 'Ganga arati', 'Mountain trekking']
  },
  {
    id: '6',
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
    features: ['Temple architecture', 'Cultural programs', 'Traditional arts', 'Prasadam', 'Boat house stay']
  }
];

// Tour categories for filtering
export const tourCategories = [
  'All',
  'Krishna Pastimes',
  'Temple Pilgrimage',
  'Spiritual Retreat',
  'Pilgrimage Trek'
];
