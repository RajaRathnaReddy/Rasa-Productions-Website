'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAudioStore } from '@/store/audioStore';
import { FaPlay, FaClock } from 'react-icons/fa';

interface Song {
    id: string;
    title: string;
    artist: string;
    duration: string;
    cover: string;
    audio: string;
    isNew: boolean;
    releaseDate: string;
    platforms: Record<string, string>;
}

interface SongCardProps {
    song: Song;
    index?: number;
}

export default function SongCard({ song, index = 0 }: SongCardProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { openSongModal, playSong, setHoverPlaying } = useAudioStore();

    // 3D Tilt tracking
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        setHoverPlaying(true);
        const audio = new Audio(song.audio);
        audio.volume = 0.4;
        audioRef.current = audio;
        audio.play().catch(() => { });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setHoverPlaying(false);
        x.set(0);
        y.set(0);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => openSongModal(song)}
            className="group relative cursor-pointer"
            style={{
                perspective: 1000,
            }}
        >
            <motion.div
                className={`glass-card rounded-2xl overflow-hidden transition-all duration-[400ms] ${isHovered ? 'border-cyan-400/50 shadow-[0_0_40px_rgba(0,240,255,0.3)]' : 'border-white/10 shadow-2xl'
                    }`}
                style={{
                    border: '1px solid',
                    background: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(20px)',
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
            >
                {/* 3D Depth Glare effect */}
                <motion.div
                    className="absolute inset-0 z-50 pointer-events-none rounded-2xl"
                    style={{
                        background: isHovered ? 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 60%)' : 'none',
                    }}
                />
                {/* Cover */}
                <div className="relative aspect-square overflow-hidden">
                    <Image
                        src={song.cover}
                        alt={song.title}
                        fill
                        className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'
                            }`}
                    />
                    {/* Overlay */}
                    <div
                        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                    >
                        <div className="w-16 h-16 rounded-full bg-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-400/50">
                            <FaPlay className="text-black ml-1" size={22} />
                        </div>
                    </div>

                    {/* NEW badge */}
                    {song.isNew && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-400 to-pink-500 text-black animate-pulse-glow">
                            NEW
                        </div>
                    )}

                    {/* Audio wave animation */}
                    {isHovered && (
                        <div className="absolute bottom-3 left-3 flex items-end gap-0.5 z-20">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-cyan-400 rounded-full"
                                    style={{
                                        animation: `wave 0.8s ease-in-out infinite`,
                                        animationDelay: `${i * 0.12}s`,
                                        height: '16px',
                                        boxShadow: '0 0 10px rgba(0,240,255,0.8)'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4" style={{ transform: "translateZ(30px)" }}>
                    <h3 className={`font-bold text-base mb-1 truncate transition-colors ${isHovered ? 'text-pink-500' : 'text-white'}`}>
                        {song.title}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <FaClock size={10} />
                        <span>{song.duration}</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
