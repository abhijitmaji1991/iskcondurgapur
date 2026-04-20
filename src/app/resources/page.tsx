import Link from 'next/link';
import { FaCalendarAlt, FaBook, FaVideo, FaHeadphones, FaQuoteRight } from 'react-icons/fa';

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 pt-20">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Resources</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/resources/calendar" className="group block bg-white rounded-2xl shadow-lg p-8 hover:bg-purple-50 transition">
            <div className="flex items-center mb-4">
              <FaCalendarAlt className="text-3xl text-purple-500 group-hover:scale-110 transition-transform mr-4" />
              <span className="text-xl font-semibold text-gray-800">Calendar</span>
            </div>
            <p className="text-gray-500">View and track spiritual events, activities, and your daily sadhana.</p>
          </Link>
          <Link href="/resources/books" className="group block bg-white rounded-2xl shadow-lg p-8 hover:bg-blue-50 transition">
            <div className="flex items-center mb-4">
              <FaBook className="text-3xl text-blue-500 group-hover:scale-110 transition-transform mr-4" />
              <span className="text-xl font-semibold text-gray-800">Books</span>
            </div>
            <p className="text-gray-500">Read and download spiritual books and scriptures.</p>
          </Link>
          <Link href="/resources/videos" className="group block bg-white rounded-2xl shadow-lg p-8 hover:bg-pink-50 transition">
            <div className="flex items-center mb-4">
              <FaVideo className="text-3xl text-pink-500 group-hover:scale-110 transition-transform mr-4" />
              <span className="text-xl font-semibold text-gray-800">Videos</span>
            </div>
            <p className="text-gray-500">Watch spiritual discourses, kirtans, and documentaries.</p>
          </Link>
          <Link href="/resources/audio" className="group block bg-white rounded-2xl shadow-lg p-8 hover:bg-yellow-50 transition">
            <div className="flex items-center mb-4">
              <FaHeadphones className="text-3xl text-yellow-500 group-hover:scale-110 transition-transform mr-4" />
              <span className="text-xl font-semibold text-gray-800">Audio</span>
            </div>
            <p className="text-gray-500">Listen to bhajans, lectures, and audio books.</p>
          </Link>
          <Link href="/resources/prabhupada-quotes" className="group block bg-white rounded-2xl shadow-lg p-8 hover:bg-green-50 transition">
            <div className="flex items-center mb-4">
              <FaQuoteRight className="text-3xl text-green-500 group-hover:scale-110 transition-transform mr-4" />
              <span className="text-xl font-semibold text-gray-800">Prabhupada Quotes</span>
            </div>
            <p className="text-gray-500">Daily inspiration from Srila Prabhupada&apos;s teachings.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
