'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/music', label: 'Music' },
    { href: '/videos', label: 'Videos' },
    { href: '/virtual-production', label: 'Virtual Production' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled
                    ? 'bg-black/40 backdrop-blur-3xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
                    : 'bg-transparent py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-18 py-3">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-16 h-16 group-hover:scale-110 transition-transform duration-300">
                                <Image
                                    src="/logos/logo-icon.webp"
                                    alt="Rasa Productions"
                                    fill
                                    className="object-contain drop-shadow-[0_0_10px_rgba(212,160,23,0.6)]"
                                />
                            </div>
                            <span
                                className="hidden sm:block font-bold text-lg tracking-widest uppercase"
                                style={{ fontFamily: 'var(--font-rajdhani)' }}
                            >
                                <span className="text-white">Rasa</span>{' '}
                                <span className="text-pink-500">Productions</span>
                            </span>
                        </Link>

                        {/* Desktop nav links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative px-4 py-2 text-sm font-medium tracking-widest uppercase transition-all duration-300 rounded ${isActive
                                            ? 'text-pink-500'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                        style={{ fontFamily: 'var(--font-rajdhani)' }}
                                    >
                                        {link.label}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeLink"
                                                className="absolute -bottom-2 left-0 right-0 h-0.5"
                                                style={{
                                                    background: 'linear-gradient(90deg, transparent, #ff2a85, transparent)',
                                                    boxShadow: '0 0 10px rgba(255,42,133,0.8)'
                                                }}
                                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 lg:hidden"
                    >
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`text-2xl font-bold tracking-widest uppercase transition-colors ${pathname === link.href ? 'text-pink-500' : 'text-white hover:text-pink-500'
                                        }`}
                                    style={{ fontFamily: 'var(--font-rajdhani)' }}
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
