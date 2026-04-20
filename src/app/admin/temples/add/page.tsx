'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

interface TempleForm {
  name: string;
  location: string;
  country: string;
  description: string;
  image: string;
  contactPhone: string;
  contactEmail: string;
  contactWebsite: string;
  scheduleArati: string;
  scheduleDarshan: string;
  scheduleClasses: string;
}

export default function AddTemple() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TempleForm>({
    name: '',
    location: '',
    country: '',
    description: '',
    image: '',
    contactPhone: '',
    contactEmail: '',
    contactWebsite: '',
    scheduleArati: '',
    scheduleDarshan: '',
    scheduleClasses: ''
  });
  const [errors, setErrors] = useState<Partial<TempleForm>>({});

  useEffect(() => {
    // Check if the user is logged in
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

  const validateForm = () => {
    const newErrors: Partial<TempleForm> = {};

    // Basic validation
    if (!formData.name.trim()) newErrors.name = 'Temple name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    // Email validation if provided
    if (formData.contactEmail && !/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    // Website validation if provided
    if (formData.contactWebsite && !formData.contactWebsite.includes('.')) {
      newErrors.contactWebsite = 'Invalid website format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error on field change
    if (errors[name as keyof TempleForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Map flat form data to nested Mongoose model structure
      const templeData = {
        name: formData.name,
        location: formData.location,
        country: formData.country,
        description: formData.description,
        image: formData.image,
        contact: {
          phone: formData.contactPhone,
          email: formData.contactEmail,
          website: formData.contactWebsite
        },
        timings: `Arati: ${formData.scheduleArati} | Darshan: ${formData.scheduleDarshan} | Classes: ${formData.scheduleClasses}`
      };

      const response = await fetch('/api/temples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templeData),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/admin/temples');
      } else {
        alert(result.message || 'Failed to add temple');
      }
    } catch (error) {
      console.error('Error adding temple:', error);
      alert('Failed to add temple. Please try again.');
    } finally {
      setIsSubmitting(false);
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/admin/temples" className="flex items-center text-gray-800 hover:text-iskcon-orange mr-6">
              <FaArrowLeft className="mr-2" />
              <span>Back to Temple List</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Add New Temple</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
              </div>

              {/* Temple Name */}
              <div className="col-span-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Temple Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange`}
                  placeholder="Sri Sri Radha Krishna Temple"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Location */}
              <div className="col-span-1">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.location ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange`}
                  placeholder="City, State/Province"
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>

              {/* Country */}
              <div className="col-span-1">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange`}
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="Other">Other</option>
                </select>
                {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
              </div>

              {/* Image URL */}
              <div className="col-span-1">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Temple Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.image ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange`}
                  placeholder="/images/temple.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">For best results, use a 16:9 aspect ratio image.</p>
                {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange`}
                  placeholder="Provide a detailed description of the temple..."
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Contact Information Section */}
              <div className="md:col-span-2 mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              </div>

              {/* Phone */}
              <div className="col-span-1">
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange`}
                  placeholder="+1 234 567 8900"
                />
                {errors.contactPhone && <p className="mt-1 text-sm text-red-500">{errors.contactPhone}</p>}
              </div>

              {/* Email */}
              <div className="col-span-1">
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange`}
                  placeholder="temple@example.com"
                />
                {errors.contactEmail && <p className="mt-1 text-sm text-red-500">{errors.contactEmail}</p>}
              </div>

              {/* Website */}
              <div className="col-span-1">
                <label htmlFor="contactWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  id="contactWebsite"
                  name="contactWebsite"
                  value={formData.contactWebsite}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.contactWebsite ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange`}
                  placeholder="www.example.com"
                />
                {errors.contactWebsite && <p className="mt-1 text-sm text-red-500">{errors.contactWebsite}</p>}
              </div>

              {/* Schedule Information Section */}
              <div className="md:col-span-2 mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule Information</h2>
              </div>

              {/* Arati Schedule */}
              <div className="col-span-1">
                <label htmlFor="scheduleArati" className="block text-sm font-medium text-gray-700 mb-1">
                  Arati Schedule
                </label>
                <input
                  type="text"
                  id="scheduleArati"
                  name="scheduleArati"
                  value={formData.scheduleArati}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.scheduleArati ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange`}
                  placeholder="4:30 AM, 7:15 AM, 12:30 PM, 4:15 PM, 7:00 PM"
                />
                {errors.scheduleArati && <p className="mt-1 text-sm text-red-500">{errors.scheduleArati}</p>}
              </div>

              {/* Darshan Schedule */}
              <div className="col-span-1">
                <label htmlFor="scheduleDarshan" className="block text-sm font-medium text-gray-700 mb-1">
                  Darshan Schedule
                </label>
                <input
                  type="text"
                  id="scheduleDarshan"
                  name="scheduleDarshan"
                  value={formData.scheduleDarshan}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.scheduleDarshan ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange`}
                  placeholder="7:15 AM to 1:00 PM, 4:00 PM to 8:00 PM"
                />
                {errors.scheduleDarshan && <p className="mt-1 text-sm text-red-500">{errors.scheduleDarshan}</p>}
              </div>

              {/* Classes Schedule */}
              <div className="col-span-1">
                <label htmlFor="scheduleClasses" className="block text-sm font-medium text-gray-700 mb-1">
                  Classes Schedule
                </label>
                <input
                  type="text"
                  id="scheduleClasses"
                  name="scheduleClasses"
                  value={formData.scheduleClasses}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.scheduleClasses ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-iskcon-orange focus:border-iskcon-orange`}
                  placeholder="Morning: 7:30 AM, Evening: 5:30 PM"
                />
                {errors.scheduleClasses && <p className="mt-1 text-sm text-red-500">{errors.scheduleClasses}</p>}
              </div>

              {/* Form Actions */}
              <div className="md:col-span-2 mt-8 flex justify-end space-x-4">
                <Link href="/admin/temples">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-iskcon-orange text-white rounded-md hover:bg-iskcon-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iskcon-orange flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Save Temple
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 