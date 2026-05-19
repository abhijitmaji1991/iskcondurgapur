'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMusic, FaUser, FaArrowLeft } from 'react-icons/fa';

export default function BhajansList() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [bhajans, setBhajans] = useState<any[]>([]);
    const [filteredBhajans, setFilteredBhajans] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ─── Declare fetchBhajans BEFORE useEffect that calls it ───────────────
    const fetchBhajans = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/bhajans');
            const result = await response.json();

            if (response.ok) {
                setBhajans(result.data);
                setFilteredBhajans(result.data);
            } else {
                setError(result.message || 'Failed to fetch bhajans');
            }
        } catch (err) {
            console.error('Error fetching bhajans:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const authToken = localStorage.getItem('iskcon_admin_token');
        if (!authToken) {
            router.push('/admin/login');
            return;
        }
        fetchBhajans();
    }, [router, fetchBhajans]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this bhajan from the songbook?')) return;

        try {
            const response = await fetch(`/api/bhajans/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (response.ok) {
                fetchBhajans(); // Refresh list
            } else {
                alert(result.message || 'Failed to delete bhajan');
            }
        } catch (err) {
            console.error('Error deleting bhajan:', err);
            alert('Network error. Please try again.');
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Debounce filtering by 300ms so we don't re-render on every keystroke
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (value === '') {
                setFilteredBhajans(bhajans);
                return;
            }
            const lower = value.toLowerCase();
            setFilteredBhajans(
                bhajans.filter(b =>
                    b.title.toLowerCase().includes(lower) ||
                    b.author.toLowerCase().includes(lower) ||
                    (b.preview && b.preview.toLowerCase().includes(lower))
                )
            );
        }, 300);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-t-4 border-iskcon-orange border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                            <FaArrowLeft />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                                <FaMusic size={24} />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800">Bhajan Kutir Songbook</h1>
                        </div>
                    </div>
                    
                    <Link href="/admin/bhajans/add">
                        <button className="bg-iskcon-orange text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center gap-2 shadow-lg">
                            <FaPlus /> Add New Bhajan
                        </button>
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search bhajans by title, author, acharya or lyrics..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange bg-white transition-all xl:w-1/2"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 font-semibold text-gray-600">Bhajan Title</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Acharya / Author</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Verses Count</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBhajans.length > 0 ? (
                                    filteredBhajans.map((bhajan: any) => (
                                        <tr key={bhajan._id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center text-xl">
                                                        <FaMusic />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 font-sanskrit">{bhajan.title}</div>
                                                        <div className="text-xs text-gray-500 italic max-w-sm truncate font-sanskrit">{bhajan.preview}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-2 font-sanskrit">
                                                    <FaUser className="text-gray-400 text-xs" />
                                                    {bhajan.author || 'Traditional'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                                                {bhajan.lyrics?.length || 0} verses
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${bhajan.isPublished
                                                        ? 'bg-green-50 text-green-600 border border-green-100'
                                                        : 'bg-gray-50 text-gray-500 border border-gray-100'
                                                    }`}>
                                                    {bhajan.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Link href={`/admin/bhajans/edit/${bhajan._id}`}>
                                                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                                            <FaEdit size={18} />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(bhajan._id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <FaTrash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                                <FaMusic size={48} className="opacity-20" />
                                                <p className="italic text-lg">No Vaishnava Bhajans found matching your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
