'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAudioStore } from '@/store/audioStore';
import {
    FaTimes,
    FaSpotify,
    FaApple,
    FaYoutube,
    FaAmazon,
    FaInstagram,
    FaDownload,
    FaPlay,
} from 'react-icons/fa';

const platforms = [
    {
        key: 'spotify',
        label: 'Spotify',
        icon: FaSpotify,
        color: '#1DB954',
        bg: 'rgba(29,185,84,0.15)',
    },
    {
        key: 'apple',
        label: 'Apple Music',
        icon: FaApple,
        color: '#FC3C44',
        bg: 'rgba(252,60,68,0.15)',
    },
    {
        key: 'youtube',
        label: 'YouTube Music',
        icon: FaYoutube,
        color: '#FF0000',
        bg: 'rgba(255,0,0,0.15)',
    },
    {
        key: 'amazon',
        label: 'Amazon Music',
        icon: FaAmazon,
        color: '#FF9900',
        bg: 'rgba(255,153,0,0.15)',
    },
    {
        key: 'instagram',
        label: 'Instagram Reels',
        icon: FaInstagram,
        color: '#E1306C',
        bg: 'rgba(225,48,108,0.15)',
    },
];

export default function SongModal() {
    const { selectedSong, closeSongModal, playSong } = useAudioStore();
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeSongModal();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [closeSongModal]);

    useEffect(() => {
        if (selectedSong) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [selectedSong]);

    return (
        <AnimatePresence>
            {selectedSong && (
                <motion.div
                    ref={overlayRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                        if (e.target === overlayRef.current) closeSongModal();
                    }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 40 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="relative w-full max-w-md rounded-3xl overflow-hidden"
                        style={{
                            background:
                                'linear-gradient(135deg, rgba(15,10,30,0.98) 0%, rgba(30,15,50,0.98) 100%)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(123,45,139,0.3)',
                        }}
                    >
                        {/* Close */}
                        <button
                            onClick={closeSongModal}
                            className="absolute top-4 right-4 z-[60] w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
                        >
                            <FaTimes className="text-white" size={14} />
                        </button>

                        {/* Top cover area */}
                        <div className="relative">
                            <div className="relative w-full aspect-square">
                                <Image
                                    src={selectedSong.cover}
                                    alt={selectedSong.title}
                                    fill
                                    className="object-cover"
                                />
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            'linear-gradient(to bottom, transparent 50%, rgba(10,5,20,1) 100%)',
                                    }}
                                />
                            </div>

                            {/* Play button overlay */}
                            <button
                                onClick={() => { playSong(selectedSong); closeSongModal(); }}
                                className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-400/40 hover:scale-110 transition-transform"
                            >
                                <FaPlay className="text-black ml-1" size={18} />
                            </button>
                        </div>

                        {/* Info & platforms */}
                        <div className="px-6 pb-6 -mt-2">
                            <h2 className="text-2xl font-bold text-white mb-0.5">
                                {selectedSong.title}
                            </h2>
                            <p className="text-gray-400 mb-5">{selectedSong.artist}</p>

                            <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                                Listen On
                            </p>

                            <div className="space-y-2">
                                {platforms.map((p) => {
                                    const link = (selectedSong.platforms as Record<string, string>)[p.key];
                                    if (!link && p.key !== 'instagram') return null;
                                    return (
                                        <a
                                            key={p.key}
                                            href={link || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:scale-[1.02]"
                                            style={{ background: p.bg, border: `1px solid ${p.color}30` }}
                                        >
                                            <p.icon size={20} style={{ color: p.color }} />
                                            <span className="text-sm font-medium text-white">{p.label}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
