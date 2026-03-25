'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaMusic, FaFilm, FaCheck, FaTimes } from 'react-icons/fa';

const ADMIN_PASSWORD = 'rasa2024';

export default function AdminClient() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [tab, setTab] = useState<'song' | 'video'>('song');
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Song form state
    const [songData, setSongData] = useState({
        title: '', artist: 'Rasa Productions', duration: '',
        spotify: '', youtube: '', amazon: '', apple: '',
    });
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

    const handleSongUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setUploadStatus('idle');
        try {
            const fd = new FormData();
            Object.entries(songData).forEach(([k, v]) => fd.append(k, v));
            if (coverFile) fd.append('cover', coverFile);
            if (audioFile) fd.append('audio', audioFile);

            const res = await fetch('/api/upload-song', { method: 'POST', body: fd });
            if (res.ok) {
                setUploadStatus('success');
                setSongData({ title: '', artist: 'Rasa Productions', duration: '', spotify: '', youtube: '', amazon: '', apple: '' });
                setCoverFile(null);
                setAudioFile(null);
            } else {
                setUploadStatus('error');
            }
        } catch {
            setUploadStatus('error');
        }
        setUploading(false);
    };

    if (!authenticated) {
        return (
            <main className="min-h-screen flex items-center justify-center pt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-sm glass-card rounded-3xl p-8"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                            style={{ background: 'rgba(0,240,255,0.15)', border: '1px solid rgba(0,240,255,0.3)' }}>
                            <FaMusic className="text-cyan-400" size={22} />
                        </div>
                        <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                            Admin Portal
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Rasa Productions</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <button type="submit"
                            className="w-full py-3 rounded-xl font-bold text-black"
                            style={{ background: 'linear-gradient(135deg, #00f0ff, #ff2a85)' }}>
                            Login
                        </button>
                    </form>
                </motion.div>
            </main>
        );
    }

    const inputClass = 'w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all';
    const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' };
    const labelClass = 'text-xs text-gray-400 uppercase tracking-widest mb-1.5 block';

    return (
        <main className="min-h-screen pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <h1 className="text-4xl font-black text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                        Admin <span className="gradient-text-gold">Dashboard</span>
                    </h1>
                    <p className="text-gray-400 mt-1">Upload and manage content</p>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    {[{ key: 'song', label: 'Upload Song', icon: FaMusic }, { key: 'video', label: 'Upload Video', icon: FaFilm }].map((t) => (
                        <button key={t.key} onClick={() => setTab(t.key as 'song' | 'video')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                            style={tab === t.key ? { background: 'linear-gradient(135deg, #00f0ff, #ff2a85)' } : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <t.icon size={14} />
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Song upload form */}
                {tab === 'song' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="glass-card rounded-3xl p-8" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                        <form onSubmit={handleSongUpload} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Song Title *</label>
                                    <input required className={inputClass} style={inputStyle}
                                        value={songData.title} onChange={(e) => setSongData({ ...songData, title: e.target.value })}
                                        placeholder="Song title" />
                                </div>
                                <div>
                                    <label className={labelClass}>Artist</label>
                                    <input className={inputClass} style={inputStyle}
                                        value={songData.artist} onChange={(e) => setSongData({ ...songData, artist: e.target.value })}
                                        placeholder="Artist name" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Duration</label>
                                <input className={inputClass} style={inputStyle}
                                    value={songData.duration} onChange={(e) => setSongData({ ...songData, duration: e.target.value })}
                                    placeholder="e.g. 3:45" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Spotify Link</label>
                                    <input className={inputClass} style={inputStyle}
                                        value={songData.spotify} onChange={(e) => setSongData({ ...songData, spotify: e.target.value })}
                                        placeholder="https://open.spotify.com/..." />
                                </div>
                                <div>
                                    <label className={labelClass}>YouTube Music Link</label>
                                    <input className={inputClass} style={inputStyle}
                                        value={songData.youtube} onChange={(e) => setSongData({ ...songData, youtube: e.target.value })}
                                        placeholder="https://music.youtube.com/..." />
                                </div>
                                <div>
                                    <label className={labelClass}>Amazon Music Link</label>
                                    <input className={inputClass} style={inputStyle}
                                        value={songData.amazon} onChange={(e) => setSongData({ ...songData, amazon: e.target.value })}
                                        placeholder="https://music.amazon.in/..." />
                                </div>
                                <div>
                                    <label className={labelClass}>Apple Music Link</label>
                                    <input className={inputClass} style={inputStyle}
                                        value={songData.apple} onChange={(e) => setSongData({ ...songData, apple: e.target.value })}
                                        placeholder="https://music.apple.com/..." />
                                </div>
                            </div>

                            {/* File uploads */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Cover Art</label>
                                    <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl cursor-pointer transition-colors hover:border-cyan-400/40"
                                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.15)' }}>
                                        <FaUpload className="text-gray-400" size={20} />
                                        <span className="text-sm text-gray-400">{coverFile ? coverFile.name : 'Upload cover image'}</span>
                                        <input type="file" accept="image/*" className="hidden"
                                            onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
                                    </label>
                                </div>
                                <div>
                                    <label className={labelClass}>Audio File</label>
                                    <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl cursor-pointer transition-colors hover:border-cyan-400/40"
                                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.15)' }}>
                                        <FaMusic className="text-gray-400" size={20} />
                                        <span className="text-sm text-gray-400">{audioFile ? audioFile.name : 'Upload audio file'}</span>
                                        <input type="file" accept="audio/*" className="hidden"
                                            onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
                                    </label>
                                </div>
                            </div>

                            <button type="submit" disabled={uploading}
                                className="w-full py-4 rounded-xl font-bold text-sm text-black tracking-widest uppercase flex items-center justify-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #00f0ff, #ff2a85)', boxShadow: '0 0 30px rgba(0,240,255,0.3)' }}>
                                {uploading ? <span className="animate-spin border-2 border-black/30 border-t-black rounded-full w-5 h-5" /> : (
                                    <><FaUpload size={14} /> Upload Song</>
                                )}
                            </button>

                            {uploadStatus === 'success' && (
                                <div className="flex items-center gap-2 text-green-400 text-sm justify-center">
                                    <FaCheck /> Song uploaded successfully!
                                </div>
                            )}
                            {uploadStatus === 'error' && (
                                <div className="flex items-center gap-2 text-red-400 text-sm justify-center">
                                    <FaTimes /> Upload failed. Try again.
                                </div>
                            )}
                        </form>
                    </motion.div>
                )}

                {tab === 'video' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="glass-card rounded-3xl p-8 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                        <FaFilm className="text-cyan-400 mx-auto mb-4" size={40} />
                        <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-rajdhani)' }}>Video Upload</h3>
                        <p className="text-gray-400 text-sm">Video song upload coming in next update. Upload video files via the server for now.</p>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
