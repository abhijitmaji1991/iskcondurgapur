'use client';

import React, { useState, useEffect } from 'react';
import { 
    FaPlay, FaFolder, FaMusic, FaArrowLeft, FaHome,
    FaSpinner, FaTimes, FaVideo
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioFile {
  url: string;
  name: string;
}

interface AudioFolder {
  path: string;
  name: string;
}

export default function AudioPage() {
  const [currentPath, setCurrentPath] = useState('');
  const [folders, setFolders] = useState<AudioFolder[]>([]);
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFile, setActiveFile] = useState<AudioFile | null>(null);

  // Fetch directory contents
  useEffect(() => {
    const fetchDirectory = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/iskcon-audio?path=${encodeURIComponent(currentPath)}`);
        const result = await res.json();
        
        if (result.success) {
          setFolders(result.data.folders);
          setFiles(result.data.files);
        } else {
          setError(result.message || 'Failed to load audio directory.');
        }
      } catch (err) {
        console.error('Directory fetch error:', err);
        setError('Network error loading directory.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectory();
  }, [currentPath]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveFile(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFolderClick = (path: string) => {
    setCurrentPath(path);
  };

  const navigateUp = () => {
    // Note: To navigate up in Google Drive, we'd need to fetch the parent ID or keep a history stack.
    // For simplicity, we just return to root if they click back.
    setCurrentPath('');
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pt-28 pb-32">
      
      {/* Decorative header */}
      <section className="container mx-auto px-6 mb-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-white/65 p-8 md:p-12 bg-gradient-to-br from-indigo-500/10 via-white/80 to-blue-500/5 backdrop-blur-md">
          <div className="max-w-3xl relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100/60 px-3 py-1.5 rounded-full">
              Personal Archive
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight mt-4 mb-4">
              Bhajan &amp; Kirtan
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Stream spiritual audio and video sessions directly from the personal archive.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
            <FaMusic className="w-full h-full text-indigo-500" />
          </div>
        </div>
      </section>

      {/* Browser Section */}
      <section className="container mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
          
          {/* Toolbar & Breadcrumbs */}
          <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center gap-4">
            <button 
              onClick={() => setCurrentPath('')}
              className={`p-2 rounded-xl transition ${!currentPath ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200 hover:text-indigo-600'}`}
              disabled={!currentPath}
              title="Home"
            >
              <FaHome size={20} />
            </button>
            <button 
              onClick={navigateUp}
              className={`p-2 rounded-xl transition ${!currentPath ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200 hover:text-indigo-600'}`}
              disabled={!currentPath}
              title="Go Back to Root"
            >
              <FaArrowLeft size={18} />
            </button>

            <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-mono text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap shadow-inner">
              /Bhajan_&_Kirtan{currentPath ? '/...' : ''}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-indigo-500">
                <FaSpinner className="animate-spin text-4xl mb-4" />
                <p className="font-semibold animate-pulse">Fetching from Google Drive...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100 max-w-xl mx-auto mt-10">
                <p className="font-bold text-lg mb-2">Could not load files</p>
                <p className="text-sm mb-4">{error}</p>
                <p className="text-sm text-red-800 bg-red-100/50 p-3 rounded-lg text-left">
                  <strong>Note:</strong> Make sure you have added the <code>GOOGLE_DRIVE_API_KEY</code> variable to your <code>.env.local</code> file!
                </p>
                <button onClick={() => setCurrentPath('')} className="mt-4 px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-full transition font-semibold text-sm shadow">
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                
                {/* Folders */}
                {folders.map((folder, idx) => (
                  <div 
                    key={`folder-${idx}`}
                    onClick={() => handleFolderClick(folder.path)}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition-all group shadow-sm hover:shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FaFolder size={20} />
                    </div>
                    <span className="font-semibold text-gray-700 text-sm truncate pr-2" title={folder.name}>
                      {folder.name}
                    </span>
                  </div>
                ))}

                {/* Files */}
                {files.map((file, idx) => {
                  const isVideo = file.name.toLowerCase().includes('session') || file.name.toLowerCase().includes('japa');
                  return (
                    <div 
                      key={`file-${idx}`}
                      onClick={() => setActiveFile(file)}
                      className="flex flex-col justify-between p-4 rounded-2xl border border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 cursor-pointer transition-all group shadow-sm hover:shadow relative overflow-hidden"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isVideo ? 'bg-indigo-100 text-indigo-500' : 'bg-orange-100 text-orange-500'}`}>
                          {isVideo ? <FaVideo size={16} /> : <FaMusic size={16} />}
                        </div>
                        <span className="font-bold text-gray-800 text-sm leading-snug line-clamp-3" title={file.name}>
                          {file.name}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-gray-100/50">
                        <div className="w-full py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all bg-white border border-gray-200 text-gray-600 group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-200">
                          <FaPlay size={12} /> Play
                        </div>
                      </div>
                    </div>
                  );
                })}

                {folders.length === 0 && files.length === 0 && (
                  <div className="col-span-full py-20 text-center text-gray-400">
                    <FaFolder size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-semibold">This folder is empty.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Inline File Player Modal (Google Drive Iframe) */}
      <AnimatePresence>
        {activeFile && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setActiveFile(null)}
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              style={{ height: '80vh' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-gray-900 px-5 py-4 flex items-center justify-between gap-4 shrink-0 border-b border-white/10">
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{activeFile.name}</p>
                </div>
                <button
                  onClick={() => setActiveFile(null)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition shrink-0"
                  aria-label="Close file"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              <div className="flex-1 w-full bg-black">
                <iframe
                  className="w-full h-full border-none"
                  src={activeFile.url}
                  allow="autoplay; fullscreen"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}