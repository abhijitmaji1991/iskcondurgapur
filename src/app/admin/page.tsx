'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUsers, FaCalendarAlt, FaBookOpen, FaImage, FaSignOutAlt, FaHome, FaMusic, FaRoute, FaCog } from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    temples: 0,
    events: 0,
    resources: 0,
    alerts: 0,
    users: 0,
    bhajans: 0,
    tours: 0
  });

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('iskcon_admin_token');
      if (!authToken) {
        router.push('/admin/login');
        return;
      }

      setIsAuthenticated(true);
      fetchStats();
    };

    checkAuth();
  }, [router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const result = await response.json();
      if (response.ok) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('iskcon_admin_token');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-iskcon-orange border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-iskcon-orange rounded-lg flex items-center justify-center text-white shadow-lg">
              <FaHome size={18} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              ISKCON Admin Panel
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-all font-medium"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-iskcon-orange/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-iskcon-orange/10 transition-all"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 relative z-10">Dashboard Overview</h2>
          <p className="text-gray-500 max-w-2xl relative z-10">
            Welcome back to the ISKCON administrative control center. Manage your temple listings, spiritual events, and religious content from here.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-iskcon-orange/30 transition-all hover:shadow-md cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-iskcon-orange rounded-xl group-hover:bg-iskcon-orange group-hover:text-white transition-all">
                <FaHome size={24} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Temples</p>
            <p className="text-3xl font-bold text-gray-900">{stats.temples}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500/30 transition-all hover:shadow-md cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all">
                <FaCalendarAlt size={24} />
              </div>
              <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full">New</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Upcoming Events</p>
            <p className="text-3xl font-bold text-gray-900">{stats.events}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-500/30 transition-all hover:shadow-md cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 text-purple-500 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-all">
                <FaUsers size={24} />
              </div>
              <span className="text-xs font-bold text-purple-500 bg-purple-50 px-2 py-1 rounded-full">Active</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">System Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.users}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-red-500/30 transition-all hover:shadow-md cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all">
                <FaImage size={24} />
              </div>
              <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">{stats.alerts} Active</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Security Alerts</p>
            <p className="text-3xl font-bold text-gray-900">{stats.alerts}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-amber-500/30 transition-all hover:shadow-md cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-all">
                <FaMusic size={24} />
              </div>
              <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-full">Bhajans</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Bhajans Book</p>
            <p className="text-3xl font-bold text-gray-900">{stats.bhajans || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-500/30 transition-all hover:shadow-md cursor-pointer group" onClick={() => router.push('/admin/tours')}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all">
                <FaRoute size={24} />
              </div>
              <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">Tours</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Spiritual Tours</p>
            <p className="text-3xl font-bold text-gray-900">{stats.tours || 0}</p>
          </div>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/temples" className="block transform hover:-translate-y-1 transition-all">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-xl group transition-all h-full flex flex-col">
              <div className="mb-6 text-iskcon-orange">
                <FaHome size={40} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Temple Management</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                Add, edit, or remove temple listings. Update temple information, schedules, and spiritual contact details.
              </p>
              <div className="flex items-center text-iskcon-orange font-bold text-sm tracking-wide group-hover:gap-2 transition-all">
                GO TO PANEL <span className="text-lg">→</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/users" className="block transform hover:-translate-y-1 transition-all">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-xl group transition-all h-full flex flex-col">
              <div className="mb-6 text-purple-500">
                <FaUsers size={40} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">User Control</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                Manage administrative accounts, assign roles, and control access permissions across the entire platform.
              </p>
              <div className="flex items-center text-purple-500 font-bold text-sm tracking-wide group-hover:gap-2 transition-all">
                GO TO PANEL <span className="text-lg">→</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/events" className="block transform hover:-translate-y-1 transition-all">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-xl group transition-all h-full flex flex-col">
              <div className="mb-6 text-blue-500">
                <FaCalendarAlt size={40} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Event Planner</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                Schedule and manage temple festivals, lectures, and programs. Set dates and locations for the community.
              </p>
              <div className="flex items-center text-blue-500 font-bold text-sm tracking-wide group-hover:gap-2 transition-all">
                GO TO PANEL <span className="text-lg">→</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/bhajans" className="block transform hover:-translate-y-1 transition-all">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-xl group transition-all h-full flex flex-col">
              <div className="mb-6 text-amber-500">
                <FaMusic size={40} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bhajan Songbook</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                Manage your Vaishnava Bhajan Kutir. Add new devotional songs, Sanskrit verses, Roman transliterations, and audio streams dynamically.
              </p>
              <div className="flex items-center text-amber-500 font-bold text-sm tracking-wide group-hover:gap-2 transition-all">
                GO TO PANEL <span className="text-lg">→</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/tours" className="block transform hover:-translate-y-1 transition-all">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-xl group transition-all h-full flex flex-col">
              <div className="mb-6 text-orange-500">
                <FaRoute size={40} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Spiritual Tours</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                Manage your sacred pilgrimages. Add new dynamic travel itineraries, update pricing, group sizes, coordinates, and inclusions.
              </p>
              <div className="flex items-center text-orange-500 font-bold text-sm tracking-wide group-hover:gap-2 transition-all">
                GO TO PANEL <span className="text-lg">→</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/settings" className="block transform hover:-translate-y-1 transition-all">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-xl group transition-all h-full flex flex-col">
              <div className="mb-6 text-orange-600">
                <FaCog size={40} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Website Settings</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                Manage global configurations. Update general contact details, phone numbers, email addresses, social media links, and notice banners dynamically.
              </p>
              <div className="flex items-center text-orange-600 font-bold text-sm tracking-wide group-hover:gap-2 transition-all">
                GO TO SETTINGS <span className="text-lg">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}