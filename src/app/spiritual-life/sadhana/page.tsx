'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth/AuthContext';
import { motion } from 'framer-motion';
import { FaPray, FaBookOpen, FaChartLine, FaSave, FaPlus, FaMinus, FaHistory } from 'react-icons/fa';

interface SadhanaLog {
    date: string;
    rounds_chanted: number;
    reading_time_minutes: number;
}

export default function SadhanaTrackerPage() {
    const { user } = useAuth();
    const [rounds, setRounds] = useState(0);
    const [readingMinutes, setReadingMinutes] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [logs, setLogs] = useState<SadhanaLog[]>([]);
    const [message, setMessage] = useState('');

    // Load initial data (today's log if exists)
    useEffect(() => {
        // Mock data loading or fetch from API
        // For now, we start fresh
    }, []);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setReadingMinutes((prev) => prev + 1);
            }, 60000); // Update every minute
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const handleSave = async () => {
        // In a real app, this would be an API call
        // const response = await fetch('/api/sadhana/log', ...);

        // Simulating API call for this step until integrated
        try {
            const response = await fetch('/api/sadhana/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user?.id || 'demo_user', // Fallback for demo
                    date: new Date().toISOString().split('T')[0],
                    rounds_chanted: rounds,
                    reading_time_minutes: readingMinutes,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Sadhana saved successfully! Hari Bol! 🙏');
                fetchHistory(); // Refresh history
            } else {
                setMessage('Failed to save. Please try again.');
            }
        } catch (error) {
            setMessage('Error saving sadhana.');
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await fetch(`/api/sadhana/history?user_id=${user?.id || 'demo_user'}`);
            const data = await response.json();
            if (data.data) {
                setLogs(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch history');
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 bg-orange-50 font-poppins">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-orange-800 mb-4">My Sadhana Tracker</h1>
                    <p className="text-gray-600">&quot;Consistency is the key to spiritual progress.&quot; — Srila Prabhupada</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Japa Counter */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                                <FaPray className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Japa Rounds</h2>
                                <p className="text-sm text-gray-500">Target: 16 Rounds</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 mb-6">
                            <button
                                onClick={() => setRounds(Math.max(0, rounds - 1))}
                                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl transition-colors"
                            >
                                <FaMinus />
                            </button>
                            <span className="text-6xl font-bold text-orange-600 tabular-nums">
                                {rounds}
                            </span>
                            <button
                                onClick={() => setRounds(rounds + 1)}
                                className="w-12 h-12 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 flex items-center justify-center text-xl transition-colors"
                            >
                                <FaPlus />
                            </button>
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                            <div
                                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (rounds / 16) * 100)}%` }}
                            />
                        </div>
                        <p className="text-center text-sm text-gray-500">
                            {rounds >= 16 ? 'Goal Achieved! Hari Bol! 🎉' : `${16 - rounds} rounds to go`}
                        </p>
                    </div>

                    {/* Reading Timer */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                                <FaBookOpen className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Reading</h2>
                                <p className="text-sm text-gray-500">Srila Prabhupada&apos;s Books</p>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <span className="text-5xl font-bold text-gray-700 tabular-nums">
                                {readingMinutes} <span className="text-xl text-gray-400 font-normal">min</span>
                            </span>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className={`px-6 py-2 rounded-full font-medium transition-colors ${isTimerRunning
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                                    }`}
                            >
                                {isTimerRunning ? 'Pause Timer' : 'Start Reading'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="text-center mb-12">
                    <button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto"
                    >
                        <FaSave />
                        Save Daily Log
                    </button>
                    {message && (
                        <p className="mt-4 text-green-600 font-medium animate-fade-in">{message}</p>
                    )}
                </div>

                {/* History Section */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100">
                    <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                        <FaHistory className="text-orange-500 text-xl" />
                        <h2 className="text-xl font-semibold text-gray-800">Last 7 Days History</h2>
                    </div>

                    <div className="space-y-4">
                        {logs.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No logs found yet. Start your journey today!</p>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-800">{new Date(log.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-6 text-sm">
                                        <span className="flex items-center gap-2 text-gray-600">
                                            <FaPray className="text-orange-400" />
                                            <span className="font-semibold text-gray-800">{log.rounds_chanted}</span> rounds
                                        </span>
                                        <span className="flex items-center gap-2 text-gray-600">
                                            <FaBookOpen className="text-blue-400" />
                                            <span className="font-semibold text-gray-800">{log.reading_time_minutes}</span> min
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
