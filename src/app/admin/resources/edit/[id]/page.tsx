'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaTrash, FaBookOpen } from 'react-icons/fa';

interface ResourceForm {
    title: string;
    type: 'Article' | 'Video' | 'Audio' | 'Book' | 'Other';
    category: string;
    description: string;
    content: string;
    link: string;
    author: string;
    thumbnail: string;
    tags: string;
    isPublished: boolean;
}

export default function EditResource() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ResourceForm>({
        title: '',
        type: 'Article',
        category: '',
        description: '',
        content: '',
        link: '',
        author: '',
        thumbnail: '',
        tags: '',
        isPublished: true
    });
    const [errors, setErrors] = useState<Partial<ResourceForm>>({});
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const authToken = localStorage.getItem('iskcon_admin_token');
            if (!authToken) {
                router.push('/admin/login');
                return;
            }
            setIsAuthenticated(true);
            fetchResourceData();
        };
        checkAuth();
    }, [id, router]);

    const fetchResourceData = async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            const response = await fetch(`/api/resources/${id}`);
            const result = await response.json();

            if (response.ok) {
                const resource = result.data;
                setFormData({
                    title: resource.title || '',
                    type: resource.type || 'Article',
                    category: resource.category || '',
                    description: resource.description || '',
                    content: resource.content || '',
                    link: resource.link || '',
                    author: resource.author || '',
                    thumbnail: resource.thumbnail || '',
                    tags: Array.isArray(resource.tags) ? resource.tags.join(', ') : '',
                    isPublished: resource.isPublished !== undefined ? resource.isPublished : true
                });
            } else {
                setApiError(result.message || 'Resource not found');
            }
        } catch (err) {
            console.error('Error fetching resource data:', err);
            setApiError('Failed to load resource data');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Partial<ResourceForm> = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        try {
            const resourceData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
            };

            const response = await fetch(`/api/resources/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resourceData),
            });

            if (response.ok) {
                router.push('/admin/resources');
            } else {
                const result = await response.json();
                alert(result.message || 'Failed to update resource');
            }
        } catch (error) {
            console.error('Error updating resource:', error);
            alert('Failed to update resource. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-t-4 border-iskcon-orange border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    if (apiError) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md">
                    <div className="text-red-500 mb-4 flex justify-center">
                        <FaTrash size={48} className="opacity-20" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-500 mb-6">{apiError}</p>
                    <Link href="/admin/resources">
                        <button className="bg-iskcon-orange text-white px-8 py-2 rounded-lg font-bold hover:bg-orange-700 transition">
                            Back to Resources
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/resources" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                            <FaArrowLeft />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">Edit Resource: {formData.title}</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all appearance-none bg-white"
                                >
                                    <option value="Article">Article</option>
                                    <option value="Video">Video</option>
                                    <option value="Audio">Audio</option>
                                    <option value="Book">Book</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.category ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all`}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Content / Body</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Link</label>
                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Thumbnail URL</label>
                                <input
                                    type="text"
                                    name="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl md:col-span-2">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    name="isPublished"
                                    checked={formData.isPublished}
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-purple-600 rounded"
                                />
                                <label htmlFor="isPublished" className="text-sm font-bold text-gray-800">
                                    Publish this resource
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                            <Link href="/admin/resources">
                                <button className="px-6 py-2 rounded-lg font-semibold text-gray-500 hover:bg-gray-100 transition-all">
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-iskcon-orange text-white px-8 py-2 rounded-lg font-bold hover:bg-orange-700 transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {isSubmitting ? 'Updating...' : <><FaSave /> Update Resource</>}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
