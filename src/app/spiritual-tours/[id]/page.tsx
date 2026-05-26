'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign, FaUsers, FaStar, 
  FaArrowLeft, FaCheck, FaTimes, FaPhone, FaEnvelope, FaChevronRight,
  FaBook, FaUtensils, FaHotel, FaCar, FaInfoCircle
} from 'react-icons/fa';
interface TourDestination {
  _id?: string;
  id?: string;
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

// Day itinerary interface
interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

// In-depth details for each tour
interface TourDetails {
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  gallery: string[];
}

export default function TourDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params?.id as string;

  const [tour, setTour] = useState<TourDestination | null>(null);
  const [details, setDetails] = useState<TourDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'highlights' | 'inclusions' | 'gallery'>('itinerary');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    seats: '1',
    date: '',
    notes: ''
  });

  useEffect(() => {
    const fetchTourDetail = async () => {
      if (!tourId) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/tours/${tourId}`);
        const result = await response.json();
        if (response.ok && result.data) {
          const foundTour = result.data;
          setTour(foundTour);
          setDetails(foundTour);
          if (foundTour.dates && foundTour.dates.length > 0) {
            setFormData(prev => ({ ...prev, date: foundTour.dates[0] }));
          }
        } else {
          setError(result.message || 'Tour not found');
        }
      } catch (err) {
        console.error('Error loading tour details:', err);
        setError('Network error loading tour details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourDetail();
  }, [tourId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <FaInfoCircle className="text-6xl text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Tour Not Found</h1>
          <p className="text-gray-600 mb-6 font-medium">The spiritual tour you are looking for does not exist or has been relocated.</p>
          <Link href="/spiritual-tours" className="btn-primary inline-block">
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch('/api/tours/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tourId: tour._id || tour.id,
          tourName: tour.name,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          seats: Number(formData.seats),
          date: formData.date,
          notes: formData.notes,
          totalCost: tour.price * Number(formData.seats)
        })
      });
      const result = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setSubmitError(result.message || 'Failed to submit registration');
      }
    } catch (err) {
      console.error('Error submitting booking inquiry:', err);
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-16 pt-24">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.name}
          fill
          className="object-cover object-center"
          priority
          onError={(e: any) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/tours/placeholder.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute top-6 left-6 z-10">
          <Link href="/spiritual-tours" className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-orange-600 rounded-xl shadow-lg font-semibold transition-all active:scale-95 text-sm backdrop-blur-sm">
            <FaArrowLeft /> Back to Tours
          </Link>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="container mx-auto max-w-6xl">
            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-3 inline-block">
              {tour.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-4 drop-shadow">{tour.name}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm md:text-base text-white/90">
              <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-orange-400" /> {tour.location}</span>
              <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-orange-400" /> {tour.duration}</span>
              <span className="flex items-center gap-1.5"><FaUsers className="text-orange-400" /> Group Size: {tour.groupSize}</span>
              <span className="flex items-center gap-1.5"><FaStar className="text-yellow-400" /> {tour.rating} / 5.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="container mx-auto max-w-6xl px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Details Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour Overview</h2>
              <p className="text-gray-600 leading-relaxed text-base">{tour.description}</p>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b overflow-x-auto">
                {(['itinerary', 'highlights', 'inclusions', 'gallery'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-w-[100px] text-center py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${
                      activeTab === tab
                        ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8">
                {/* Tab content: Itinerary */}
                {activeTab === 'itinerary' && details && (
                  <div className="space-y-6">
                    <div className="flex gap-2 flex-wrap mb-4">
                      {details.itinerary.map(item => (
                        <button
                          key={item.day}
                          onClick={() => setSelectedDay(item.day)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            selectedDay === item.day
                              ? 'bg-orange-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Day {item.day}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {details.itinerary.map(item => item.day === selectedDay && (
                        <motion.div
                          key={item.day}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4"
                        >
                          <h3 className="text-xl font-bold text-gray-800">
                            Day {item.day}: {item.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">{item.description}</p>
                          
                          <div className="pt-4 border-t border-gray-100">
                            <h4 className="font-bold text-gray-800 mb-3">Key Activities:</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {item.activities.map((act, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                  <FaChevronRight className="text-orange-500 mt-1 flex-shrink-0 text-[10px]" />
                                  <span>{act}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Tab content: Highlights */}
                {activeTab === 'highlights' && details && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Pilgrimage Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {details.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3 bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold flex-shrink-0 text-xs">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 text-sm font-medium">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab content: Inclusions & Exclusions */}
                {activeTab === 'inclusions' && details && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                        <FaCheck className="bg-green-100 p-1 rounded-full text-lg w-6 h-6 flex items-center justify-center" /> Included
                      </h3>
                      <ul className="space-y-2.5">
                        {details.inclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <FaCheck className="text-green-600 mt-1 flex-shrink-0 text-xs" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                        <FaTimes className="bg-red-100 p-1 rounded-full text-lg w-6 h-6 flex items-center justify-center" /> Excluded
                      </h3>
                      <ul className="space-y-2.5">
                        {details.exclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <FaTimes className="text-red-500 mt-1 flex-shrink-0 text-xs" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Tab content: Gallery */}
                {activeTab === 'gallery' && details && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {details.gallery.map((img, index) => (
                      <div key={index} className="relative h-48 rounded-xl overflow-hidden shadow-sm group">
                        <Image
                          src={img}
                          alt={`${tour.name} gallery ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e: any) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/tours/placeholder.jpg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Travel Guidelines Alert */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
              <FaInfoCircle className="text-2xl text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-amber-800 mb-1">Important Pilgrimage Guidelines</h4>
                <p className="text-sm text-amber-700 leading-relaxed">
                  As this is a sacred spiritual pilgrimage, guests are kindly requested to strictly follow Vaishnava etiquette. No intoxication, smoking, or non-vegetarian food is permitted during the entire duration of the tour. Please dress modestly at all temple visits.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Booking Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 sticky top-24">
              <div className="text-center pb-6 border-b border-gray-100 mb-6">
                <span className="text-sm text-gray-500">Tour Cost per Pilgrim</span>
                <div className="text-3xl font-black text-orange-600 mt-1">
                  ₹{tour.price.toLocaleString()}
                </div>
                <span className="text-xs text-gray-400">All taxes, meals, and accommodations included</span>
              </div>

              {/* Inquiry Form */}
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="font-bold text-gray-800 text-lg mb-2">Book Your Slot</h3>
                    
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm font-semibold" role="alert">
                        {submitError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Select Tour Date</label>
                      <select 
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:opacity-60"
                      >
                        {tour.dates.map((date, idx) => (
                          <option key={idx} value={date}>{date}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Full Name</label>
                      <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Your Name"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Email Address</label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Your Email"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Phone Number</label>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Your Mobile No."
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Seats Needed</label>
                        <select 
                          name="seats"
                          value={formData.seats}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:opacity-60"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col justify-end">
                        <div className="text-right text-xs text-gray-400 mb-1">Total Estimated Cost</div>
                        <div className="text-right font-black text-orange-600 text-lg">
                          ₹{(tour.price * parseInt(formData.seats)).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Special Requests / Queries</label>
                      <textarea 
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder="Optional requests (e.g. senior citizen support, double room)"
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-3 rounded-xl mt-4 font-black shadow-md shadow-orange-500/20 active:scale-95 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : 'Submit Booking Inquiry'}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mx-auto mb-4">
                      <FaCheck />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Inquiry Submitted!</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Hare Krishna! Thank you for your interest in the {tour.name}. A representative from ISKCON Durgapur will contact you within 24-48 hours.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-sm font-bold text-orange-600 hover:text-orange-700 underline"
                    >
                      Submit another inquiry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Instant Contact Details */}
              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <span className="text-xs text-gray-400 block mb-3">Or contact our office directly:</span>
                <div className="flex justify-center gap-4">
                  <a href="tel:+911234567890" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors">
                    <FaPhone className="text-orange-500" /> Call Office
                  </a>
                  <a href="mailto:info.iskcondurgapur@gmail.com" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors">
                    <FaEnvelope className="text-orange-500" /> Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
