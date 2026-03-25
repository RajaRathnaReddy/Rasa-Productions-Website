'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useAudioStore } from '@/store/audioStore';
import SongCard from '@/components/SongCard';
import SongModal from '@/components/SongModal';
import { FaVolumeUp, FaVolumeMute, FaMusic, FaFilm, FaVrCardboard } from 'react-icons/fa';
import songsData from '@/data/songs.json';

// --- Helper component to split text into animating characters ---
const CharacterReveal = ({ text, delayOffset = 0, className = "" }: { text: string, delayOffset?: number, className?: string }) => {
    return (
        <span className={`inline-block whitespace-nowrap ${className}`}>
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: delayOffset + index * 0.04,
                        ease: [0.21, 1.11, 0.81, 0.99] // Bouncy cinematic ease
                    }}
                    className="inline-block"
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </span>
    );
};

const ParticleField = () => {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        setParticles(Array.from({ length: 60 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 15 + 8,
            delay: Math.random() * 10,
            color: ['#d4a017', '#00d4ff', '#a855f7'][Math.floor(Math.random() * 3)],
        })));
    }, []);

    if (particles.length === 0) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full animate-float-up"
                    style={{
                        left: p.left,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: p.color,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                        boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                        bottom: '-20px',
                    }}
                />
            ))}
        </div>
    );
};

export default function HomeClient() {
    const { isMuted, toggleMute } = useAudioStore();
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
            >
                {/* Animated gradient background */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(123,45,139,0.35) 0%, rgba(0,212,255,0.08) 50%, transparent 80%)',
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse 60% 60% at 20% 80%, rgba(212,160,23,0.12) 0%, transparent 60%)',
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse 60% 60% at 80% 20%, rgba(0,212,255,0.08) 0%, transparent 60%)',
                    }}
                />

                {/* Grid lines */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                    }}
                />

                <ParticleField />

                {/* Mute button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.5 }}
                    onClick={toggleMute}
                    className="absolute top-24 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    {isMuted ? (
                        <FaVolumeMute className="text-gray-400" size={14} />
                    ) : (
                        <FaVolumeUp className="text-yellow-400 animate-pulse-glow" size={14} />
                    )}
                    <span className="text-gray-300 text-xs tracking-wider">
                        Ambient
                    </span>
                </motion.button>

                {/* Hero Content */}
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 text-center px-4 max-w-5xl mx-auto"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: 1.15,
                            opacity: 1,
                            y: [0, -15, 0] // Continuous float
                        }}
                        transition={{
                            scale: { duration: 1, delay: 2.9, ease: 'easeOut' },
                            opacity: { duration: 1, delay: 2.9, ease: 'easeOut' },
                            y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 4 } // Starts floating after entrance
                        }}
                        className="flex justify-center mb-12"
                    >
                        <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] drop-shadow-[0_0_80px_rgba(212,160,23,0.5)]">
                            <Image
                                src="/logos/logo.webp"
                                alt="Rasa Productions"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* New Release Notification Banner */}
                    {songsData.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 3.0 }}
                            className="flex justify-center mb-6"
                        >
                            <Link href="/music">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer transition-all hover:scale-105"
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                    <span className="animate-pulse w-2 h-2 rounded-full bg-[#00f0ff]" style={{ boxShadow: '0 0 10px #00f0ff' }} />
                                    <span className="text-xs font-bold tracking-widest uppercase text-white">
                                        New Release: <span className="text-[#00f0ff] font-normal">{songsData[0].title}</span>
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* V5 Hero Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1.2, delay: 3.1, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-widest mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        style={{ fontFamily: 'var(--font-rajdhani)' }}
                    >
                        RASA PRODUCTIONS
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 3.5 }}
                        className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 tracking-[0.2em] uppercase text-sm"
                    >
                        Music • Visual Storytelling • Technology
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 3.5 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/music"
                                className="inline-flex items-center justify-center px-12 py-5 rounded-full font-bold tracking-widest uppercase text-xs text-white transition-all duration-500 overflow-hidden relative group"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    fontFamily: 'var(--font-rajdhani)'
                                }}
                            >
                                <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                                <span className="relative z-10 text-white">Explore Music</span>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-0.5 h-8 bg-gradient-to-b from-cyan-400/50 to-transparent rounded-full"
                    />
                </motion.div>
            </section>

            {/* ── Latest Music ── */}
            <section className="py-32 lg:py-40 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-14"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs uppercase tracking-widest"
                            style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.3)', color: '#00f0ff' }}>
                            <FaMusic size={10} />
                            Latest Releases
                        </div>
                        <h2
                            className="text-4xl md:text-5xl font-black text-white mb-3"
                            style={{ fontFamily: 'var(--font-rajdhani)' }}
                        >
                            Our <span className="gradient-text-gold">Latest Songs</span>
                        </h2>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Hover over a song to preview. Click to access all streaming platforms.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15 }
                            }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
                    >
                        {songsData.map((song, i) => (
                            <motion.div
                                key={song.id}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                                }}
                            >
                                <SongCard song={song as any} index={i} />
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="text-center mt-12 lg:mt-16">
                        <Link
                            href="/music"
                            className="inline-block px-8 py-3 rounded-full text-sm font-medium text-white tracking-widest uppercase transition-all duration-300 hover:text-cyan-400"
                            style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                        >
                            View All Music →
                        </Link>
                    </div>
                </div>
            </section>

            <div className="section-divider" />

            {/* ── Feature Cards ── */}
            <section className="py-32 lg:py-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <h2
                            className="text-4xl md:text-5xl font-black text-white"
                            style={{ fontFamily: 'var(--font-rajdhani)' }}
                        >
                            What We <span className="gradient-text">Create</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                        {[
                            {
                                icon: FaMusic,
                                title: 'Original Music',
                                desc: 'Devotional, folk, and cinematic compositions crafted with heart and soul.',
                                href: '/music',
                                color: '#d4a017',
                                glow: 'rgba(212,160,23,0.2)',
                            },
                            {
                                icon: FaFilm,
                                title: 'Video Production',
                                desc: 'High-quality music videos with stunning cinematic visuals and storytelling.',
                                href: '/videos',
                                color: '#00d4ff',
                                glow: 'rgba(0,212,255,0.2)',
                            },
                            {
                                icon: FaVrCardboard,
                                title: 'Virtual Production',
                                desc: 'Cutting-edge LED wall and Unreal Engine environments — coming soon.',
                                href: '/virtual-production',
                                color: '#a855f7',
                                glow: 'rgba(168,85,247,0.2)',
                                badge: 'Coming Soon',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                            >
                                <Link href={item.href}>
                                    <div
                                        className="group relative glass-card rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:scale-[1.02] h-full"
                                        style={{
                                            border: `1px solid ${item.color}20`,
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px ${item.glow}, 0 0 0 1px ${item.color}40`;
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                        }}
                                    >
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                            style={{ background: `${item.glow}`, border: `1px solid ${item.color}30` }}
                                        >
                                            <item.icon size={24} style={{ color: item.color }} />
                                        </div>
                                        <h3
                                            className="text-2xl font-bold text-white mb-3"
                                            style={{ fontFamily: 'var(--font-rajdhani)' }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                        {item.badge && (
                                            <div
                                                className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-bold animate-pulse-glow"
                                                style={{ background: `${item.glow}`, color: item.color, border: `1px solid ${item.color}40` }}
                                            >
                                                {item.badge}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <SongModal />
        </main>
    );
}
