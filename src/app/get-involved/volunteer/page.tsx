'use client';

import React from 'react';

export default function VolunteerPage() {
    return (
        <main className="min-h-screen pt-20">
            <section className="py-4 bg-green-600 flex items-center justify-center text-white">
                <div className="text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Volunteer With Us</h1>
                    <p className="text-xl">Service to man is service to God</p>
                </div>
            </section>

            <section className="py-16 container mx-auto px-4 max-w-4xl">
                <div className="bg-white p-8 rounded-xl shadow-lg border">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Volunteer Application Form</h2>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Name</label>
                                <input type="text" className="w-full border rounded px-4 py-2" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Phone</label>
                                <input type="text" className="w-full border rounded px-4 py-2" placeholder="Phone Number" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input type="email" className="w-full border rounded px-4 py-2" placeholder="Your Email" />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Areas of Interest</label>
                            <select className="w-full border rounded px-4 py-2">
                                <option>Kitchen / Prasadam Distribution</option>
                                <option>Cleaning / Temple Maintenance</option>
                                <option>Deity Worship Helper</option>
                                <option>Book Distribution</option>
                                <option>Event Management</option>
                                <option>IT / Media Services</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Availability (Days/Hours)</label>
                            <input type="text" className="w-full border rounded px-4 py-2" placeholder="e.g. Weekends 10am-2pm" />
                        </div>
                        <button className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition">Submit Application</button>
                    </form>
                </div>
            </section>
        </main>
    );
}
