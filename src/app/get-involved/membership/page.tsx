'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const membershipLevels = [
    {
        title: 'Basic Member',
        price: '₹1,100/year',
        benefits: [
            'Temple newsletter subscription',
            'Priority entry during festivals',
            'Special darshan timings',
            'Invitation to member-only events'
        ]
    },
    {
        title: 'Silver Member',
        price: '₹5,100/year',
        benefits: [
            'All Basic benefits',
            'Quarterly prasadam package',
            'Personal spiritual counseling',
            'Access to exclusive workshops'
        ]
    },
    {
        title: 'Gold Member',
        price: '₹11,000/year',
        benefits: [
            'All Silver benefits',
            'VIP seating at major events',
            'Monthly private darshan',
            'Accommodation discounts',
            'Special puja services'
        ]
    }
];

export default function MembershipPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        membershipLevel: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for your interest! We will contact you shortly.');
    };

    return (
        <main className="min-h-screen pt-20">
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 z-0 opacity-50 bg-[url('/images/temple-interior.jpg')] bg-cover bg-center"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Become a Member
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Join our spiritual family and embrace the path of devotional service
                    </p>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Membership Levels</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {membershipLevels.map((level, index) => (
                            <motion.div
                                key={level.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white p-6 rounded-lg shadow-lg"
                            >
                                <h3 className="text-xl font-bold text-iskcon-orange mb-4">{level.title}</h3>
                                <p className="text-2xl font-bold mb-6">{level.price}</p>
                                <ul className="space-y-3">
                                    {level.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-center">
                                            <span className="w-2 h-2 bg-iskcon-orange rounded-full mr-2"></span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h2 className="text-3xl font-bold text-center mb-8">Register for Membership</h2>
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md border">
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-iskcon-orange focus:outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-iskcon-orange focus:outline-none"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Phone</label>
                            <input
                                type="tel"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-iskcon-orange focus:outline-none"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Membership Level</label>
                            <select
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-iskcon-orange focus:outline-none"
                                value={formData.membershipLevel}
                                onChange={(e) => setFormData({ ...formData, membershipLevel: e.target.value })}
                            >
                                <option value="">Select a membership level</option>
                                {membershipLevels.map((level) => (
                                    <option key={level.title} value={level.title}>{level.title}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-iskcon-orange text-white py-3 rounded-lg font-medium hover:bg-iskcon-orange/90 transition-colors"
                        >
                            Submit Application
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
