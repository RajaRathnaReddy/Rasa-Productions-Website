"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { FileAudio, History, LayoutGrid, MessageSquare, Music2, Users, CheckCircle2, CircleDot, Send, Loader2, Stamp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import type { WavesurferPlayerHandle } from "@/components/project/WavesurferPlayer";

// Dynamic import — wavesurfer.js is browser-only
const WavesurferPlayer = dynamic(() => import("@/components/project/WavesurferPlayer"), {
  ssr: false,
  loading: () => (
    <div className="sticky top-16 z-30 mx-auto max-w-[1400px] px-2 md:px-8 mb-6">
      <div className="h-[90px] rounded-2xl bg-[#0a0a1a]/95 border border-white/10 animate-pulse flex items-center justify-center">
        <span className="text-white/20 text-sm">Initialising waveform…</span>
      </div>
    </div>
  ),
});

const iconStyles: Record<string, string> = {
  emerald: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]",
  indigo: "bg-indigo-500/15 border-indigo-500/40 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.35)]",
  violet: "bg-violet-500/15 border-violet-500/40 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.35)]",
  rose: "bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.35)]",
  cyan: "bg-cyan-500/15 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]",
};

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Parse leading timestamp like [1:24] from a description */
function parseTimestamp(description: string): { seconds: number | null; text: string } {
  const match = description?.match(/^\[(\d+):(\d{2})\]\s*/);
  if (match) {
    const seconds = parseInt(match[1]) * 60 + parseInt(match[2]);
    const text = description.slice(match[0].length);
    return { seconds, text };
  }
  return { seconds: null, text: description || "" };
}

