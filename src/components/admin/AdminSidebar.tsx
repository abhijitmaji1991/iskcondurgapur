'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    FaHome, FaUsers, FaCalendarAlt, FaMusic, FaRoute, 
    FaCog, FaImage, FaSignOutAlt, FaBookOpen, FaBars, FaTimes 
} from 'react-icons/fa';

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('iskcon_admin_token');
        router.push('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <FaHome /> },
        { name: 'Temples', path: '/admin/temples', icon: <FaHome /> },
        { name: 'Events', path: '/admin/events', icon: <FaCalendarAlt /> },
        { name: 'Courses', path: '/admin/courses', icon: <FaBookOpen /> },
        { name: 'Bhajans', path: '/admin/bhajans', icon: <FaMusic /> },
        { name: 'Tours', path: '/admin/tours', icon: <FaRoute /> },
        { name: 'Gallery', path: '/admin/gallery', icon: <FaImage /> },
        { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
        { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
    ];

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <>
            {/* Mobile Hamburger Menu */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-iskcon-orange rounded-lg flex items-center justify-center text-white">
                        <FaHome size={16} />
                    </div>
                    <h1 className="font-bold text-gray-800">Admin Panel</h1>
                </div>
                <button onClick={toggleMobileMenu} className="text-gray-600 focus:outline-none p-2">
                    {isMobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Sidebar Container */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileOpen ? 'translate-x-0 mt-16' : '-translate-x-full md:translate-x-0'} md:mt-0`}>
                
                {/* Desktop Logo Area */}
                <div className="hidden md:flex h-20 items-center gap-3 px-6 border-b border-gray-100">
                    <div className="w-10 h-10 bg-iskcon-orange rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                        <FaHome size={20} />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        ISKCON Admin
                    </h1>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Main Menu</p>
                    {navItems.map((item) => {
                        // Check if active (exact match for dashboard, prefix match for others)
                        const isActive = item.path === '/admin' 
                            ? pathname === '/admin' 
                            : pathname.startsWith(item.path);
                            
                        return (
                            <Link 
                                key={item.name} 
                                href={item.path}
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                                    isActive 
                                    ? 'bg-orange-50 text-iskcon-orange' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span className={`text-lg ${isActive ? 'text-iskcon-orange' : 'text-gray-400'}`}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
                    >
                        <FaSignOutAlt className="text-lg" />
                        Logout
                    </button>
                </div>
            </div>
            
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 md:hidden mt-16"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}
