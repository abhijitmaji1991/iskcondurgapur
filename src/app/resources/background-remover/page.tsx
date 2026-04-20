"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaUpload, FaDownload, FaMagic, FaUndo } from 'react-icons/fa';
import Link from 'next/link';

const BackgroundRemoverPage = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setProcessedImage(null);

    // Validate file type
    if (!file.type.includes('image')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setOriginalImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      // In a real implementation, this would call an API
      // For demo purposes, we'll simulate a delay and just use the same image
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, this would be the result from your API
      setProcessedImage(originalImage);
    } catch (err) {
      setError('An error occurred while processing the image');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Hero Section */}
      <section className="pt-16 pb-8 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-purple-900 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Image Background Remover
          </motion.h1>
          <motion.p
            className="text-lg text-gray-700 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Remove backgrounds from your images with just a few clicks. Perfect for creating professional-looking images for your devotional content.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 px-4 mb-16">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold text-purple-800 mb-4">Upload Image</h2>

                {originalImage ? (
                  <div className="relative overflow-hidden rounded-lg border-2 border-purple-200 h-80 md:h-96">
                    <Image
                      src={originalImage}
                      alt="Original image"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <label
                    className="border-2 border-dashed border-purple-300 rounded-lg h-80 md:h-96 flex flex-col items-center justify-center cursor-pointer bg-purple-50 hover:bg-purple-100 transition duration-300"
                  >
                    <FaUpload className="text-5xl text-purple-500 mb-4" />
                    <p className="text-purple-800 font-medium mb-2">Click to upload an image</p>
                    <p className="text-sm text-gray-500">or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG or WEBP (max. 5MB)</p>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                      ref={fileInputRef}
                    />
                  </label>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
                    {error}
                  </div>
                )}

                {originalImage && (
                  <div className="mt-4 flex gap-3">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleRemoveBackground}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaMagic /> Remove Background
                        </>
                      )}
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition duration-300"
                      onClick={handleReset}
                    >
                      <FaUndo /> Reset
                    </button>
                  </div>
                )}
              </div>

              {/* Result Section */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold text-purple-800 mb-4">Result</h2>

                <div className="relative overflow-hidden rounded-lg border-2 border-purple-200 h-80 md:h-96 flex items-center justify-center bg-[url('/transparent-bg.png')] bg-repeat">
                  {processedImage ? (
                    <Image
                      src={processedImage}
                      alt="Processed image"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <p className="text-gray-500">Your processed image will appear here</p>
                  )}
                </div>

                {processedImage && (
                  <div className="mt-4">
                    <button
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                      onClick={handleDownload}
                    >
                      <FaDownload /> Download Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">How It Works</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Upload your image using the upload button above</li>
                <li>Click the &quot;Remove Background&quot; button to process your image</li>
                <li>Wait for the processing to complete</li>
                <li>Download your image with the background removed</li>
                <li>Use your new image in your projects!</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* More Resources Section */}
      <section className="py-12 px-4 bg-purple-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">Explore More Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link href="/resources/books" passHref>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">Sacred Books</h3>
                <p className="text-gray-600">Explore our collection of sacred books and scriptures.</p>
              </div>
            </Link>

            <Link href="/resources/audio" passHref>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">Audio Lectures</h3>
                <p className="text-gray-600">Listen to enlightening lectures and kirtans.</p>
              </div>
            </Link>

            <Link href="/resources/videos" passHref>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">Devotional Videos</h3>
                <p className="text-gray-600">Watch videos on spiritual topics and temple ceremonies.</p>
              </div>
            </Link>

            <Link href="/resources/prabhupada-quotes" passHref>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">Prabhupada Quotes</h3>
                <p className="text-gray-600">Discover wisdom from Srila Prabhupada on prasadam and spiritual nourishment.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-purple-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8 max-w-2xl mx-auto">Subscribe to our newsletter to receive updates on new resources and upcoming events.</p>

          <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-medium px-6 py-3 rounded-md transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* WhatsApp Button */}
      <section className="py-16 px-4 bg-purple-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Share on WhatsApp</h2>
          <a
            href="https://wa.me/919563786224"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Share on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default BackgroundRemoverPage; 