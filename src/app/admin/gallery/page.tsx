'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaImage, FaTrash, FaUpload, FaSpinner, FaArrowLeft, FaFolder } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface GalleryDateGroup {
    date: string;
    images: string[];
}

export default function AdminGallery() {
    const router = useRouter();
    const [galleryData, setGalleryData] = useState<GalleryDateGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const authToken = localStorage.getItem('iskcon_admin_token');
        if (!authToken) {
            router.push('/admin/login');
            return;
        }
        fetchGalleryData();
    }, [router]);

    const fetchGalleryData = async () => {
        try {
            const response = await fetch('/api/admin/gallery');
            if (!response.ok) throw new Error('Failed to fetch gallery data');
            const result = await response.json();
            setGalleryData(result.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            setError('Please select at least one image to upload.');
            return;
        }
        if (!uploadDate) {
            setError('Please select a date.');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('date', uploadDate);
            selectedFiles.forEach(file => {
                formData.append('images', file);
            });

            const response = await fetch('/api/admin/gallery', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const resData = await response.json();
                throw new Error(resData.error || 'Upload failed');
            }

            // Reset form
            setSelectedFiles([]);
            const fileInput = document.getElementById('image-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            
            // Refresh data
            fetchGalleryData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (date: string, image: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        
        try {
            const response = await fetch(`/api/admin/gallery?date=${encodeURIComponent(date)}&image=${encodeURIComponent(image)}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete image');
            
            fetchGalleryData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all">
                        <FaArrowLeft className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
                        <p className="text-gray-500">Upload and organize images into date folders</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-100 flex justify-between">
                        {error}
                        <button onClick={() => setError(null)} className="text-red-800 font-bold">&times;</button>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaUpload className="text-teal-500" /> Upload New Images
                    </h2>
                    
                    <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Folder Date</label>
                            <input
                                type="date"
                                required
                                value={uploadDate}
                                onChange={(e) => setUploadDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                            />
                        </div>
                        <div className="md:col-span-7">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Images</label>
                            <input
                                type="file"
                                id="image-upload"
                                required
                                multiple
                                accept="image/jpeg, image/png, image/webp, image/gif"
                                onChange={handleFileChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                            />
                            {selectedFiles.length > 0 && (
                                <p className="text-sm text-gray-500 mt-2">{selectedFiles.length} file(s) selected</p>
                            )}
                        </div>
                        <div className="md:col-span-2 flex items-end">
                            <button
                                type="submit"
                                disabled={isUploading || selectedFiles.length === 0}
                                className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                            >
                                {isUploading ? <FaSpinner className="animate-spin" /> : 'Upload'}
                            </button>
                        </div>
                    </form>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {galleryData.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
                                No folders or images found in the gallery.
                            </div>
                        ) : (
                            galleryData.map((group) => (
                                <div key={group.date} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                                        <FaFolder className="text-yellow-500 text-xl" />
                                        <h3 className="text-lg font-bold text-gray-800">{new Date(group.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                                            {group.images.length} {group.images.length === 1 ? 'image' : 'images'}
                                        </span>
                                    </div>
                                    <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {group.images.map((img) => (
                                            <div key={img} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                                <Image 
                                                    src={`/images/gallery/${group.date}/${img}`}
                                                    alt={img}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <button
                                                        onClick={() => handleDelete(group.date, img)}
                                                        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all"
                                                        title="Delete Image"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
