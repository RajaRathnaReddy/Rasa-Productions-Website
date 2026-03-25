'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaDisplay, FaFilm, FaStar } from 'react-icons/fa6';
import { SiUnrealengine } from 'react-icons/si';

const ParticleField = () => {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        setParticles(Array.from({ length: 80 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 4 + 1,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 15,
            color: ['#a855f7', '#7b2d8b', '#00d4ff', '#d4a017'][Math.floor(Math.random() * 4)],
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
                        boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
                        bottom: '-20px',
                    }}
                />
            ))}
        </div>
    );
};

const features = [
    {
        icon: SiUnrealengine,
        title: 'Unreal Engine Environments',
        desc: 'Photo-realistic virtual sets powered by Unreal Engine 5 for infinite creative possibilities.',
        color: '#a855f7',
    },
    {
        icon: FaDisplay,
        title: 'LED Wall Production',
        desc: 'State-of-the-art LED volume walls creating immersive, real-time environments for artists.',
        color: '#00d4ff',
    },
    {
        icon: FaFilm,
        title: 'Cinematic Rendering',
        desc: 'Hollywood-grade rendering pipelines delivering stunning visual quality for music videos.',
        color: '#d4a017',
    },
    {
        icon: FaStar,
        title: 'Real-Time VFX',
        desc: 'Real-time visual effects seamlessly integrated into live performance and music video production.',
        color: '#a855f7',
    },
];

export default function VirtualProductionClient() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-32 lg:pt-40 pb-24">
            <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(123,45,139,0.4) 0%, rgba(0,212,255,0.08) 50%, transparent 80%)',
            }} />
            <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 60% 40% at 20% 80%, rgba(168,85,247,0.15) 0%, transparent 60%)',
            }} />

            <ParticleField />

            {/* Grid lines */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)',
                backgroundSize: '80px 80px',
            }} />

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-32">
                {/* Coming Soon Badge */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 text-sm font-bold uppercase tracking-widest animate-pulse-glow"
                    style={{
                        background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(0,212,255,0.2))',
                        border: '1px solid rgba(168,85,247,0.5)',
                        color: '#a855f7',
                        boxShadow: '0 0 30px rgba(168,85,247,0.3)',
                    }}
                >
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    Coming Soon
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-8xl lg:text-[6rem] font-black text-white mb-8 leading-tight tracking-tight"
                    style={{ fontFamily: 'var(--font-rajdhani)', letterSpacing: '-0.02em' }}
                >
                    Virtual{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, #a855f7, #00d4ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Production
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed"
                >
                    We are building the future of music production. Unreal Engine environments, LED wall
                    technology, and cinematic rendering capabilities are coming to Rasa Productions.
                </motion.p>

                {/* Feature cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                            className="glass-card rounded-2xl p-6 text-left"
                            style={{ border: `1px solid ${f.color}20` }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                                    <f.icon size={20} style={{ color: f.color }} />
                                </div>
                                <h3 className="font-bold text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                                    {f.title}
                                </h3>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Animated CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                >
                    <Link
                        href="/contact"
                        className="inline-block px-10 py-4 rounded-full font-bold tracking-widest uppercase text-sm transition-all duration-300 hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, rgba(168,85,247,0.8), rgba(0,212,255,0.6))',
                            border: '1px solid rgba(168,85,247,0.5)',
                            boxShadow: '0 0 30px rgba(168,85,247,0.3)',
                            color: 'white',
                        }}
                    >
                        Get Notified When We Launch
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
