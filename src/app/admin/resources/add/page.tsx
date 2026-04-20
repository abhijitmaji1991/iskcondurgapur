'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaBookOpen } from 'react-icons/fa';

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

export default function AddResource() {
    const router = useRouter();
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

            const response = await fetch('/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resourceData),
            });

            if (response.ok) {
                router.push('/admin/resources');
            } else {
                const result = await response.json();
                alert(result.message || 'Failed to add resource');
            }
        } catch (error) {
            console.error('Error adding resource:', error);
            alert('Failed to add resource. Please try again.');
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

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/resources" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                            <FaArrowLeft />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">Add New Resource</h1>
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
                                    placeholder="e.g. The Science of Self-Realization"
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
                                    placeholder="e.g. Philosophy, Lifestyle"
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
                                    placeholder="Short summary of the resource..."
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
                                    placeholder="Main content or transcription..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Link (e.g. YouTube/PDF)</label>
                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all"
                                    placeholder="https://..."
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
                                    placeholder="e.g. A.C. Bhaktivedanta Swami Prabhupada"
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
                                    placeholder="/images/resources/hero.jpg"
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
                                    placeholder="krishna, yoga, gita"
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
                                    Publish this resource immediately
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
                                {isSubmitting ? 'Saving...' : <><FaSave /> Save Resource</>}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
