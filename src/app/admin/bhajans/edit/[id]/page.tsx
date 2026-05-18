'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaMusic } from 'react-icons/fa';

interface VerseInput {
    devanagariText: string;
    romanText: string;
    translationText: string;
}

interface BhajanForm {
    title: string;
    author: string;
    preview: string;
    audioUrl: string;
    isPublished: boolean;
}

export default function EditBhajan() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<BhajanForm>({
        title: '',
        author: '',
        preview: '',
        audioUrl: '',
        isPublished: true
    });
    const [verses, setVerses] = useState<VerseInput[]>([
        { devanagariText: '', romanText: '', translationText: '' }
    ]);
    const [errors, setErrors] = useState<Partial<BhajanForm>>({});

    useEffect(() => {
        const checkAuth = () => {
            const authToken = localStorage.getItem('iskcon_admin_token');
            if (!authToken) {
                router.push('/admin/login');
                return;
            }
            setIsAuthenticated(true);
            fetchBhajanDetails();
        };
        checkAuth();
    }, [router, id]);

    const fetchBhajanDetails = async () => {
        try {
            const response = await fetch(`/api/bhajans/${id}`);
            const result = await response.json();

            if (response.ok && result.data) {
                const bhajan = result.data;
                setFormData({
                    title: bhajan.title || '',
                    author: bhajan.author || '',
                    preview: bhajan.preview || '',
                    audioUrl: bhajan.audioUrl || '',
                    isPublished: bhajan.isPublished !== undefined ? bhajan.isPublished : true
                });

                if (bhajan.lyrics && bhajan.lyrics.length > 0) {
                    const mappedVerses = bhajan.lyrics.map((verse: any) => ({
                        devanagariText: verse.devanagari ? verse.devanagari.join('\n') : '',
                        romanText: verse.roman ? verse.roman.join('\n') : '',
                        translationText: verse.translation ? verse.translation.join('\n') : ''
                    }));
                    setVerses(mappedVerses);
                }
            } else {
                alert('Failed to load bhajan details');
                router.push('/admin/bhajans');
            }
        } catch (err) {
            console.error('Error loading bhajan details:', err);
            alert('Failed to load bhajan details due to a network error');
            router.push('/admin/bhajans');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleVerseChange = (index: number, field: keyof VerseInput, value: string) => {
        const updated = [...verses];
        updated[index][field] = value;
        setVerses(updated);
    };

    const addVerseBlock = () => {
        setVerses([...verses, { devanagariText: '', romanText: '', translationText: '' }]);
    };

    const removeVerseBlock = (index: number) => {
        if (verses.length === 1) {
            alert('A bhajan must have at least one verse!');
            return;
        }
        const updated = verses.filter((_, i) => i !== index);
        setVerses(updated);
    };

    const validateForm = () => {
        const newErrors: Partial<BhajanForm> = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.author.trim()) newErrors.author = 'Author/Acharya is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        try {
            // Map textareas back to arrays by splitting newlines
            const formattedLyrics = verses.map(verse => ({
                devanagari: verse.devanagariText.split('\n').map(line => line.trim()).filter(line => line !== ''),
                roman: verse.romanText.split('\n').map(line => line.trim()).filter(line => line !== ''),
                translation: verse.translationText.split('\n').map(line => line.trim()).filter(line => line !== '')
            }));

            const payload = {
                ...formData,
                lyrics: formattedLyrics
            };

            const response = await fetch(`/api/bhajans/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                router.push('/admin/bhajans');
            } else {
                const result = await response.json();
                alert(result.message || 'Failed to save changes');
            }
        } catch (error) {
            console.error('Error saving bhajan changes:', error);
            alert('Failed to save changes. Please try again.');
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
                        <Link href="/admin/bhajans" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                            <FaArrowLeft />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">Edit Bhajan Settings</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Meta Data */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Bhajan Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all`}
                                    placeholder="e.g. Sri Damodarashtakam"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Author / Acharya *</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleFormChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.author ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all`}
                                    placeholder="e.g. Satyavrata Muni, Srila Bhaktivinoda Thakura"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Audio Stream URL (MP3/Link)</label>
                                <input
                                    type="text"
                                    name="audioUrl"
                                    value={formData.audioUrl}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all"
                                    placeholder="e.g. https://domain.com/recording.mp3"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Preview Line (Opening verse preview)</label>
                                <input
                                    type="text"
                                    name="preview"
                                    value={formData.preview}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 focus:border-iskcon-orange outline-none transition-all"
                                    placeholder="e.g. namāmīśvaraṁ sac-cid-ānanda-rūpaṁ..."
                                />
                            </div>
                        </div>

                        {/* Songbook Verses Editor */}
                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <FaMusic className="text-orange-500" /> Song Verses & Translation
                                </h3>
                                <button
                                    type="button"
                                    onClick={addVerseBlock}
                                    className="text-xs bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition"
                                >
                                    <FaPlus /> Add Verse
                                </button>
                            </div>

                            <div className="space-y-6">
                                {verses.map((verse, index) => (
                                    <div key={index} className="bg-gray-50/50 rounded-2xl border border-gray-150 p-6 relative">
                                        <div className="absolute top-4 right-4 flex items-center gap-2">
                                            <span className="text-xs text-gray-400 font-bold bg-white px-2.5 py-1 rounded-lg border border-gray-100">
                                                Verse #{index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeVerseBlock(index)}
                                                className="p-1.5 text-red-500 bg-white hover:bg-red-50 rounded-lg border border-gray-100 transition-colors"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 mt-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-1">Devanagari Script (Hindi lines - one per line)</label>
                                                <textarea
                                                    value={verse.devanagariText}
                                                    onChange={(e) => handleVerseChange(index, 'devanagariText', e.target.value)}
                                                    rows={2}
                                                    className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 outline-none transition-all resize-none bg-white font-sanskrit font-bold text-gray-850"
                                                    placeholder="नमामीश्वरं सच्चिदानन्दरूपं&#10;लसत्कुण्डलं गोकुले भ्राजमानम्"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-1">Phonetic Romanized Script (English lines - one per line)</label>
                                                <textarea
                                                    value={verse.romanText}
                                                    onChange={(e) => handleVerseChange(index, 'romanText', e.target.value)}
                                                    rows={2}
                                                    className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 outline-none transition-all resize-none bg-white font-mono text-orange-700"
                                                    placeholder="namāmīśvaraṁ sac-cid-ānanda-rūpaṁ&#10;lasat-kuṇḍalaṁ gokule bhrājamānam"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-1">English Translation (Paragraph or line-by-line)</label>
                                                <textarea
                                                    value={verse.translationText}
                                                    onChange={(e) => handleVerseChange(index, 'translationText', e.target.value)}
                                                    rows={2}
                                                    className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-iskcon-orange/20 outline-none transition-all resize-none bg-white text-gray-600 italic"
                                                    placeholder="To the supreme controller, who possesses an eternal form of absolute existence..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status Checkbox */}
                        <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-xl">
                            <input
                                type="checkbox"
                                id="isPublished"
                                name="isPublished"
                                checked={formData.isPublished}
                                onChange={handleFormChange}
                                className="w-5 h-5 accent-orange-600 rounded"
                            />
                            <label htmlFor="isPublished" className="text-sm font-bold text-gray-805">
                                Publish this bhajan to the public songbook immediately
                            </label>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                            <Link href="/admin/bhajans">
                                <button className="px-6 py-2 rounded-lg font-semibold text-gray-500 hover:bg-gray-100 transition-all">
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-iskcon-orange text-white px-8 py-2 rounded-lg font-bold hover:bg-orange-700 transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : <><FaSave /> Save Changes</>}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}
