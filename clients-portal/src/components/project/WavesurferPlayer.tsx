"use client";

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, Volume2, VolumeX, SkipBack, Clock } from "lucide-react";

export type WavesurferPlayerHandle = {
  getCurrentTime: () => number;
  seekTo: (seconds: number) => void;
};

type Props = {
  src: string;
  title: string;
  coverUrl?: string;
};

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const WavesurferPlayer = forwardRef<WavesurferPlayerHandle, Props>(
  function WavesurferPlayer({ src, title, coverUrl }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => wavesurferRef.current?.getCurrentTime() ?? 0,
      seekTo: (seconds: number) => {
        const ws = wavesurferRef.current;
        if (ws && ws.getDuration() > 0) {
          ws.seekTo(seconds / ws.getDuration());
        }
      },
    }));

    useEffect(() => {
      if (!containerRef.current || !src) return;
      setIsLoading(true);
      setIsReady(false);
      setLoadError(false);
      setIsPlaying(false);

      const ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "rgba(99,102,241,0.35)",
        progressColor: "rgba(139,92,246,0.85)",
        cursorColor: "rgba(196,181,253,0.9)",
        cursorWidth: 2,
        barWidth: 2,
        barGap: 1.5,
        barRadius: 3,
        height: 64,
        normalize: true,
        interact: true,
        backend: "WebAudio",
      });

      ws.load(src);

      ws.on("ready", () => {
        setDuration(ws.getDuration());
        setIsLoading(false);
        setIsReady(true);
        ws.setVolume(volume);
      });

      ws.on("audioprocess", () => setCurrentTime(ws.getCurrentTime()));
      ws.on("interaction", () => setCurrentTime(ws.getCurrentTime()));
      ws.on("play", () => setIsPlaying(true));
      ws.on("pause", () => setIsPlaying(false));
      ws.on("finish", () => setIsPlaying(false));
      ws.on("error", () => { setLoadError(true); setIsLoading(false); });

      wavesurferRef.current = ws;
      return () => { ws.destroy(); wavesurferRef.current = null; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    const togglePlay = useCallback(() => wavesurferRef.current?.playPause(), []);
    const handleRestart = useCallback(() => wavesurferRef.current?.seekTo(0), []);
    const handleVolume = useCallback((v: number) => {
      setVolume(v);
      setIsMuted(false);
      wavesurferRef.current?.setVolume(v);
    }, []);
    const handleMute = useCallback(() => {
      const next = !isMuted;
      setIsMuted(next);
      wavesurferRef.current?.setVolume(next ? 0 : volume);
    }, [isMuted, volume]);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div className="sticky top-16 z-30 w-full mb-6">
        <div className="mx-auto max-w-[1400px] px-2 md:px-8">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a1a]/95 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.7)]">
            {/* Purple glow accent */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
            </div>

            <div className="flex items-center gap-4 px-4 md:px-6 py-4">
              {/* Album art */}
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-900/80 to-fuchsia-900/60 flex items-center justify-center">
                    <span className="text-white/40 text-lg font-black">♪</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleRestart}
                  disabled={!isReady}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all disabled:opacity-30"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={togglePlay}
                  disabled={!isReady}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all disabled:opacity-40"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
              </div>

              {/* Time */}
              <div className="shrink-0 hidden sm:flex items-center gap-1 font-mono text-[11px] text-white/35 w-[90px]">
                <span className="text-white/70">{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Waveform */}
              <div className="flex-1 min-w-0 relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center gap-3 z-10">
                    <div className="flex gap-1 items-end h-8">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-indigo-500/30 rounded-sm animate-pulse"
                          style={{
                            height: `${20 + Math.random() * 60}%`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-white/30 text-xs">Loading waveform…</span>
                  </div>
                )}
                {loadError && (
                  <div className="flex items-center justify-center h-16 text-rose-400 text-xs gap-2">
                    <Clock className="w-3.5 h-3.5" /> Unable to load audio
                  </div>
                )}
                <div ref={containerRef} className={isLoading || loadError ? "opacity-0" : "opacity-100"} />
              </div>

              {/* Volume */}
              <div className="shrink-0 hidden md:flex items-center gap-2">
                <button
                  onClick={handleMute}
                  className="text-white/30 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={e => handleVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 accent-indigo-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Mini progress bar at bottom */}
            <div className="h-[2px] bg-white/5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

WavesurferPlayer.displayName = "WavesurferPlayer";
export default WavesurferPlayer;
