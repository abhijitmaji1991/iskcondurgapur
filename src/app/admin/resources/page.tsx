'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBookOpen, FaVideo, FaFileAlt, FaHeadphones } from 'react-icons/fa';

export default function ResourcesList() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [resources, setResources] = useState<any[]>([]);
    const [filteredResources, setFilteredResources] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const authToken = localStorage.getItem('iskcon_admin_token');
            if (!authToken) {
                router.push('/admin/login');
                return;
            }

            setIsAuthenticated(true);
            fetchResources();
        };

        checkAuth();
    }, [router]);

    const fetchResources = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/resources');
            const result = await response.json();

            if (response.ok) {
                setResources(result.data);
                setFilteredResources(result.data);
            } else {
                setError(result.message || 'Failed to fetch resources');
            }
        } catch (err) {
            console.error('Error fetching resources:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;

        try {
            const response = await fetch(`/api/resources/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (response.ok) {
                fetchResources(); // Refresh list
            } else {
                alert(result.message || 'Failed to delete resource');
            }
        } catch (err) {
            console.error('Error deleting resource:', err);
            alert('Network error. Please try again.');
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value === '') {
            setFilteredResources(resources);
            return;
        }

        const filtered = resources.filter(resource =>
            resource.title.toLowerCase().includes(value.toLowerCase()) ||
            resource.author?.toLowerCase().includes(value.toLowerCase()) ||
            resource.category?.toLowerCase().includes(value.toLowerCase()) ||
            resource.type?.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredResources(filtered);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Video': return <FaVideo className="text-red-500" />;
            case 'Audio': return <FaHeadphones className="text-blue-500" />;
            case 'Book': return <FaBookOpen className="text-amber-600" />;
            case 'Article': return <FaFileAlt className="text-green-600" />;
            default: return <FaFileAlt className="text-gray-500" />;
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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <FaBookOpen size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Resource Management</h1>
                    </div>
                    <Link href="/admin/resources/add">
                        <button className="bg-iskcon-orange text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center gap-2 shadow-lg">
                            <FaPlus /> Add Resource
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
                                placeholder="Search resources by title, author, category or type..."
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
                                    <th className="px-6 py-4 font-semibold text-gray-600">Resource Title</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Type & Category</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Author</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResources.length > 0 ? (
                                    filteredResources.map((resource: any) => (
                                        <tr key={resource._id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                                                        {getTypeIcon(resource.type)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{resource.title}</div>
                                                        <div className="text-xs text-gray-500 truncate max-w-xs">{resource.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${resource.type === 'Video' ? 'bg-red-50 text-red-600' :
                                                        resource.type === 'Book' ? 'bg-amber-50 text-amber-600' :
                                                            resource.type === 'Audio' ? 'bg-blue-50 text-blue-600' :
                                                                'bg-green-50 text-green-600'
                                                    }`}>
                                                    {resource.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {resource.author || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${resource.isPublished
                                                        ? 'bg-green-50 text-green-600 border border-green-100'
                                                        : 'bg-gray-50 text-gray-500 border border-gray-100'
                                                    }`}>
                                                    {resource.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Link href={`/admin/resources/edit/${resource._id}`}>
                                                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                                            <FaEdit size={18} />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(resource._id)}
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
                                                <FaBookOpen size={48} className="opacity-20" />
                                                <p className="italic text-lg">No resources found matching your search.</p>
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
