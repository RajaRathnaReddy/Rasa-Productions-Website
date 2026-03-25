'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    life: number;
}

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        let particleIdCounter = 0;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Spawn particles randomly on move
            if (Math.random() > 0.6) {
                setParticles((prev) => [
                    ...prev.slice(-10), // Keep max 10 particles (optimized)
                    {
                        id: particleIdCounter++,
                        x: e.clientX,
                        y: e.clientY,
                        life: 1,
                    },
                ]);
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('.group')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    // Clean up particles
    useEffect(() => {
        const interval = setInterval(() => {
            setParticles((prev) => prev.filter((p) => p.life > 0).map((p) => ({ ...p, life: p.life - 0.2 })));
        }, 100); // Optimized: reduced from 50ms to halve setState calls
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Main glowing orb */}
            <motion.div
                className="absolute w-8 h-8 rounded-full mix-blend-screen"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                    scale: isHovering ? 2.5 : 1,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 15,
                    mass: 0.5,
                }}
                style={{
                    background: isHovering ? 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(0,0,0,0) 70%)' : 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(0,212,255,0.4) 40%, rgba(0,0,0,0) 70%)',
                    boxShadow: isHovering ? '0 0 20px rgba(236,72,153,0.4)' : '0 0 15px rgba(0,212,255,0.4)',
                }}
            />

            {/* Core dot */}
            <motion.div
                className="absolute w-1.5 h-1.5 bg-white rounded-full mix-blend-difference"
                animate={{
                    x: mousePosition.x - 3,
                    y: mousePosition.y - 3,
                    opacity: isHovering ? 0 : 1
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 28,
                    mass: 0.1,
                }}
            />

            {/* Trailing Particles */}
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 1, scale: 1, x: p.x, y: p.y }}
                        animate={{
                            opacity: 0,
                            scale: 0,
                            x: p.x + (Math.random() - 0.5) * 40,
                            y: p.y + (Math.random() - 0.5) * 40 + 20, // drift down
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
                        style={{ boxShadow: '0 0 4px #00d4ff' }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
