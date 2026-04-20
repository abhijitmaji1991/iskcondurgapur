'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaCalendarAlt } from 'react-icons/fa';

interface EventForm {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: 'Festival' | 'Program' | 'Lecture' | 'Kirtan' | 'Other';
    image: string;
    organizer: string;
    registrationLink: string;
    isFeatured: boolean;
}

export default function AddEvent() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<EventForm>({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Festival',
        image: '',
        organizer: '',
        registrationLink: '',
        isFeatured: false
    });
    const [errors, setErrors] = useState<Partial<EventForm>>({});

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
        const newErrors: Partial<EventForm> = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';

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
            // Combine date and time for backend Date object
            const eventDateTime = new Date(`${formData.date}T${formData.time}`);

            const eventData = {
                ...formData,
                date: eventDateTime,
            };

            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            if (response.ok) {
                router.push('/admin/events');
            } else {
                const result = await response.json();
                alert(result.message || 'Failed to add event');
            }
        } catch (error) {
            console.error('Error adding event:', error);
            alert('Failed to add event. Please try again.');
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
                        <Link href="/admin/events" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                            <FaArrowLeft />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">Add New Event</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all`}
                                    placeholder="e.g. Janmashtami Festival 2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all appearance-none bg-white"
                                >
                                    <option value="Festival">Festival</option>
                                    <option value="Program">Program</option>
                                    <option value="Lecture">Lecture</option>
                                    <option value="Kirtan">Kirtan</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all"
                                    placeholder="e.g. Main Temple Hall"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.date ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Time *</label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.time ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all`}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all resize-none"
                                    placeholder="Tell people more about this divine event..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all"
                                    placeholder="/images/event-hero.jpg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Link (Optional)</label>
                                <input
                                    type="text"
                                    name="registrationLink"
                                    value={formData.registrationLink}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all"
                                    placeholder="https://forms.gle/..."
                                />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl md:col-span-2">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-iskcon-orange rounded"
                                />
                                <label htmlFor="isFeatured" className="text-sm font-bold text-gray-800">
                                    Feature this event on the homepage
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                            <Link href="/admin/events">
                                <button className="px-6 py-2 rounded-lg font-semibold text-gray-500 hover:bg-gray-100 transition-all">
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-iskcon-orange text-white px-8 py-2 rounded-lg font-bold hover:bg-orange-700 transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : <><FaSave /> Save Event</>}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
