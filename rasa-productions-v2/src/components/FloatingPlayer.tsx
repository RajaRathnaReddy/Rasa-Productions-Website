'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAudioStore } from '@/store/audioStore';
import {
    FaPlay,
    FaPause,
    FaVolumeUp,
    FaVolumeMute,
    FaTimes,
    FaChevronDown,
} from 'react-icons/fa';

export default function FloatingPlayer() {
    const { currentSong, isPlaying, pauseSong, playSong, stopSong, isMuted, toggleMute } =
        useAudioStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [minimized, setMinimized] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!currentSong) return;
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        audioRef.current.src = currentSong.audio;
        audioRef.current.muted = isMuted;
        audioRef.current.play();

        const onUpdate = () => {
            if (audioRef.current) {
                const pct =
                    (audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100;
                setProgress(pct);
            }
        };
        audioRef.current.addEventListener('timeupdate', onUpdate);
        return () => {
            audioRef.current?.removeEventListener('timeupdate', onUpdate);
        };
    }, [currentSong]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    if (!currentSong) return null;

    return (
        <AnimatePresence>
            <motion.div
                key="floating-player"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-md"
            >
                <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/40">
                    {/* Progress bar */}
                    <div className="h-0.5 bg-white/10">
                        <div
                            className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex items-center gap-3 p-3">
                        {/* Cover */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                                src={currentSong.cover}
                                alt={currentSong.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate text-white">
                                {currentSong.title}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleMute}
                                className="p-1.5 text-gray-400 hover:text-white transition-colors"
                            >
                                {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
                            </button>
                            <button
                                onClick={() => (isPlaying ? pauseSong() : playSong(currentSong))}
                                className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform"
                            >
                                {isPlaying ? (
                                    <FaPause size={12} className="text-black" />
                                ) : (
                                    <FaPlay size={12} className="text-black ml-0.5" />
                                )}
                            </button>
                            <button
                                onClick={stopSong}
                                className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
