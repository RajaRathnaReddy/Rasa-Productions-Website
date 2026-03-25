'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaFilm, FaUpload, FaPlay, FaTimes, FaShareAlt, FaYoutube, FaInstagram } from 'react-icons/fa';
import videosData from '@/data/videos.json';

interface Video {
    id: string;
    title: string;
    artist: string;
    thumbnail: string;
    videoUrl: string;
    duration: string;
    isNew: boolean;
    platforms: Record<string, string>;
}

function VideoCard({ video, index }: { video: Video; index: number }) {
    const [hovered, setHovered] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleEnter = () => {
        setHovered(true);
        videoRef.current?.play().catch(() => { });
    };
    const handleLeave = () => {
        setHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                onClick={() => setModalOpen(true)}
                className="group relative cursor-pointer rounded-2xl overflow-hidden"
                style={{
                    border: `1px solid ${hovered ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: hovered ? '0 20px 60px rgba(0,212,255,0.15)' : 'none',
                    transform: hovered ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 0.4s ease',
                    background: 'rgba(255,255,255,0.02)',
                }}
            >
                <div className="relative aspect-video">
                    <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
                    {video.videoUrl && (
                        <video
                            ref={videoRef}
                            src={video.videoUrl}
                            muted
                            playsInline
                            loop
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(0,212,255,0.9)', boxShadow: '0 0 30px rgba(0,212,255,0.6)' }}>
                            <FaPlay className="text-white ml-1" size={20} />
                        </div>
                    </div>
                    {video.isNew && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse-glow"
                            style={{ background: 'linear-gradient(135deg, #d4a017, #f5c842)', color: '#000' }}>
                            NEW
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className={`font-bold text-base mb-1 truncate transition-colors ${hovered ? 'text-cyan-400' : 'text-white'}`}>
                        {video.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{video.artist}</p>
                </div>
            </motion.div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            className="relative w-full max-w-4xl rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                            style={{ border: '1px solid rgba(0,212,255,0.2)' }}
                        >
                            <button onClick={() => setModalOpen(false)}
                                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <FaTimes size={14} className="text-white" />
                            </button>
                            <div className="aspect-video bg-black">
                                {video.videoUrl ? (
                                    <video src={video.videoUrl} controls autoPlay className="w-full h-full" />
                                ) : (
                                    <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
                                )}
                            </div>
                            <div className="p-6" style={{ background: 'rgba(10,5,20,0.98)' }}>
                                <h2 className="text-2xl font-bold text-white mb-1">{video.title}</h2>
                                <p className="text-gray-400 mb-4">{video.artist}</p>
                                <div className="flex gap-3 flex-wrap">
                                    {video.platforms?.youtube && (
                                        <a href={video.platforms.youtube} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                                            style={{ background: 'rgba(255,0,0,0.15)', border: '1px solid rgba(255,0,0,0.3)', color: '#ff4444' }}>
                                            <FaYoutube size={16} /> YouTube
                                        </a>
                                    )}
                                    {video.platforms?.instagram && (
                                        <a href={video.platforms.instagram} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                                            style={{ background: 'rgba(225,48,108,0.15)', border: '1px solid rgba(225,48,108,0.3)', color: '#E1306C' }}>
                                            <FaInstagram size={16} /> Instagram
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default function VideosClient() {
    return (
        <main className="min-h-screen pt-32 lg:pt-40 pb-24">
            <div className="fixed inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,212,255,0.15) 0%, transparent 70%)'
            }} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 pt-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs uppercase tracking-widest"
                        style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                        <FaFilm size={12} />
                        Cinematic Music Videos
                    </div>
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6" style={{ fontFamily: 'var(--font-rajdhani)', letterSpacing: '-0.02em' }}>
                        Video <span style={{ background: 'linear-gradient(135deg, #00d4ff, #7b2d8b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Songs</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Hover to preview. Click to watch in fullscreen. Experience music visually.
                    </p>
                </motion.div>

                {(videosData as Video[]).length > 0 ? (
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
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                    >
                        {(videosData as Video[]).map((video, i) => (
                            <motion.div
                                key={video.id}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                                }}
                            >
                                <VideoCard video={video} index={i} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-32">
                        <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                            <FaFilm size={32} className="text-cyan-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                            Video Songs Coming Soon
                        </h3>
                        <p className="text-gray-400">Our cinematic music videos are in production. Stay tuned!</p>
                    </div>
                )}
            </div>
        </main>
    );
}
