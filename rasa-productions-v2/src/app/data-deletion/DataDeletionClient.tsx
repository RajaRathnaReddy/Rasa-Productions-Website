'use client';

import { motion } from 'framer-motion';

export default function DataDeletionClient() {
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
                        Data <span className="text-pink-500">Deletion</span>
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
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>1. Requesting Data Deletion</h2>
                            <p>At Rasa Productions, your privacy and data security are our top priority. If you wish to have your personal data deleted from our records, you have the right to request it at any time.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>2. How to Submit a Request</h2>
                            <p>To request the deletion of your data, please send an email to our support team explicitly stating your request.</p>
                            <ul className="mt-4 list-none p-0">
                                <li>Email: <a href="mailto:rasaproductionsindia@gmail.com" className="text-cyan-400 hover:text-pink-500 transition-colors">rasaproductionsindia@gmail.com</a></li>
                            </ul>
                            <p className="mt-4">In your email, please include the email address or phone number associated with any previous communications with us, so we can locate your information.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>3. Processing Time</h2>
                            <p>Once we receive your data deletion request, we will process it within 30 days. We will notify you via email once your data has been successfully and permanently removed from our active systems.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>4. Exceptions</h2>
                            <p>Please note that we may need to retain certain information for legal, accounting, or anti-fraud purposes, if applicable under the law. However, your data will no longer be used for marketing or communication purposes.</p>
                        </section>

                        <p className="text-sm text-gray-500 pt-8 mt-8 border-t border-white/10">Last updated: March 2026</p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
