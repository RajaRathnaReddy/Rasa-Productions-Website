'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="relative border-t border-white/5 bg-black/80 backdrop-blur-xl mt-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-3 group mb-6">
                            <div className="relative w-12 h-12 group-hover:scale-110 transition-transform duration-300">
                                <Image
                                    src="/logos/logo-icon.webp"
                                    alt="Rasa Productions Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span
                                className="font-bold text-xl tracking-widest uppercase"
                                style={{ fontFamily: 'var(--font-rajdhani)' }}
                            >
                                <span className="text-white">Rasa</span>{' '}
                                <span className="text-pink-500">Productions</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
                            A creative studio focused on the intersection of music, visual storytelling, and advanced production technology.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/rasaproductionsindia/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-500/10 hover:text-pink-500 transition-all duration-300 hover:-translate-y-1">
                                <FaInstagram size={18} />
                            </a>
                            <a href="https://www.facebook.com/rasaproductions/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-cyan-400/10 hover:text-cyan-400 transition-all duration-300 hover:-translate-y-1">
                                <FaFacebook size={18} />
                            </a>
                            <a href="https://www.youtube.com/@rasaproductions" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-purple-500/10 hover:text-purple-500 transition-all duration-300 hover:-translate-y-1">
                                <FaYoutube size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 tracking-widest uppercase text-sm" style={{ fontFamily: 'var(--font-rajdhani)' }}>Quick Links</h3>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link></li>
                            <li><Link href="/music" className="text-gray-400 hover:text-white transition-colors text-sm">Music</Link></li>
                            <li><Link href="/videos" className="text-gray-400 hover:text-white transition-colors text-sm">Video Songs</Link></li>
                            <li><Link href="/virtual-production" className="text-gray-400 hover:text-white transition-colors text-sm">Virtual Production</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold mb-6 tracking-widest uppercase text-sm" style={{ fontFamily: 'var(--font-rajdhani)' }}>Support</h3>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">About Us</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Contact</Link></li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Terms & Conditions</Link></li>
                            <li><Link href="/data-deletion" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Data Deletion</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs text-center md:text-left">
                        &copy; {new Date().getFullYear()} Rasa Productions. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-xs tracking-widest uppercase font-light" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                        Music <span className="text-pink-500/50 mx-1">•</span> Emotion <span className="text-cyan-400/50 mx-1">•</span> Story
                    </p>
                </div>
            </div>
        </footer>
    );
}
