'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaMusic, FaFilm, FaHeart } from 'react-icons/fa';

const focusAreas = [
    { title: 'Music Production and Digital Releases', icon: FaMusic },
    { title: 'Cinematic Video Content', icon: FaFilm },
    { title: 'Pipeline Development and Engineering', icon: FaMusic },
    { title: 'Production Automation Tools', icon: FaFilm },
    { title: 'Procedural Workflows and Simulation', icon: FaHeart },
    { title: 'Virtual Production and Real-Time Filmmaking', icon: FaFilm },
];

export default function AboutClient() {
    return (
        <main className="min-h-screen pt-32 lg:pt-40 pb-24">
            <div className="fixed inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(123,45,139,0.2) 0%, transparent 70%)'
            }} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24 pt-10"
                >
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6" style={{ fontFamily: 'var(--font-rajdhani)', letterSpacing: '-0.02em' }}>
                        About <span className="text-pink-500">Rasa Productions</span>
                    </h1>
                    <div className="h-px max-w-xs mx-auto mt-6" style={{ background: 'linear-gradient(90deg, transparent, #ff2a85, transparent)' }} />
                </motion.div>

                {/* Hero block */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-24"
                >
                    <div className="md:col-span-2 text-center mb-16">
                        <div className="flex justify-center mb-12">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                className="relative w-80 h-80 lg:w-[400px] lg:h-[400px] rounded-3xl overflow-hidden"
                                style={{ border: '1px solid rgba(255,42,133,0.3)', boxShadow: '0 0 60px rgba(255,42,133,0.2)' }}
                            >
                                <Image src="/logos/logo.webp" alt="Rasa Productions" fill className="object-contain p-6" />
                                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(255,42,133,0.08) 0%, transparent 70%)' }} />
                            </motion.div>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                            Our <span className="text-cyan-400">Story</span>
                        </h2>

                        <div className="space-y-6 text-gray-300 leading-relaxed text-lg max-w-4xl mx-auto text-left">
                            <p>Rasa Productions is a creative studio focused on the intersection of music, visual storytelling, and advanced production technology. Built by a team of experienced artists and technologists, the studio brings together decades of combined experience from the visual effects and digital production industry.</p>

                            <p>Our team consists of professionals who have worked on world-class Hollywood projects at leading global studios in a highly professional capacity. We bring extensive experience across modern filmmaking and digital content creation, including Virtual Production, Pipeline Engineering, procedural workflows, and production automation for large-scale VFX-driven projects.</p>

                            <p>Throughout our careers, we have contributed to the development of custom tools, pipeline technologies, and automation systems that power modern visual effects production. By combining technical expertise with artistic sensibilities, we help streamline complex production workflows and enable artists to work faster, smarter, and more creatively.</p>

                            <p>At the heart of Rasa Productions is a strong focus on innovation and efficiency. Our team actively develops tools and technologies designed to support high-end production environments, including procedural workflows, pipeline automation, and modern scene description frameworks used across the industry.</p>

                            <p>Beyond technology development, Rasa Productions is expanding into music production and digital media, creating a platform where sound, visuals, and storytelling come together. Through our music releases and cinematic video productions, we aim to deliver immersive experiences that connect with audiences across platforms.</p>

                            <p>We are also exploring the future of filmmaking through Virtual Production, real-time environments, and next-generation production workflows powered by modern technologies such as real-time engines and procedural content creation tools.</p>

                            <p className="font-semibold text-pink-400 text-xl text-center py-4">Rasa Productions stands at the intersection of creativity, engineering, and storytelling, driven by a team passionate about pushing the boundaries of what modern digital production can achieve.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Focus Areas */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <h2 className="text-4xl font-bold text-white text-center mb-12" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                        Our <span className="text-pink-500">Focus Areas</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {focusAreas.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card rounded-2xl p-6 flex flex-row items-center gap-4 text-left"
                                style={{ border: `1px solid rgba(0,240,255,0.2)` }}
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: `rgba(0,240,255,0.1)`, border: `1px solid rgba(0,240,255,0.3)` }}>
                                    <v.icon size={20} className="text-cyan-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>{v.title}</h3>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Vision */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24 glass-card p-10 md:p-14 rounded-3xl text-center relative overflow-hidden"
                    style={{ border: '1px solid rgba(255,42,133,0.3)' }}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />

                    <h2 className="text-4xl font-bold text-white text-center mb-8" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                        Our <span className="text-cyan-400">Vision</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto font-light">
                        "To build a creative ecosystem where technology empowers storytelling, enabling artists and creators to produce compelling music, visuals, and cinematic experiences for global audiences."
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <p className="text-gray-400 mb-6">Want to collaborate or work with us?</p>
                    <Link href="/contact"
                        className="inline-block px-8 py-4 rounded-full font-semibold tracking-widest uppercase text-sm text-black transition-all duration-300 hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #00f0ff, #ff2a85)', boxShadow: '0 0 30px rgba(255,42,133,0.3)' }}>
                        Get In Touch
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
