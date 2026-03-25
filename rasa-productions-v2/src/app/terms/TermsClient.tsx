'use client';

import { motion } from 'framer-motion';

export default function TermsClient() {
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
                        Terms & <span className="text-pink-500">Conditions</span>
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
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>1. Acceptance of Terms</h2>
                            <p>By accessing and using the Rasa Productions website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>2. Intellectual Property Rights</h2>
                            <p>All content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and music, is the property of Rasa Productions or its content suppliers and protected by international copyright laws. Unauthorized utilization, reproduction, or distribution is strictly prohibited.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>3. Use License</h2>
                            <p>Permission is granted to temporarily view the materials on the Rasa Productions website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                            <ul className="mt-4 list-disc pl-5">
                                <li>Modify or copy the materials.</li>
                                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
                                <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
                                <li>Remove any copyright or other proprietary notations from the materials.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>4. Third-Party Links</h2>
                            <p>Rasa Productions has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Rasa Productions of the site. Use of any such linked website is at the user's own risk.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>5. Governing Law</h2>
                            <p>Any claim relating to the Rasa Productions website shall be governed by the laws of India without regard to its conflict of law provisions.</p>
                        </section>

                        <p className="text-sm text-gray-500 pt-8 mt-8 border-t border-white/10">Last updated: March 2026</p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
