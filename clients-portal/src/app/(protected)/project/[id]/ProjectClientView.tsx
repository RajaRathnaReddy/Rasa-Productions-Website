"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SecureAudioPlayer } from "@/components/project/SecureAudioPlayer";
import { FileAudio, History, LayoutGrid, MessageSquare, Music2, Users, CheckCircle2, CircleDot } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const iconStyles: Record<string, string> = {
  emerald: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]",
  indigo: "bg-indigo-500/15 border-indigo-500/40 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.35)]",
  violet: "bg-violet-500/15 border-violet-500/40 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.35)]",
  rose: "bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.35)]",
  cyan: "bg-cyan-500/15 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]",
};

export function ProjectClientView({ project, events, activeAudioUrl }: { project: any, events: any[], activeAudioUrl: string }) {
  const [feedback, setFeedback] = useState("");

  // Map database events to timeline styles
  const mappedEvents = events.map((ev, index) => {
    let color = "cyan";
    let Icon = CircleDot;
    let chip = "Update";
    let chipStyle = "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";

    if (ev.type.toLowerCase().includes("mix") || ev.audio_url) {
      color = "indigo"; Icon = FileAudio; chip = "Audio"; chipStyle = "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
    } else if (ev.type.toLowerCase().includes("feedback") || ev.type.toLowerCase().includes("revision")) {
      color = "rose"; Icon = MessageSquare; chip = "Pending"; chipStyle = "bg-rose-500/20 text-rose-300 border-rose-500/30";
    }

    return {
      id: ev.id,
      Icon,
      color,
      label: ev.title,
      sub: ev.description,
      date: new Date(ev.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }),
      time: new Date(ev.created_at).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', hour12: false }),
      chip,
      chipStyle,
      action: ev.type.toLowerCase().includes("mix") ? "view" : null // Simple rule for MVP
    };
  });

  return (
    <div className="w-full animate-in fade-in duration-700 pb-20">

      {/* ── COMPACT HERO ── */}
      <div className="relative w-full h-[20vh] min-h-[140px] flex items-center rounded-2xl overflow-hidden mb-10 border border-white/5 shadow-[0_12px_50px_rgba(0,0,0,0.5)] group">
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

      {/* Audio Player - Plays active signed URL */}
      <SecureAudioPlayer src={activeAudioUrl} title={project.song_title || "Unknown Track"} coverUrl={project.cover_url} />

      {/* ── MAIN GRID ── */}
      <div className="max-w-[1400px] mx-auto w-full pb-32 grid grid-cols-1 lg:grid-cols-3 gap-10 px-2 md:px-8 mt-10">

        {/* Left: Alternating Timeline */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400 mb-8 border-b border-white/8 pb-3 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-rose-400" /> Project Timeline
          </h2>

          <div className="relative">
            {/* Center glowing spine */}
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
                      <div className={`text-sm text-muted-foreground my-2 ${isRight ? "" : "text-right"}`}>{evt.sub}</div>
                      
                      {evt.action && (
                        <div className={isRight ? "" : "flex justify-end"}>
                          <ActionButton action={evt.action as any} feedback={feedback} setFeedback={setFeedback} />
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

          <Card className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-5 rounded-2xl">
            <h3 className="text-[10px] font-black text-white/35 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-indigo-400" /> Audio Versions
            </h3>
            <div className="space-y-2">
              {events.filter((e) => e.audio_url).map((ev, i, arr) => (
                <button key={ev.id} className={`w-full flex items-center justify-between px-4 h-11 rounded-xl transition-all text-sm font-semibold ${
                  i === 0 
                  ? "bg-indigo-500/15 border border-indigo-500/30 text-white" 
                  : "bg-white/5 border border-white/8 hover:bg-white/10 text-white/55 hover:text-white"
                }`}>
                  <span className="truncate max-w-[150px] text-left">{ev.title}</span>
                  {i === 0 && <span className="text-[9px] bg-indigo-500 text-white font-black px-2 py-0.5 rounded-full shrink-0">Active</span>}
                </button>
              ))}
              {events.filter((e) => e.audio_url).length === 0 && (
                <div className="text-xs text-center text-muted-foreground p-2">Wait for the admin to upload an audio file.</div>
              )}
            </div>
          </Card>

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

function ActionButton({ action, feedback, setFeedback }: {
  action: "view" | "lyrics" | "feedback";
  feedback: string;
  setFeedback: (v: string) => void;
}) {
  if (action === "view") return (
    <Dialog>
      <DialogTrigger className="text-xs bg-indigo-500/15 border border-indigo-500/25 hover:bg-indigo-500/25 text-indigo-300 hover:text-white h-8 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition-all mt-2">
        <FileAudio className="w-3 h-3" /> View Admin Notes
      </DialogTrigger>
      <DialogContent className="bg-[#13131f]/98 backdrop-blur-3xl border-white/10">
        <DialogHeader><DialogTitle className="text-white font-black">Admin Notes</DialogTitle></DialogHeader>
        <p className="text-white/60 text-sm leading-relaxed mt-4">Please review the vocal mixing. The instrumental has been mastered to -14 LUFS. Look out for the transition at 1:45.</p>
      </DialogContent>
    </Dialog>
  );
  if (action === "lyrics") return (
    <Dialog>
      <DialogTrigger className="text-xs bg-violet-500/15 border border-violet-500/25 hover:bg-violet-500/25 text-violet-300 hover:text-white h-8 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition-all mt-2">
        <Music2 className="w-3 h-3" /> Submit Lyrics
      </DialogTrigger>
      <DialogContent className="bg-[#13131f]/98 backdrop-blur-3xl border-white/10">
        <DialogHeader><DialogTitle className="text-white font-black">Submit Lyrics</DialogTitle></DialogHeader>
        <Textarea placeholder="Paste your lyrics here..." className="min-h-[200px] mt-4 bg-white/5 border-white/10 text-white placeholder:text-white/25" />
        <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white mt-4">Save Lyrics</Button>
      </DialogContent>
    </Dialog>
  );
  return (
    <Dialog>
      <DialogTrigger className="text-xs bg-rose-500/15 border border-rose-500/25 hover:bg-rose-500/25 text-rose-300 hover:text-white h-8 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition-all mt-2">
        <MessageSquare className="w-3 h-3" /> Add Corrections
      </DialogTrigger>
      <DialogContent className="bg-[#13131f]/98 backdrop-blur-3xl border-white/10">
        <DialogHeader><DialogTitle className="text-white font-black">Feedback Corrections</DialogTitle></DialogHeader>
        <Textarea placeholder="e.g. at 2:15, the bass is too loud..." className="min-h-[150px] mt-4 bg-white/5 border-white/10 text-white placeholder:text-white/25" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
        <Button onClick={() => { alert("Feedback: " + feedback); setFeedback(""); }} className="w-full bg-gradient-to-r from-rose-600 to-orange-600 text-white mt-4">Send Corrections</Button>
      </DialogContent>
    </Dialog>
  );
}
