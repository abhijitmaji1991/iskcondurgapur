'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronDown, FaHome, FaInfoCircle, FaPrayingHands, FaCalendarAlt, FaBook, FaLandmark, FaImages, FaEnvelope, FaUtensils, FaPlane, FaGraduationCap, FaShoppingCart, FaUsers } from 'react-icons/fa';

const navigation = [
  { name: 'Home', href: '/', icon: <FaHome className="mr-2" /> },
  {
    name: 'About',
    href: '/about',
    icon: <FaInfoCircle className="mr-2" />,
    submenu: [
      { name: 'Our Mission', href: '/about/mission' },
      { name: 'ISKCON History', href: '/about/history' },
      { name: 'Temple Info', href: '/about/temple' },
      { name: 'Contact Us', href: '/about/contact' },
    ]
  },
  {
    name: 'Prabhupada',
    href: '/prabhupada',
    icon: <FaPrayingHands className="mr-2" />,
    submenu: [
      { name: 'Biography', href: '/prabhupada/biography' },
      { name: 'Books', href: '/resources/books' },
      { name: 'Lectures', href: '/prabhupada/lectures' },
      { name: 'Quotes', href: '/resources/prabhupada-quotes' },
      { name: 'Gallery', href: '/prabhupada/gallery' }
    ]
  },
  {
    name: 'Spiritual Life',
    href: '/spiritual-life',
    icon: <FaBook className="mr-2" />,
    submenu: [
      { name: 'All Courses', href: '/courses' },
      { name: 'Spiritual Tours', href: '/spiritual-tours' },
      { name: 'Prasadam', href: '/prasadam' }
    ]
  },
  {
    name: 'Resources',
    href: '/resources',
    icon: <FaLandmark className="mr-2" />,
    submenu: [
      { name: 'Audio & Podcasts', href: '/resources/audio' },
      { name: 'Vaishnava Bhajans', href: '/resources/bhajans' },
      { name: 'Videos', href: '/resources/videos' },
      { name: 'Photo Gallery', href: '/resources/gallery' }
    ]
  },
  {
    name: 'Get Involved',
    href: '/get-involved',
    icon: <FaUsers className="mr-2" />,
    submenu: [
      { name: 'Become a Member', href: '/get-involved/membership' },
      { name: 'Volunteer', href: '/get-involved/volunteer' },
      { name: 'Donate', href: '/donate' },
      { name: 'Events', href: '/events' }
    ]
  },
  { name: 'Store', href: '/store', icon: <FaShoppingCart className="mr-2" /> }
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return null;
  }

  const toggleSubmenu = (name: string) => {
    setActiveSubmenu(activeSubmenu === name ? null : name);
  };

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/95 backdrop-blur-md py-2 shadow-lg border-b border-orange-100/50'
        : 'bg-white/40 backdrop-blur-md py-4'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'circOut' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              className="relative h-12 w-12 mr-3"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <Image
                src="/images/iskcon-logo.png"
                alt="ISKCON Logo"
                width={48}
                height={48}
                className="drop-shadow-md"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-sanskrit font-black text-2xl tracking-tighter bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                ISKCON
              </span>
              <span className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase -mt-1 pl-1">
                Durgapur
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.submenu ? (
                  <button
                    className="nav-link text-black flex items-center"
                    onClick={() => toggleSubmenu(item.name)}
                  >
                    {item.icon}
                    {item.name}
                    <FaChevronDown className="inline ml-1 text-xs" />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="nav-link text-black flex items-center"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )}

                {item.submenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform origin-top-left">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-iskcon-orange/10 hover:text-iskcon-orange"
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Donate Button */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-iskcon-orange">
              Login
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              Sign Up
            </Link>
            <Link href="/donate" className="btn-primary">
              Donate
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-2xl text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white"
          >
            <div className="container mx-auto px-4 py-3">
              {navigation.map((item) => (
                <div key={item.name} className="py-2 border-b border-gray-100 last:border-0">
                  {item.submenu ? (
                    <>
                      <button
                        className="flex justify-between items-center w-full py-3 text-lg text-black font-medium active:bg-gray-50 rounded px-2"
                        onClick={() => toggleSubmenu(item.name)}
                      >
                        <span className="flex items-center gap-3">
                          {item.icon}
                          {item.name}
                        </span>
                        <FaChevronDown
                          className={`transition-transform duration-300 ${activeSubmenu === item.name ? 'rotate-180 text-iskcon-orange' : 'text-gray-400'
                            }`}
                        />
                      </button>
                      <AnimatePresence>
                        {activeSubmenu === item.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-50 rounded-lg mb-2"
                          >
                            <div className="py-1 px-4 space-y-1">
                              {item.submenu.map((subitem) => (
                                <Link
                                  key={subitem.name}
                                  href={subitem.href}
                                  className="block py-3 pl-8 text-base text-gray-600 hover:text-iskcon-orange hover:bg-white rounded transition-colors"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {subitem.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-3 px-2 text-lg text-black font-medium hover:text-iskcon-orange hover:bg-gray-50 rounded flex items-center gap-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="py-4 space-y-3">
                <Link
                  href="/auth/login"
                  className="block py-2 text-black hover:text-iskcon-orange"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block py-2 text-black hover:text-iskcon-orange"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  href="/donate"
                  className="btn-primary w-full text-center block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Donate
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
} 