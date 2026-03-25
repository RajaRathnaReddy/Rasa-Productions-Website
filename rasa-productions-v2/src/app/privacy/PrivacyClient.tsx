'use client';

import { motion } from 'framer-motion';

export default function PrivacyClient() {
    return (
        <main className="min-h-screen pt-32 lg:pt-40 pb-32">
            <div className="fixed inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,240,255,0.1) 0%, transparent 70%)'
            }} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 pt-10"
                >
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6" style={{ fontFamily: 'var(--font-rajdhani)', letterSpacing: '-0.02em' }}>
                        Privacy <span className="text-pink-500">Policy</span>
                    </h1>
                    <div className="h-px max-w-xs mx-auto mt-6" style={{ background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)' }} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="glass-card rounded-3xl p-8 md:p-12 prose prose-invert prose-pink max-w-none"
                    style={{ border: '1px solid rgba(0,240,255,0.2)' }}
                >
                    <div className="space-y-8 text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>1. Introduction</h2>
                            <p>Welcome to Rasa Productions. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or interact with our services.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>2. Information We Collect</h2>
                            <p>We may collect information you provide directly to us when using our contact forms, such as your name, email address, phone number, and message contents. We also collect anonymous usage statistics to improve our website experience.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>3. How We Use Your Information</h2>
                            <p>The information we collect is used strictly for communication purposes relating to your inquiries, business collaborations, or providing you with updates about our music and cinematic releases. We do not sell your personal data to third parties.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>4. Third-Party Services</h2>
                            <p>Our website utilizes external streaming links (such as YouTube, Spotify, Amazon Music, and Apple Music). When you navigate to these external platforms, their respective privacy policies and terms of service apply.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>5. Contact Us</h2>
                            <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
                            <ul className="mt-4 list-none p-0">
                                <li>Email: <a href="mailto:rasaproductionsindia@gmail.com" className="text-cyan-400 hover:text-pink-500 transition-colors">rasaproductionsindia@gmail.com</a></li>
                                <li>Phone: <a href="tel:+919704506779" className="text-cyan-400 hover:text-pink-500 transition-colors">+91 9704506779</a></li>
                            </ul>
                        </section>

                        <p className="text-sm text-gray-500 pt-8 mt-8 border-t border-white/10">Last updated: March 2025</p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
