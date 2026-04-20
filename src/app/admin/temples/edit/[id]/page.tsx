'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaTimes, FaTrash } from 'react-icons/fa';

interface TempleForm {
  name: string;
  location: string;
  country: string;
  description: string;
  image: string;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  schedule: {
    arati: string;
    darshan: string;
    classes: string;
  };
}


export default function EditTemple() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState<TempleForm>({
    name: '',
    location: '',
    country: '',
    description: '',
    image: '',
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    schedule: {
      arati: '',
      darshan: '',
      classes: ''
    }
  });

  useEffect(() => {
    // Check if the user is logged in
    const checkAuth = () => {
      const authToken = localStorage.getItem('iskcon_admin_token');
      if (!authToken) {
        router.push('/admin/login');
        return;
      }

      setIsAuthenticated(true);
      fetchTempleData();
    };

    checkAuth();
  }, [id, router]);

  const fetchTempleData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/temples/${id}`);
      const result = await response.json();

      if (response.ok) {
        const temple = result.data;
        // Parse timings if it's the combined string we store
        let arati = '', darshan = '', classes = '';
        if (temple.timings && typeof temple.timings === 'string') {
          const parts = temple.timings.split(' | ');
          parts.forEach((part: string) => {
            if (part.startsWith('Arati: ')) arati = part.replace('Arati: ', '');
            if (part.startsWith('Darshan: ')) darshan = part.replace('Darshan: ', '');
            if (part.startsWith('Classes: ')) classes = part.replace('Classes: ', '');
          });
        }

        setFormData({
          name: temple.name || '',
          location: temple.location || '',
          country: temple.country || '',
          description: temple.description || '',
          image: temple.image || '',
          contact: {
            phone: temple.contact?.phone || '',
            email: temple.contact?.email || '',
            website: temple.contact?.website || ''
          },
          schedule: {
            arati: arati || temple.timings || '', // fallback
            darshan: darshan || '',
            classes: classes || ''
          }
        });
      } else {
        setError(result.message || 'Temple not found');
      }
    } catch (err) {
      console.error('Error fetching temple data:', err);
      setError('Failed to load temple data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof typeof prev] as any),
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate form
      const requiredFields = ['name', 'location', 'country', 'description'];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          setError(`Please fill in the ${field} field`);
          setIsSubmitting(false);
          return;
        }
      }

      const templeData = {
        name: formData.name,
        location: formData.location,
        country: formData.country,
        description: formData.description,
        image: formData.image,
        contact: formData.contact,
        timings: `Arati: ${formData.schedule.arati} | Darshan: ${formData.schedule.darshan} | Classes: ${formData.schedule.classes}`
      };

      const response = await fetch(`/api/temples/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templeData),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/admin/temples');
      } else {
        setError(result.message || 'Failed to update temple');
      }
    } catch (err) {
      console.error('Error updating temple:', err);
      setError('An error occurred while updating the temple. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/temples/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (response.ok) {
        router.push('/admin/temples');
      } else {
        setError(result.message || 'Failed to delete temple');
        setIsDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      console.error('Error deleting temple:', err);
      setError('An error occurred while deleting the temple. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-iskcon-orange border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/admin/temples" className="flex items-center text-gray-800 hover:text-iskcon-orange mr-6">
              <FaArrowLeft className="mr-2" />
              <span>Back to Temple List</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Edit Temple: {formData.name}</h1>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 border border-red-500 rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
          >
            <FaTrash className="mr-2" /> Delete Temple
          </button>
        </div>
      </header>

      {/* Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{formData.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iskcon-orange"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Basic Information</h2>

              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Temple Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange"
                  placeholder="e.g. Sri Sri Radha Krishna Temple"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange"
                  placeholder="e.g. Bangalore, Karnataka"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange"
                  required
                >
                  <option value="">Select a country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="Russia">Russia</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange"
                  placeholder="Enter a detailed description of the temple..."
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange"
                  placeholder="/images/temple-name.jpg"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload an image to the media library first, then enter the path here.
                </p>
              </div>
            </div>

            {/* Right Column - Contact & Schedule */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Contact Information</h2>

              <div className="mb-4">
                <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="contact.phone"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange"
                  placeholder="e.g. +91 1234 567890"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="contact.email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange"
                  placeholder="e.g. info@templename.org"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="contact.website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  id="contact.website"
                  name="contact.website"
                  value={formData.contact.website}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange"
                  placeholder="e.g. www.templename.org"
                />
              </div>

              <h2 className="text-lg font-bold text-gray-800 mt-8 mb-4 border-b pb-2">Schedule Information</h2>

              <div className="mb-4">
                <label htmlFor="schedule.arati" className="block text-sm font-medium text-gray-700 mb-1">
                  Arati Timings
                </label>
                <input
                  type="text"
                  id="schedule.arati"
                  name="schedule.arati"
                  value={formData.schedule.arati}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange"
                  placeholder="e.g. 4:30 AM, 7:15 AM, 12:30 PM, 4:15 PM, 7:00 PM"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="schedule.darshan" className="block text-sm font-medium text-gray-700 mb-1">
                  Darshan Hours
                </label>
                <input
                  type="text"
                  id="schedule.darshan"
                  name="schedule.darshan"
                  value={formData.schedule.darshan}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange"
                  placeholder="e.g. 7:15 AM to 1:00 PM, 4:00 PM to 8:00 PM"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="schedule.classes" className="block text-sm font-medium text-gray-700 mb-1">
                  Class Schedule
                </label>
                <input
                  type="text"
                  id="schedule.classes"
                  name="schedule.classes"
                  value={formData.schedule.classes}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange"
                  placeholder="e.g. Morning: 7:30 AM, Evening: 5:30 PM"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
            <Link href="/admin/temples">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iskcon-orange flex items-center"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-iskcon-orange hover:bg-iskcon-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iskcon-orange flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Update Temple
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 