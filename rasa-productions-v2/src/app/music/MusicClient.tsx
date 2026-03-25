'use client';

import { motion } from 'framer-motion';
import SongCard from '@/components/SongCard';
import SongModal from '@/components/SongModal';
import { FaMusic, FaHeadphones } from 'react-icons/fa';
import songsData from '@/data/songs.json';

export default function MusicClient() {
    return (
        <main className="min-h-screen pt-32 lg:pt-40 pb-24">
            {/* Background gradients */}
            <div className="fixed inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(123,45,139,0.25) 0%, transparent 70%)'
            }} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 pt-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs uppercase tracking-widest"
                        style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.3)', color: '#d4a017' }}>
                        <FaHeadphones size={12} />
                        Rasa Productions Discography
                    </div>

                    <h1
                        className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6"
                        style={{ fontFamily: 'var(--font-rajdhani)', letterSpacing: '-0.02em' }}
                    >
                        Our <span className="gradient-text-gold">Music</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Hover over any song card to preview. Click to see all streaming platforms and download options.
                    </p>

                    {/* Decorative line */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-cyan-400/40" />
                        <FaMusic className="text-cyan-400" size={16} />
                        <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-cyan-400/40" />
                    </div>
                </motion.div>

                {/* Song Grid */}
                {songsData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                        {songsData.map((song, i) => (
                            <SongCard key={song.id} song={song as any} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)' }}>
                            <FaMusic size={32} className="text-cyan-400" />
                        </div>
                        <p className="text-gray-400 text-lg">No songs yet. Check back soon.</p>
                    </div>
                )}
            </div>

            <SongModal />
        </main>
    );
}
