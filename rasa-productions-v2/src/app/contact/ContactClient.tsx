'use client';

import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaInstagram, FaYoutube, FaSpotify, FaEnvelope, FaPhone, FaPaperPlane, FaFacebook } from 'react-icons/fa';

const socials = [
    { icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com/rasaproductionsindia/', color: '#E1306C' },
    { icon: FaFacebook, label: 'Facebook', href: 'https://www.facebook.com/rasaproductions/', color: '#1877F2' },
    { icon: FaYoutube, label: 'YouTube', href: 'https://www.youtube.com/@rasaproductions', color: '#FF0000' },
    { icon: FaEnvelope, label: 'Email', href: 'mailto:rasaproductionsindia@gmail.com', color: '#d4a017' },
];

export default function ContactClient() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const endpoint = process.env.NODE_ENV === 'development' ? '/api/contact' : '/wp-json/rasa/v1/contact';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setStatus('sent');
                setForm({ name: '', email: '', phone: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    // 3D Tilt Tracking
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

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

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const inputClass = 'w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-cyan-400/50';
    const inputStyle = {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
    };

    return (
        <main className="min-h-screen pt-32 lg:pt-40 pb-24">
            <div className="fixed inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,240,255,0.12) 0%, transparent 70%)',
            }} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 pt-10"
                >
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6" style={{ fontFamily: 'var(--font-rajdhani)', letterSpacing: '-0.02em' }}>
                        Get In <span className="gradient-text-gold">Touch</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Business enquiries, collaborations, or just want to say hello? We'd love to hear from you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        style={{ perspective: 1000 }}
                    >
                        <motion.div
                            className="glass-card rounded-[2rem] p-8 md:p-12 transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                            style={{
                                border: '1px solid rgba(255,255,255,0.06)',
                                background: 'rgba(255,255,255,0.02)',
                                backdropFilter: 'blur(30px)',
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d"
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-rajdhani)', transform: "translateZ(30px)" }}>
                                Send Enquiry
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Your name"
                                        className={inputClass}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="your@email.com"
                                        className={inputClass}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Phone</label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="+91 000 000 0000"
                                        className={inputClass}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        placeholder="Tell us about your project..."
                                        className={`${inputClass} resize-none`}
                                        style={inputStyle}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full py-4 rounded-xl font-bold tracking-widest uppercase text-sm text-black transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70"
                                    style={{
                                        background: 'linear-gradient(135deg, #d4a017, #f5c842)',
                                        boxShadow: '0 0 30px rgba(212,160,23,0.3)',
                                    }}
                                >
                                    {status === 'sending' ? (
                                        <span className="animate-spin border-2 border-black/30 border-t-black rounded-full w-5 h-5" />
                                    ) : (
                                        <>
                                            <FaPaperPlane size={14} />
                                            Send Enquiry
                                        </>
                                    )}
                                </button>

                                {status === 'sent' && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="text-center text-green-400 text-sm">
                                        ✓ Message sent! We'll get back to you soon.
                                    </motion.p>
                                )}
                                {status === 'error' && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="text-center text-red-400 text-sm">
                                        Something went wrong. Please email us directly.
                                    </motion.p>
                                )}
                            </form>
                        </motion.div>
                    </motion.div>

                    {/* Contact info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Business contact */}
                        <div className="glass-card rounded-[2rem] p-8 md:p-12 mb-6" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                            <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                                Business Contact
                            </h2>
                            <div className="space-y-4">
                                <a href="mailto:rasaproductionsindia@gmail.com"
                                    className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors group">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)' }}>
                                        <FaEnvelope className="text-cyan-400" size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest">Email</p>
                                        <p className="font-medium text-sm">rasaproductionsindia@gmail.com</p>
                                    </div>
                                </a>

                                <a href="tel:+919704506779"
                                    className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors group">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                                        <FaPhone className="text-blue-400" size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest">Phone</p>
                                        <p className="font-medium text-sm">+91 9704506779</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Social links */}
                        <div className="glass-card rounded-[2rem] p-8 md:p-12" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                            <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                                Follow Us
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {socials.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:scale-[1.03]"
                                        style={{
                                            background: `${s.color}12`,
                                            border: `1px solid ${s.color}25`,
                                        }}
                                    >
                                        <s.icon size={20} style={{ color: s.color }} />
                                        <span className="text-sm font-medium text-white">{s.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
