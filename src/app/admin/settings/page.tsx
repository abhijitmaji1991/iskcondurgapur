'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaSave, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaWhatsapp, 
  FaFacebook, 
  FaYoutube, 
  FaTwitter, 
  FaInstagram, 
  FaInfoCircle,
  FaBullhorn
} from 'react-icons/fa';

export default function AdminSettings() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [settings, setSettings] = useState({
    contactPhone: '',
    contactEmail: '',
    contactAddress: '',
    whatsappNumber: '',
    facebookUrl: '',
    youtubeUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    noticeBannerText: '',
    noticeBannerEnabled: false
  });

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('iskcon_admin_token');
      if (!authToken) {
        router.push('/admin/login');
        return;
      }

      setIsAuthenticated(true);
      fetchSettings();
    };

    checkAuth();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const result = await response.json();
      if (response.ok && result.data) {
        setSettings(result.data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setMessage({ type: 'error', text: 'Failed to load website settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const authToken = localStorage.getItem('iskcon_admin_token');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(settings)
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update settings.' });
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-iskcon-orange border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-iskcon-orange transition-colors font-medium">
            <FaArrowLeft /> Back to Dashboard
          </Link>
        </div>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Website Settings</h1>
            <p className="text-gray-500 mt-1">Configure global details and announcements shown across the website.</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-8 flex items-start gap-3 border ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            <FaInfoCircle className="mt-0.5 text-lg flex-shrink-0" />
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Contact Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="p-2 bg-orange-50 text-iskcon-orange rounded-lg"><FaPhone size={16} /></span>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><FaPhone size={14} /></span>
                  <input
                    type="text"
                    name="contactPhone"
                    value={settings.contactPhone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange transition-all bg-gray-50/30"
                    placeholder="+91 95637 86224"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500"><FaWhatsapp size={16} /></span>
                  <input
                    type="text"
                    name="whatsappNumber"
                    value={settings.whatsappNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange transition-all bg-gray-50/30"
                    placeholder="919563786224"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><FaEnvelope size={14} /></span>
                  <input
                    type="email"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange transition-all bg-gray-50/30"
                    placeholder="info.iskcondurgapur@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Office Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-400"><FaMapMarkerAlt size={14} /></span>
                  <textarea
                    name="contactAddress"
                    value={settings.contactAddress}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange transition-all bg-gray-50/30 resize-none"
                    placeholder="ISKCON Durgapur, Netaji Subhas Chandra Bose Road, A-Zone, Durgapur, West Bengal, India 713204"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Social Media */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="p-2 bg-blue-50 text-blue-500 rounded-lg"><FaFacebook size={16} /></span>
              Social Media Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook URL</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"><FaFacebook size={16} /></span>
                  <input
                    type="url"
                    name="facebookUrl"
                    value={settings.facebookUrl}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange transition-all bg-gray-50/30"
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube URL</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600"><FaYoutube size={16} /></span>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={settings.youtubeUrl}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange transition-all bg-gray-50/30"
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram URL</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600"><FaInstagram size={16} /></span>
                  <input
                    type="url"
                    name="instagramUrl"
                    value={settings.instagramUrl}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange transition-all bg-gray-50/30"
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter / X URL</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800"><FaTwitter size={16} /></span>
                  <input
                    type="url"
                    name="twitterUrl"
                    value={settings.twitterUrl}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange transition-all bg-gray-50/30"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Notice Banner */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="p-2 bg-red-50 text-red-500 rounded-lg"><FaBullhorn size={16} /></span>
                Global Announcement Banner
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="noticeBannerEnabled"
                  checked={settings.noticeBannerEnabled}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-iskcon-orange animate-none"></div>
              </label>
            </div>

            <div className="space-y-4">
              <p className="text-gray-500 text-sm">
                Enable this to show a prominent announcement banner at the very top of all website pages. Perfect for festival announcements, holiday schedules, or temple alerts.
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notice Banner Text</label>
                <textarea
                  name="noticeBannerText"
                  value={settings.noticeBannerText}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange transition-all bg-gray-50/30 resize-none"
                  placeholder="E.g., Sri Krishna Janmashtami celebrations start from August 25th! Join us at the temple."
                  disabled={!settings.noticeBannerEnabled}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link href="/admin" className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-semibold">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-iskcon-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition flex items-center gap-2 shadow-lg disabled:opacity-75"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-transparent border-white border-solid rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
