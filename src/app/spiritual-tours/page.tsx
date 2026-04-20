'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign, FaUsers, FaStar, FaFilter, FaSearch, FaPlane, FaBus, FaHotel, FaUtensils } from 'react-icons/fa';

// Define interfaces for tour data
interface TourDestination {
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
const tourDestinations: TourDestination[] = [
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
    dates: ['May 15-20, 2023', 'June 10-15, 2023', 'July 5-10, 2023'],
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
    dates: ['April 20-26, 2023', 'August 12-18, 2023', 'December 5-11, 2023'],
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
    dates: ['March 10-17, 2023', 'September 5-12, 2023', 'November 20-27, 2023'],
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
    dates: ['February 15-23, 2023', 'October 8-16, 2023', 'December 20-28, 2023'],
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
    dates: ['May 1-12, 2023', 'June 15-27, 2023', 'September 10-22, 2023'],
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
    dates: ['January 10-20, 2023', 'July 5-15, 2023', 'November 10-20, 2023'],
    category: 'Temple Pilgrimage',
    features: ['Temple architecture', 'Cultural programs', 'Traditional arts', 'Prasadam', 'Boat house stay']
  }
];

// Tour categories for filtering
const tourCategories = [
  'All',
  'Krishna Pastimes',
  'Temple Pilgrimage',
  'Spiritual Retreat',
  'Pilgrimage Trek'
];

