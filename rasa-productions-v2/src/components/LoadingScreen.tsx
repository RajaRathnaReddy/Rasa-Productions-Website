'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [phase, setPhase] = useState(0); // 0: logo in, 1: tagline, 2: fade out

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 800);
        const t2 = setTimeout(() => setPhase(2), 3500); // Extended to let glow shine
        const t3 = setTimeout(() => setIsLoading(false), 4300);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="loader"
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black"
                >
                    {/* Animated background radial */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                'radial-gradient(ellipse at center, rgba(123,45,139,0.4) 0%, rgba(0,212,255,0.1) 40%, transparent 70%)',
                        }}
                    />

                    {/* Logo (Massive with Deferred Glow) */}
                    <motion.div
                        initial={{
                            scale: 0.5,
                            opacity: 0,
                            filter: 'drop-shadow(0px 0px 0px rgba(255,42,133,0)) drop-shadow(0px 0px 0px rgba(0,212,255,0)) drop-shadow(0px 0px 0px rgba(123,45,139,0))'
                        }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            filter: 'drop-shadow(0px 10px 40px rgba(255,42,133,0.5)) drop-shadow(0px 0px 80px rgba(0,212,255,0.6)) drop-shadow(0px 0px 120px rgba(123,45,139,0.8))'
                        }}
                        transition={{
                            scale: { duration: 1.5, ease: 'easeOut' },
                            opacity: { duration: 1.5, ease: 'easeOut' },
                            filter: { duration: 2, delay: 1.2, ease: 'easeInOut' }
                        }}
                        className="relative w-[20rem] h-[20rem] md:w-[30rem] md:h-[30rem] lg:w-[40rem] lg:h-[40rem] z-10 block mb-6"
                    >
                        <Image
                            src="/logos/logo.webp"
                            alt="Rasa Productions"
                            fill
                            className="object-contain"
                            priority
                        />
                    </motion.div>

                    {/* Tagline */}
                    <AnimatePresence>
                        {phase >= 1 && (
                            <motion.p
                                initial={{ opacity: 0, y: 10, letterSpacing: '0.1em' }}
                                animate={{ opacity: 1, y: 0, letterSpacing: '0.25em' }}
                                transition={{ duration: 0.8 }}
                                className="text-sm md:text-base uppercase tracking-widest font-medium drop-shadow-lg relative z-10"
                                style={{ fontFamily: 'var(--font-rajdhani)' }}
                            >
                                <span className="text-white">Music.</span> <span className="text-pink-500">Emotion.</span> <span className="text-white">Story.</span>
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Loading bar */}
                    <motion.div
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-white/10 rounded overflow-hidden"
                    >
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3.5, ease: 'easeInOut' }}
                            className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
