'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaCalendarAlt, FaList, FaMap, FaClock, FaCheck, FaTimes, FaImage } from 'react-icons/fa';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

interface TourForm {
  name: string;
  location: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  rating: number;
  groupSize: string;
  category: string;
  dates: string[];
  features: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  gallery: string[];
  itinerary: ItineraryDay[];
}

export default function AddTour() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<TourForm>({
    name: '',
    location: '',
    description: '',
    image: '',
    duration: '',
    price: 15000,
    rating: 5.0,
    groupSize: '15-25',
    category: 'Krishna Pastimes',
    dates: [],
    features: [],
    highlights: [],
    inclusions: [],
    exclusions: [],
    gallery: [],
    itinerary: []
  });

  // Local entry states for dynamic lists
  const [dateInput, setDateInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [inclusionInput, setInclusionInput] = useState('');
  const [exclusionInput, setExclusionInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');

  // Local state for adding a day in the itinerary
  const [newDayTitle, setNewDayTitle] = useState('');
  const [newDayDesc, setNewDayDesc] = useState('');
  const [newDayActivity, setNewDayActivity] = useState('');
  const [newDayActivities, setNewDayActivities] = useState<string[]>([]);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('iskcon_admin_token');
      if (!authToken) {
        router.push('/admin/login');
        return;
      }
      setIsAuthenticated(true);
      setIsLoading(false);
    };
    checkAuth();
  }, [router]);

  // Form field change handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' ? parseFloat(value) || 0 : value
    }));
  };

  // Helper to add item to array list
  const addToList = (field: keyof TourForm, value: string, setter: (val: string) => void) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()]
    }));
    setter('');
  };

  // Helper to remove item from array list
  const removeFromList = (field: keyof TourForm, indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== indexToRemove)
    }));
  };

  // Itinerary Handlers
  const addItineraryDay = () => {
    if (!newDayTitle.trim() || !newDayDesc.trim()) {
      alert('Please fill out the Day Title and Description.');
      return;
    }
    const nextDayNum = formData.itinerary.length + 1;
    const newDay: ItineraryDay = {
      day: nextDayNum,
      title: newDayTitle.trim(),
      description: newDayDesc.trim(),
      activities: newDayActivities
    };

    setFormData(prev => ({
      ...prev,
      ...{ itinerary: [...prev.itinerary, newDay] }
    }));

    // Reset day fields
    setNewDayTitle('');
    setNewDayDesc('');
    setNewDayActivities([]);
    setNewDayActivity('');
  };

  const removeItineraryDay = (indexToRemove: number) => {
    const updatedItinerary = formData.itinerary
      .filter((_, i) => i !== indexToRemove)
      .map((item, idx) => ({ ...item, day: idx + 1 })); // Recalculate day numbers sequentially
    setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
  };

  const addActivityToNewDay = () => {
    if (!newDayActivity.trim()) return;
    setNewDayActivities(prev => [...prev, newDayActivity.trim()]);
    setNewDayActivity('');
  };

  const removeActivityFromNewDay = (idx: number) => {
    setNewDayActivities(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return alert('Tour Name is required');
    if (!formData.location.trim()) return alert('Location is required');
    if (!formData.description.trim()) return alert('Description is required');
    if (!formData.image.trim()) return alert('Main Image URL is required');
    if (!formData.duration.trim()) return alert('Duration is required');
    if (formData.itinerary.length === 0) return alert('Please add at least one day in the itinerary planner.');

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/admin/tours');
      } else {
        alert(result.message || 'Failed to create spiritual tour');
      }
    } catch (error) {
      console.error('Error adding tour:', error);
      alert('Failed to add spiritual tour. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/tours" className="text-gray-500 hover:text-orange-500 transition-colors p-2 rounded-lg hover:bg-gray-50">
              <FaArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Add Spiritual Tour</h1>
              <p className="text-xs text-gray-400">Configure public details and daily itineraries</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-bold transition flex items-center gap-2 text-sm shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave /> Save Tour
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: General Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-2 mb-2 flex items-center gap-2">
                <FaMap className="text-orange-500 text-sm" /> Tour General Info
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tour Title *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Vrindavan Spiritual Journey"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm text-gray-800 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Uttar Pradesh, India"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm text-gray-800 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the historical, spiritual and practical aspects of the tour..."
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm text-gray-800"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm text-gray-800"
                  >
                    <option value="Krishna Pastimes">Krishna Pastimes</option>
                    <option value="Temple Pilgrimage">Temple Pilgrimage</option>
                    <option value="Spiritual Retreat">Spiritual Retreat</option>
                    <option value="Pilgrimage Trek">Pilgrimage Trek</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 5 days or 1 week"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Group Size *</label>
                  <input
                    type="text"
                    name="groupSize"
                    value={formData.groupSize}
                    onChange={handleChange}
                    placeholder="e.g. 15-20"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm text-gray-800 font-semibold text-orange-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Rating (out of 5)</label>
                  <input
                    type="number"
                    name="rating"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Main Image URL *</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="e.g. /images/tours/vrindavan.jpg"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm text-gray-800"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Daily Itinerary Planner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-2 flex items-center gap-2">
                <FaClock className="text-orange-500 text-sm" /> Daily Itinerary Planner
              </h2>

              {/* Day Adder Form Block */}
              <div className="bg-orange-50/20 p-5 rounded-xl border border-orange-100/50 space-y-4">
                <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider">Add Day to Itinerary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Day Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Arrival & Yamuna Aarti"
                      value={newDayTitle}
                      onChange={(e) => setNewDayTitle(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Day Description *</label>
                    <textarea
                      placeholder="e.g. Arrive at Mathura and check-in to your Vrindavan hotel..."
                      value={newDayDesc}
                      onChange={(e) => setNewDayDesc(e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Day Key Activities</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Evening Yamuna Aarti"
                        value={newDayActivity}
                        onChange={(e) => setNewDayActivity(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addActivityToNewDay())}
                        className="flex-grow px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={addActivityToNewDay}
                        className="bg-orange-500 text-white px-4 rounded-xl font-bold hover:bg-orange-600 active:scale-95 transition-all text-sm"
                      >
                        Add
                      </button>
                    </div>

                    {/* Added activities list */}
                    {newDayActivities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 bg-white p-3 rounded-lg border border-gray-100">
                        {newDayActivities.map((act, idx) => (
                          <span key={idx} className="flex items-center gap-1 bg-gray-50 text-gray-700 px-2.5 py-1 text-xs rounded-full border border-gray-200/50">
                            {act}
                            <button type="button" onClick={() => removeActivityFromNewDay(idx)} className="text-red-500 hover:text-red-700">
                              <FaTimes size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold transition text-xs flex items-center gap-1.5"
                >
                  <FaPlus size={10} /> Add Day {formData.itinerary.length + 1}
                </button>
              </div>

              {/* Scheduled Days Listing */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Itinerary Preview ({formData.itinerary.length} Days)</h3>
                
                {formData.itinerary.length > 0 ? (
                  <div className="space-y-3">
                    {formData.itinerary.map((day, idx) => (
                      <div key={idx} className="border border-gray-100 rounded-xl p-4 flex justify-between items-start hover:border-orange-100 hover:bg-orange-50/10 transition-all">
                        <div className="space-y-1">
                          <span className="text-xs font-extrabold text-orange-500 uppercase">Day {day.day}</span>
                          <h4 className="font-bold text-gray-800 text-base">{day.title}</h4>
                          <p className="text-sm text-gray-500 leading-normal max-w-xl">{day.description}</p>
                          {day.activities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {day.activities.map((act, aIdx) => (
                                <span key={aIdx} className="bg-gray-100/70 text-gray-600 px-2 py-0.5 rounded text-xs">
                                  {act}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItineraryDay(idx)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No itinerary days added yet. Please use the adder above.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Lists (Dates, Features, Inclusions, Exclusions, Gallery) */}
          <div className="space-y-6">
            {/* Travel Dates */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-2">
                <FaCalendarAlt className="text-orange-500" /> Tour Dates
              </h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. July 18-24, 2026"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('dates', dateInput, setDateInput))}
                  className="flex-grow px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => addToList('dates', dateInput, setDateInput)}
                  className="bg-orange-500 text-white px-4 rounded-xl font-bold hover:bg-orange-600 active:scale-95 transition-all text-sm"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5">
                {formData.dates.map((date, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-sm text-gray-700">
                    <span>{date}</span>
                    <button type="button" onClick={() => removeFromList('dates', idx)} className="text-red-500 hover:text-red-700">
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-md font-bold text-green-700 flex items-center gap-2 border-b border-gray-50 pb-2">
                <FaCheck className="bg-green-50 p-1 rounded text-green-600" /> Inclusions
              </h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. AC Travel, Hotel Stay"
                  value={inclusionInput}
                  onChange={(e) => setInclusionInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('inclusions', inclusionInput, setInclusionInput))}
                  className="flex-grow px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => addToList('inclusions', inclusionInput, setInclusionInput)}
                  className="bg-orange-500 text-white px-4 rounded-xl font-bold hover:bg-orange-600 active:scale-95 transition-all text-sm"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5">
                {formData.inclusions.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-sm text-gray-700">
                    <span className="truncate max-w-[200px]">{item}</span>
                    <button type="button" onClick={() => removeFromList('inclusions', idx)} className="text-red-500 hover:text-red-700">
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-md font-bold text-red-700 flex items-center gap-2 border-b border-gray-50 pb-2">
                <FaTimes className="bg-red-50 p-1 rounded text-red-500" /> Exclusions
              </h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Flight tickets, tips"
                  value={exclusionInput}
                  onChange={(e) => setExclusionInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('exclusions', exclusionInput, setExclusionInput))}
                  className="flex-grow px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => addToList('exclusions', exclusionInput, setExclusionInput)}
                  className="bg-orange-500 text-white px-4 rounded-xl font-bold hover:bg-orange-600 active:scale-95 transition-all text-sm"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5">
                {formData.exclusions.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-sm text-gray-700">
                    <span className="truncate max-w-[200px]">{item}</span>
                    <button type="button" onClick={() => removeFromList('exclusions', idx)} className="text-red-500 hover:text-red-700">
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-2">
                <FaList className="text-orange-500" /> Features
              </h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Temple visits, Prasadam"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('features', featureInput, setFeatureInput))}
                  className="flex-grow px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => addToList('features', featureInput, setFeatureInput)}
                  className="bg-orange-500 text-white px-4 rounded-xl font-bold hover:bg-orange-600 active:scale-95 transition-all text-sm"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.features.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-1 bg-gray-50 text-gray-700 px-2.5 py-1 text-xs rounded-full border border-gray-200/50">
                    {item}
                    <button type="button" onClick={() => removeFromList('features', idx)} className="text-red-500 hover:text-red-700">
                      <FaTimes size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-2">
                <FaList className="text-orange-500" /> Highlights
              </h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Evening Ganga Aarti"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('highlights', highlightInput, setHighlightInput))}
                  className="flex-grow px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => addToList('highlights', highlightInput, setHighlightInput)}
                  className="bg-orange-500 text-white px-4 rounded-xl font-bold hover:bg-orange-600 active:scale-95 transition-all text-sm"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5">
                {formData.highlights.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-sm text-gray-700">
                    <span className="truncate max-w-[200px]">{item}</span>
                    <button type="button" onClick={() => removeFromList('highlights', idx)} className="text-red-500 hover:text-red-700">
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Images */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-2">
                <FaImage className="text-orange-500" /> Gallery Images
              </h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. /images/tours/vrindavan.jpg"
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('gallery', galleryInput, setGalleryInput))}
                  className="flex-grow px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => addToList('gallery', galleryInput, setGalleryInput)}
                  className="bg-orange-500 text-white px-4 rounded-xl font-bold hover:bg-orange-600 active:scale-95 transition-all text-sm"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5">
                {formData.gallery.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-xs text-gray-600">
                    <span className="truncate max-w-[200px]">{item}</span>
                    <button type="button" onClick={() => removeFromList('gallery', idx)} className="text-red-500 hover:text-red-700">
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
