"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Play, Pause, Volume2, VolumeX, Music2,
  GripHorizontal, Loader2, RotateCcw, RotateCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function formatTime(secs: number): string {
  if (!secs || isNaN(secs) || !isFinite(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SecureAudioPlayer({ src, title, coverUrl }: {
  src: string; title: string; coverUrl?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  /* ── Audio event listeners ── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onMeta = () => { setDuration(audio.duration); setIsLoading(false); };
    const onEnd = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  /* ── Manual drag via grip handle (no framer-motion drag) ── */
  const onGripDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const rect = playerRef.current?.getBoundingClientRect();
    if (!rect) return;
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - rect.left - rect.width / 2, y: e.clientY - rect.top - rect.height / 2 };
    const onMove = (ev: PointerEvent) => {
      if (!isDragging.current) return;
      setPos({
        x: ev.clientX - dragOffset.current.x - window.innerWidth / 2,
        y: -(window.innerHeight - ev.clientY + dragOffset.current.y - 20),
      });
    };
    const onUp = () => { isDragging.current = false; window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else {
      setIsLoading(true);
      audio.play().then(() => { setIsPlaying(true); setIsLoading(false); }).catch(() => setIsLoading(false));
    }
  };

  /* ── Seek by percentage (0‒1) ── */
  const seek = (pct: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = audio.duration;
    if (!dur || !isFinite(dur)) return;
    const t = Math.max(0, Math.min(dur, pct * dur));
    audio.currentTime = t;
    setProgress((t / dur) * 100);
    setCurrentTime(t);
  };

  /* ── Skip ±N seconds ── */
  const skip = (delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = audio.duration;
    if (!dur || !isFinite(dur)) return;
    const newT = Math.max(0, Math.min(dur, audio.currentTime + delta));
    audio.currentTime = newT;
    setCurrentTime(newT);
    setProgress((newT / dur) * 100);
  };

  /* ── Seek bar click/drag handler ── */
  const onBarInteract = (e: React.PointerEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(pct);

    const onMove = (ev: PointerEvent) => {
      const p = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      seek(p);
    };
    const onUp = () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setMuted(v === 0);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      ref={playerRef}
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="fixed bottom-5 left-1/2 z-50 select-none"
      style={{ x: pos.x || "-50%", y: pos.y || 0 }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="w-[92vw] max-w-[680px]">
        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600/25 via-fuchsia-600/20 to-indigo-600/25 blur-2xl -z-10 scale-110" />

        {/* Player shell — NO border-beam, clean glass */}
        <div className="relative bg-[#0c0c1b]/97 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.3),0_24px_60px_rgba(0,0,0,0.75)] overflow-hidden">

          {/* Drag grip — ONLY this area moves the player */}
          <div
            className="flex justify-center pt-2 pb-0 cursor-grab active:cursor-grabbing touch-none"
            onPointerDown={onGripDown}
          >
            <GripHorizontal className="w-4 h-4 text-white/15" />
          </div>

          {/* ── PROGRESS BAR (native pointer events, no framer drag interference) ── */}
          <div
            className="relative w-full h-5 group/bar cursor-pointer"
            onPointerDown={onBarInteract}
          >
            {/* Track bg */}
            <div className="absolute left-0 right-0 h-1 bg-white/8 rounded-full" style={{ top: "50%", transform: "translateY(-50%)" }} />

            {/* Filled bar + shimmer */}
            <div
              className="absolute h-1 rounded-full overflow-hidden"
              style={{ left: 0, width: `${progress}%`, top: "50%", transform: "translateY(-50%)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-fuchsia-400 to-violet-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              <motion.div
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>

            {/* ★ Star glow tip */}
            {progress > 2 && (
              <div
                className="star-tip absolute w-2.5 h-2.5 rounded-full bg-white pointer-events-none"
                style={{ left: `${progress}%`, top: "50%", transform: "translate(-50%,-50%)" }}
              />
            )}

            {/* Playhead on hover */}
            <div
              className="absolute w-4 h-4 rounded-full bg-white border-2 border-fuchsia-400 shadow-[0_0_10px_rgba(168,85,247,0.9)] opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10"
              style={{ left: `${progress}%`, top: "50%", transform: "translate(-50%,-50%)" }}
            />
          </div>

          {/* ── CONTROLS ROW ── */}
          <div className="flex items-center px-4 py-2.5 gap-3">
            {/* Cover art */}
            <div className="relative flex-shrink-0 w-11 h-11">
              {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverUrl} alt="Cover" className="w-full h-full rounded-lg object-cover border border-white/10 shadow-lg" />
              ) : (
                <div className="w-full h-full rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Music2 className="w-5 h-5 text-indigo-400" />
                </div>
              )}
              {isPlaying && !isLoading && (
                <motion.span
                  animate={{ scale: [1, 1.75, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute -inset-1.5 rounded-xl border border-indigo-500/60 pointer-events-none block"
                />
              )}
              {isLoading && (
                <div className="absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-indigo-300 animate-spin" />
                </div>
              )}
            </div>

            {/* Title + time */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate leading-tight">{title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-white/55 font-mono">{formatTime(currentTime)}</span>
                <span className="text-white/20 text-[10px]">/</span>
                <span className="text-[10px] text-white/30 font-mono">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Animated waveform bars */}
            <div className="hidden sm:flex items-end gap-[2px] h-6 shrink-0">
              {[...Array(14)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={isPlaying && !isLoading ? { scaleY: [0.2, 1, 0.4, 0.85, 0.3] } : { scaleY: 0.2 }}
                  transition={isPlaying && !isLoading
                    ? { duration: 0.7 + (i % 3) * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }
                    : { duration: 0.3 }
                  }
                  className={`w-[3px] rounded-full origin-bottom ${isPlaying && !isLoading ? "bg-gradient-to-t from-indigo-500 to-fuchsia-400" : "bg-white/15"}`}
                  style={{ height: "100%" }}
                />
              ))}
            </div>

            {/* ↺ Back 10s */}
            <button
              onClick={() => skip(-10)}
              className="flex flex-col items-center gap-0.5 text-white/45 hover:text-fuchsia-300 active:scale-90 transition-all flex-shrink-0"
              title="Back 10s"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="text-[8px] font-black leading-none">10</span>
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.6)] hover:shadow-[0_0_36px_rgba(99,102,241,0.85)] active:scale-95 transition-all flex-shrink-0"
            >
              {isPlaying && !isLoading && (
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-indigo-400/40"
                />
              )}
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/15" />
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Pause className="w-5 h-5 text-white fill-white" />
                  </motion.div>
                ) : (
                  <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* ↻ Forward 10s */}
            <button
              onClick={() => skip(10)}
              className="flex flex-col items-center gap-0.5 text-white/45 hover:text-indigo-300 active:scale-90 transition-all flex-shrink-0"
              title="Forward 10s"
            >
              <RotateCw className="w-5 h-5" />
              <span className="text-[8px] font-black leading-none">10</span>
            </button>

            {/* Volume */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button onClick={() => { setMuted(!muted); if (audioRef.current) audioRef.current.volume = muted ? volume : 0; }} className="text-white/35 hover:text-white/70 transition-colors">
                {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <div className="relative w-14 h-1 bg-white/10 rounded-full cursor-pointer overflow-hidden">
                <input
                  type="range" min="0" max="1" step="0.01"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full" style={{ width: `${(muted ? 0 : volume) * 100}%` }} />
              </div>
            </div>

            {/* Close */}
            <button onClick={() => setIsVisible(false)} className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 15 15" fill="none">
                <path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={src} controlsList="nodownload noplaybackrate" onContextMenu={(e) => e.preventDefault()} preload="metadata" className="hidden" />
    </motion.div>
  );
}