export function ProjectClientView({ project, events: initialEvents, activeAudioUrl: initialAudioUrl }: { project: any, events: any[], activeAudioUrl: string }) {
  const supabase = createClient();
  const playerRef = useRef<WavesurferPlayerHandle>(null);

  const [events, setEvents] = useState(initialEvents);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(initialAudioUrl);
  const [activeAudioId, setActiveAudioId] = useState(() => initialEvents.find((e: any) => e.audio_url)?.id || null);
  const [feedback, setFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [capturedTimestamp, setCapturedTimestamp] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSwitchAudio = (ev: any) => {
    setCurrentAudioUrl(ev.audio_url);
    setActiveAudioId(ev.id);
    setCapturedTimestamp(null);
  };

  // Capture current playback time and stamp it onto the comment
  const handleCaptureTimestamp = useCallback(() => {
    const t = playerRef.current?.getCurrentTime() ?? 0;
    setCapturedTimestamp(Math.floor(t));
  }, []);

  const handleClearTimestamp = useCallback(() => setCapturedTimestamp(null), []);

  // Seek to a specific second when clicking a timestamp badge
  const handleSeekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds);
  }, []);

  const handleSendFeedback = async (eventId: string) => {
    if (!feedback.trim()) return;
    setFeedbackLoading(true);

    // Prefix with timestamp if captured
    const prefix = capturedTimestamp !== null ? `[${formatTimestamp(capturedTimestamp)}] ` : "";
    const fullDescription = prefix + feedback.trim();

    const newEvent = {
      id: `temp-${Date.now()}`,
      project_id: project.id,
      type: "Client Feedback",
      title: `Feedback from ${project.client_name}`,
      description: fullDescription,
      audio_url: null,
      created_at: new Date().toISOString(),
    };
    // Optimistically add to timeline immediately
    setEvents((prev: any[]) => [newEvent, ...prev]);
    setFeedback("");
    setCapturedTimestamp(null);
    showToast("✅ Feedback sent to the studio!");

    const { data, error } = await supabase.from("events").insert({
      project_id: project.id,
      type: "Client Feedback",
      title: `Feedback from ${project.client_name}`,
      description: newEvent.description,
    }).select().single();

    if (error) {
      setEvents((prev: any[]) => prev.filter((e: any) => e.id !== newEvent.id));
      showToast("❌ Failed to send feedback.");
    } else if (data) {
      setEvents((prev: any[]) => prev.map((e: any) => e.id === newEvent.id ? data : e));
      setFeedbackSent(true);
      setTimeout(() => setFeedbackSent(false), 4000);
    }
    setFeedbackLoading(false);
  };

  // Map database events to timeline styles
  const mappedEvents = events.map((ev: any, index: number) => {
    let color = "cyan";
    let Icon = CircleDot;
    let chip = "Update";
    let chipStyle = "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";

    if (ev.type.toLowerCase().includes("mix") || ev.audio_url) {
      color = "indigo"; Icon = FileAudio; chip = "Audio"; chipStyle = "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
    } else if (ev.type.toLowerCase().includes("feedback") || ev.type.toLowerCase().includes("revision")) {
      color = "rose"; Icon = MessageSquare; chip = "Feedback"; chipStyle = "bg-rose-500/20 text-rose-300 border-rose-500/30";
    } else if (ev.type.toLowerCase().includes("master") || ev.type.toLowerCase().includes("approved")) {
      color = "emerald"; Icon = CheckCircle2; chip = "Done"; chipStyle = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    }

    const { seconds: tsSeconds, text: tsText } = parseTimestamp(ev.description);

    return {
      id: ev.id,
      Icon,
      color,
      label: ev.title,
      sub: tsText,
      timestampSeconds: tsSeconds,
      date: new Date(ev.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }),
      time: new Date(ev.created_at).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', hour12: false }),
      chip,
      chipStyle,
      hasAudio: !!ev.audio_url,
      rawEv: ev,
    };
  });

  const audioVersions = events.filter((e: any) => e.audio_url);

  return (
    <div className="w-full animate-in fade-in duration-700 pb-20 relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#1a1a2e] border border-white/10 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-2xl shadow-black/50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── COMPACT HERO ── */}
      <div className="relative w-full h-[20vh] min-h-[140px] flex items-center rounded-2xl overflow-hidden mb-6 border border-white/5 shadow-[0_12px_50px_rgba(0,0,0,0.5)] group">
        {project.cover_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.cover_url} alt="banner" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[2px] scale-105 group-hover:scale-100 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080812] via-[#080812]/75 to-[#080812]/25" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 to-[#080812]" />
        )}
        <div className="relative z-10 flex items-center gap-5 px-6 md:px-10 w-full">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-white/10 shadow-xl flex-shrink-0">
            {project.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.cover_url} alt="cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-indigo-900/60 flex items-center justify-center"><Music2 className="w-7 h-7 text-indigo-400" /></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.18em] mb-1.5 ${
              project.status === "Final Delivered" ? "bg-emerald-500 text-white" :
              project.status === "Awaiting Client Feedback" ? "bg-amber-400 text-amber-950" :
              "bg-indigo-600 text-white"
            }`}>{project.status}</span>
            {project.status === "Awaiting Client Feedback" && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-[9px] text-amber-300 font-bold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Action Required
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight truncate">{project.song_title}</h1>
            <p className="text-sm text-white/35 font-medium mt-0.5 truncate">{project.project_title}</p>
          </div>
          <div className="hidden md:flex gap-5 shrink-0 pr-4">
            {[
              ["Tempo", project.bpm || "--"],
              ["Key", project.key || "--"],
              ["Engineer", "Rasa Prod."]
            ].map(([label, value], i) => (
              <div key={i} className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest">{label}</span>
                <span className={`text-base font-black ${i === 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400" : "text-white"}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WAVESURFER PLAYER ── */}
      <WavesurferPlayer
        ref={playerRef}
        src={currentAudioUrl}
        title={project.song_title || "Unknown Track"}
        coverUrl={project.cover_url}
      />

      {/* ── MAIN GRID ── */}
      <div className="max-w-[1400px] mx-auto w-full pb-32 grid grid-cols-1 lg:grid-cols-3 gap-10 px-2 md:px-8 mt-10">

        {/* Left: Timeline */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400 mb-8 border-b border-white/8 pb-3 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-rose-400" /> Project Timeline
          </h2>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-fuchsia-500/30 to-transparent shadow-[0_0_8px_rgba(99,102,241,0.4)]" />

            <div className="space-y-8">
              {mappedEvents.length === 0 && (
                <div className="text-center text-muted-foreground w-full py-10 opacity-50 relative z-10 bg-[#080812]">
                  No events on the timeline yet.
                </div>
              )}
              {mappedEvents.map((evt, idx) => {
                const isRight = idx % 2 === 0;
                const { Icon } = evt;

                const CardContent = (
                  <div className="rainbow-border-hover card-beam rounded-2xl relative">
                    <motion.div
                      whileHover={{ y: -3, scale: 1.015 }}
                      transition={{ type: "spring", stiffness: 600, damping: 28 }}
                      className={`group relative rounded-2xl border p-4 bg-[#0d0d1e] border-white/10 transition-colors duration-150 cursor-default`}
                    >
                      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/15 transition-all duration-500 rounded-full" />
                      
                      <div className={`flex items-start justify-between gap-2 mb-1 ${isRight ? "" : "flex-row-reverse"}`}>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-bold text-white leading-tight block">{evt.label}</span>
                          <span className="text-[9px] font-mono text-white/25">{evt.date} · {evt.time}</span>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${evt.chipStyle}`}>{evt.chip}</span>
                      </div>

                      {/* Timestamp badge — clickable to seek */}
                      {evt.timestampSeconds !== null && (
                        <button
                          onClick={() => handleSeekTo(evt.timestampSeconds!)}
                          title={`Seek to ${formatTimestamp(evt.timestampSeconds!)}`}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/25 text-fuchsia-300 text-[9px] font-black hover:bg-fuchsia-500/30 hover:text-white transition-all cursor-pointer mb-1.5 ${isRight ? "" : "float-right"}`}
                        >
                          <Stamp className="w-2.5 h-2.5" /> {formatTimestamp(evt.timestampSeconds!)}
                        </button>
                      )}
                      
                      <div className={`text-sm text-muted-foreground my-2 clear-both ${isRight ? "" : "text-right"}`}>{evt.sub}</div>
                      
                      {evt.hasAudio && (
                        <div className={isRight ? "" : "flex justify-end"}>
                          <button
                            onClick={() => handleSwitchAudio(evt.rawEv)}
                            className={`text-xs h-8 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition-all mt-2 ${
                              activeAudioId === evt.id 
                              ? "bg-indigo-500/30 border border-indigo-500/50 text-indigo-200" 
                              : "bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/25 text-indigo-300 hover:text-white"
                            }`}
                          >
                            {activeAudioId === evt.id ? (
                              <><span className="flex gap-0.5 items-end h-3"><span className="w-0.5 animate-[equalizer_0.8s_ease-in-out_infinite] bg-indigo-400 rounded-sm" style={{height:'50%'}} /><span className="w-0.5 animate-[equalizer_0.8s_ease-in-out_0.2s_infinite] bg-indigo-400 rounded-sm" style={{height:'100%'}} /><span className="w-0.5 animate-[equalizer_0.8s_ease-in-out_0.4s_infinite] bg-indigo-400 rounded-sm" style={{height:'70%'}} /></span> Now Playing</>
                            ) : (
                              <><FileAudio className="w-3 h-3" /> Play This Version</>
                            )}
                          </button>
                        </div>
                      )}

                      {(evt.chip === "Feedback" || evt.rawEv.type === "Feedback Needed") && (
                        <div className={isRight ? "" : "flex justify-end"}>
                          <Dialog>
                            <DialogTrigger className="text-xs bg-rose-500/15 border border-rose-500/25 hover:bg-rose-500/25 text-rose-300 hover:text-white h-8 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition-all mt-2">
                              <MessageSquare className="w-3 h-3" /> Add Corrections
                            </DialogTrigger>
                            <DialogContent className="bg-[#13131f]/98 backdrop-blur-3xl border-white/10">
                              <DialogHeader><DialogTitle className="text-white font-black">Send Feedback to Studio</DialogTitle></DialogHeader>
                              {feedbackSent ? (
                                <div className="text-center py-8 space-y-3">
                                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                                  <p className="text-white font-semibold">Feedback received!</p>
                                  <p className="text-white/40 text-sm">The studio has been notified.</p>
                                </div>
                              ) : (
                                <>
                                  {/* Timestamp capture row */}
                                  <div className="flex items-center gap-3 mt-2">
                                    <button
                                      type="button"
                                      onClick={handleCaptureTimestamp}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fuchsia-500/15 border border-fuchsia-500/25 text-fuchsia-300 text-xs font-bold hover:bg-fuchsia-500/30 hover:text-white transition-all"
                                    >
                                      <Stamp className="w-3 h-3" /> Stamp Current Time
                                    </button>
                                    {capturedTimestamp !== null ? (
                                      <span className="flex items-center gap-1.5 text-xs text-fuchsia-300 font-mono">
                                        ⏱ {formatTimestamp(capturedTimestamp)}
                                        <button onClick={handleClearTimestamp} className="text-white/25 hover:text-rose-400 transition-colors text-[10px]">✕</button>
                                      </span>
                                    ) : (
                                      <span className="text-white/25 text-[10px]">No timestamp — click to stamp current playback position</span>
                                    )}
                                  </div>
                                  <Textarea 
                                    placeholder="e.g. the bass is too loud here. Also the hi-hat feels slightly off..." 
                                    className="min-h-[150px] mt-3 bg-white/5 border-white/10 text-white placeholder:text-white/25" 
                                    value={feedback} 
                                    onChange={(e) => setFeedback(e.target.value)} 
                                  />
                                  <Button 
                                    onClick={() => handleSendFeedback(evt.id)} 
                                    disabled={feedbackLoading || !feedback.trim()}
                                    className="w-full bg-gradient-to-r from-rose-600 to-orange-600 text-white mt-4 gap-2"
                                  >
                                    {feedbackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {feedbackLoading ? "Sending..." : "Send to Studio"}
                                  </Button>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </motion.div>
                  </div>
                );

                return (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, x: isRight ? -24 : 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.12, duration: 0.45, ease: "easeOut" }}
                    className="relative flex items-center"
                  >
                    <div className="w-[calc(50%-28px)] pr-5">{!isRight && CardContent}</div>
                    <div className="relative z-10 flex-shrink-0 w-14 flex justify-center">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center ${iconStyles[evt.color]} transition-shadow duration-300`}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.div>
                    </div>
                    <div className="w-[calc(50%-28px)] pl-5">{isRight && CardContent}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Action Center */}
        <div className="space-y-5">
          <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-7 border-b border-white/8 pb-3">Action Center</h2>

          {/* Audio Versions */}
          <Card className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-5 rounded-2xl">
            <h3 className="text-[10px] font-black text-white/35 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-indigo-400" /> Audio Versions
            </h3>
            <div className="space-y-2">
              {audioVersions.map((ev: any) => (
                <button
                  key={ev.id}
                  onClick={() => handleSwitchAudio(ev)}
                  className={`w-full flex items-center justify-between px-4 h-11 rounded-xl transition-all text-sm font-semibold ${
                    activeAudioId === ev.id
                    ? "bg-indigo-500/20 border border-indigo-500/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]" 
                    : "bg-white/5 border border-white/8 hover:bg-white/10 text-white/55 hover:text-white"
                  }`}
                >
                  <span className="truncate max-w-[150px] text-left">{ev.title}</span>
                  {activeAudioId === ev.id ? (
                    <span className="flex gap-0.5 items-end h-3 shrink-0">
                      <span className="w-0.5 bg-indigo-400 rounded-sm" style={{height:'50%', animation: 'equalizer 0.8s ease-in-out infinite'}} />
                      <span className="w-0.5 bg-indigo-400 rounded-sm" style={{height:'100%', animation: 'equalizer 0.8s ease-in-out 0.2s infinite'}} />
                      <span className="w-0.5 bg-indigo-400 rounded-sm" style={{height:'70%', animation: 'equalizer 0.8s ease-in-out 0.4s infinite'}} />
                    </span>
                  ) : (
                    <FileAudio className="w-3.5 h-3.5 shrink-0 text-white/20" />
                  )}
                </button>
              ))}
              {audioVersions.length === 0 && (
                <div className="text-xs text-center text-muted-foreground p-2">Wait for the admin to upload an audio file.</div>
              )}
            </div>
          </Card>

          {/* Quick Feedback with timestamp */}
          <Card className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-5 rounded-2xl">
            <h3 className="text-[10px] font-black text-white/35 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-rose-400" /> Quick Note to Studio
            </h3>
            
            {/* Timestamp capture */}
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={handleCaptureTimestamp}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-[10px] font-bold hover:bg-fuchsia-500/25 hover:text-white transition-all"
              >
                <Stamp className="w-3 h-3" /> Stamp Time
              </button>
              {capturedTimestamp !== null ? (
                <span className="flex items-center gap-1 text-[10px] text-fuchsia-300 font-mono bg-fuchsia-500/10 px-2 py-1 rounded-lg border border-fuchsia-500/20">
                  ⏱ {formatTimestamp(capturedTimestamp)}
                  <button onClick={handleClearTimestamp} className="text-white/25 hover:text-rose-400 ml-1 transition-colors">✕</button>
                </span>
              ) : (
                <span className="text-white/20 text-[9px]">Press while listening to stamp the time</span>
              )}
            </div>

            <Textarea
              placeholder="Any thoughts? Leave a quick note for the team..."
              className="min-h-[90px] bg-white/5 border-white/10 text-white placeholder:text-white/20 text-sm resize-none"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />
            <Button 
              onClick={() => handleSendFeedback("")} 
              disabled={feedbackLoading || !feedback.trim()}
              size="sm"
              className="w-full mt-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white gap-2 h-9"
            >
              {feedbackLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              {feedbackLoading ? "Sending..." : "Send Note"}
            </Button>
          </Card>

          {/* Project Team */}
          <Card className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-5 rounded-2xl">
            <h3 className="text-[10px] font-black text-white/35 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-rose-400" /> Project Team
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-600/30 flex items-center justify-center border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.25)] shrink-0">
                  <span className="text-indigo-300 font-black text-xs">RP</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Rasa Productions</p>
                  <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest">Lead Producer</p>
                </div>
              </div>
              <div className="w-full h-px bg-white/6" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-600/30 flex items-center justify-center border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)] shrink-0">
                  <span className="text-amber-300 font-black text-xs">YOU</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{project.client_name}</p>
                  <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest">Client</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