export default function SpiritualToursPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);

  // Filter tours based on category, search query, and price range
  const filteredTours = tourDestinations.filter(tour => {
    const matchesCategory = activeCategory === 'All' || tour.category === activeCategory;
    const matchesSearch = tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = tour.price >= priceRange[0] && tour.price <= priceRange[1];

    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <main className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 py-4">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sacred Spiritual Tours</h1>
            <p className="text-xl mb-8">
              Embark on transformative journeys to India&apos;s holiest sites, guided by experienced devotees.
              Deepen your Krishna consciousness through immersive pilgrimage experiences.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a href="#tours" className="btn-primary">
                Explore Tours
              </a>
              <a href="#contact" className="btn-secondary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Spiritual Tours</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our tours are designed to provide both a spiritual experience and comfortable travel, guided by knowledgeable devotees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlane className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Spiritual Guidance</h3>
              <p className="text-gray-600">
                Tours led by experienced devotees who provide insights into the spiritual significance of each location
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHotel className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Comfortable Accommodations</h3>
              <p className="text-gray-600">
                Clean and comfortable stays at guesthouses or hotels near the pilgrimage sites
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUtensils className="text-amber-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sanctified Prasadam</h3>
              <p className="text-gray-600">
                All meals are prasadam, prepared according to Vedic principles and offered to Krishna
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Listings */}
      <section id="tours" className="py-16">
        <div className="container mx-auto px-4">
          {/* Filter and Search */}
          <div className="mb-10 flex flex-col lg:flex-row justify-between items-start gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Available Tours</h2>
              <p className="text-gray-600">
                Discover our curated selection of spiritual journeys across sacred India
              </p>
            </div>

            <div className="w-full lg:w-auto space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              <div className="flex flex-wrap gap-2">
                {tourCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Price Range:</span>
                  <span className="text-sm text-blue-600">₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="5000"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
              </div>
            </div>
          </div>

          {/* Tours Grid */}
          {filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map(tour => (
                <motion.div
                  key={tour.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <Image
                      src={tour.image}
                      alt={tour.name}
                      fill
                      className="object-cover"
                      onError={(e: any) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/tours/placeholder.jpg";
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-bold">
                      {tour.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{tour.name}</h3>
                      <div className="flex items-center text-amber-500">
                        <FaStar />
                        <span className="text-sm ml-1 text-gray-700">{tour.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="mr-2 text-red-500" />
                      <span>{tour.location}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {tour.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-xs flex items-center">
                        <FaCalendarAlt className="mr-1 text-blue-500" />
                        {tour.duration}
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-xs flex items-center">
                        <FaRupeeSign className="mr-1 text-green-500" />
                        {tour.price.toLocaleString()}
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-xs flex items-center">
                        <FaUsers className="mr-1 text-purple-500" />
                        {tour.groupSize} people
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">₹{tour.price.toLocaleString()}</span>
                      <Link href={`/spiritual-tours/${tour.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">
                No tours found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                  setPriceRange([0, 50000]);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Pilgrim Testimonials</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Hear from devotees who have experienced the transformative power of our spiritual tours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">RD</span>
                </div>
                <div>
                  <h3 className="font-bold">Radha Devi</h3>
                  <div className="flex text-amber-500">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                &quot;The Vrindavan tour was beyond my expectations. Our guide was knowledgeable and the spiritual atmosphere was profound. I felt connected to Krishna&apos;s pastimes in a way I never had before.&quot;
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">MG</span>
                </div>
                <div>
                  <h3 className="font-bold">Madhav Gopal</h3>
                  <div className="flex text-amber-500">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                &quot;The Mayapur retreat was life-changing. The kirtans, the Temple of Vedic Planetarium, and the association of devotees created an atmosphere of deep spiritual connection.&quot;
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">SG</span>
                </div>
                <div>
                  <h3 className="font-bold">Saraswati Ganga</h3>
                  <div className="flex text-amber-500">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                &quot;The South India temple tour was perfectly organized. We visited so many beautiful temples, and our guide explained the history and significance of each place. The prasadam was delicious!&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Answers to common questions about our spiritual tours
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            <div className="py-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">What is included in the tour package?</h3>
              <p className="text-gray-600">
                Our packages typically include accommodations, transportation during the tour, prasadam (three meals daily), entrance fees to temples and sites, and spiritual guides. International flights are not included.
              </p>
            </div>

            <div className="py-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Do I need a visa for India?</h3>
              <p className="text-gray-600">
                Yes, most nationalities require a visa to enter India. We recommend applying for an e-Tourist Visa online before your trip. We can provide guidance on the application process.
              </p>
            </div>

            <div className="py-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">What should I pack for the tour?</h3>
              <p className="text-gray-600">
                Modest clothing suitable for temple visits (covering shoulders and knees), comfortable walking shoes, personal medications, a water bottle, and any devotional items you wish to bring. A detailed packing list will be provided.
              </p>
            </div>

            <div className="py-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Are these tours suitable for children?</h3>
              <p className="text-gray-600">
                Most of our tours can accommodate children, but some itineraries may be challenging for very young children. Please contact us to discuss the suitability of a specific tour for your family.
              </p>
            </div>

            <div className="py-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Can dietary requirements be accommodated?</h3>
              <p className="text-gray-600">
                Yes, all meals are vegetarian. We can accommodate vegan, gluten-free, and other dietary requirements with advance notice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Begin Your Spiritual Journey?</h2>
              <p className="text-gray-600">
                Contact us for more information or to book your spiritual tour
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Send Us a Message</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Full Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Interested In</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a Tour</option>
                        {tourDestinations.map(tour => (
                          <option key={tour.id} value={tour.id}>{tour.name}</option>
                        ))}
                        <option value="other">Other Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                        placeholder="Questions or special requirements"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>

                <div className="bg-blue-600 p-6 md:p-8 text-white">
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Phone:</p>
                      <p>+91 1234 567 890</p>
                    </div>

                    <div>
                      <p className="font-medium">Email:</p>
                      <p>info.iskcondurgapur@gmail.com</p>
                    </div>

                    <div>
                      <p className="font-medium">Address:</p>
                      <p>ISKCON Temple, Durgapur<br />West Bengal, India</p>
                    </div>

                    <div>
                      <p className="font-medium">Office Hours:</p>
                      <p>Monday - Saturday: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="font-medium mb-2">Follow Us:</p>
                    <div className="flex space-x-4">
                      {/* Social media icons would go here */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 