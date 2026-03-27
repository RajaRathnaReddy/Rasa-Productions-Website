"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Mic2, Send, CheckCircle2, Lock, Loader2, FileText, Music2, Sparkles } from "lucide-react";

export default function SubmitLyricsPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [lyrics, setLyrics] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [charCount, setCharCount] = useState(0);

  // Load client's projects
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("projects")
        .select("id, song_title, project_title, status, cover_url, lyrics_locked")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });
      setProjects(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleProjectSelect = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    setSelectedProject(proj || null);
    setIsSuccess(false);
  };

  const handleLyricsChange = (val: string) => {
    setLyrics(val);
    setCharCount(val.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !lyrics.trim()) return;
    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsSubmitting(false); return; }

    // Insert lyrics submission
    const { error } = await supabase.from("lyrics_submissions").insert({
      project_id: selectedProject.id,
      client_id: user.id,
      lyrics_text: lyrics.trim(),
    });

    if (!error) {
      // Auto-lock the project
      await supabase.from("projects").update({ lyrics_locked: true }).eq("id", selectedProject.id);
      setIsSuccess(true);
      setLyrics("");
      setCharCount(0);
    } else {
      alert("Submission failed: " + error.message);
    }
    setIsSubmitting(false);
  };

  const wordCount = lyrics.trim() ? lyrics.trim().split(/\s+/).length : 0;
  const lineCount = lyrics.trim() ? lyrics.trim().split("\n").length : 0;

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16 pt-8">
      
      {/* ── HERO HEADER ── */}
      <div className="mb-10 text-center space-y-4 relative">
        <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/30 to-fuchsia-600/20 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.25)] mb-4">
            <Mic2 className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Submit{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400">
              Lyrics
            </span>
          </h1>
          <p className="text-base text-white/40 font-medium max-w-md mx-auto mt-3 leading-relaxed">
            Finalized your writing session? Submit your drafted lyrics so we can prep them for vocal tracking.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="text-center py-16 px-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 space-y-5"
          >
            <div className="w-20 h-20 bg-emerald-500/15 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(52,211,153,0.25)] mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white mb-2">Lyrics Submitted!</h2>
              <p className="text-white/50 text-sm max-w-sm mx-auto">Your lyrics have been received. The studio has been notified and your submission is now locked for review.</p>
            </div>
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit mx-auto">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-amber-300 font-bold">Submission locked until reviewed by the studio</span>
            </div>
            <button
              onClick={() => { setIsSuccess(false); setSelectedProject(null); }}
              className="mt-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              Submit Another Project
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Project Selector */}
              <div className="rounded-2xl border border-white/8 bg-[#0d0d1e]/80 backdrop-blur-xl p-5 space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" /> Select Project
                </label>

                {loading ? (
                  <div className="flex items-center gap-2 text-white/30 text-sm py-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading your projects…
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-white/30 text-sm py-2">No projects found. Your producer hasn&apos;t set up a project for you yet.</div>
                ) : (
                  <div className="grid gap-2">
                    {projects.map(proj => (
                      <button
                        type="button"
                        key={proj.id}
                        onClick={() => handleProjectSelect(proj.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          selectedProject?.id === proj.id
                            ? "bg-indigo-500/15 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                            : proj.lyrics_locked
                            ? "bg-amber-500/5 border-amber-500/20 opacity-60 cursor-not-allowed"
                            : "bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-white/15"
                        }`}
                        disabled={proj.lyrics_locked}
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/30 border border-white/8 flex items-center justify-center shrink-0">
                          {proj.cover_url
                            ? <img src={proj.cover_url} alt="" className="w-full h-full object-cover" />
                            : <Music2 className="w-4 h-4 text-white/20" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white truncate">{proj.song_title}</div>
                          <div className="text-xs text-white/30 truncate">{proj.project_title}</div>
                        </div>
                        {proj.lyrics_locked && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 shrink-0">
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span className="text-[9px] text-amber-300 font-bold">LOCKED</span>
                          </div>
                        )}
                        {selectedProject?.id === proj.id && (
                          <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Lyrics Textarea */}
              {selectedProject && !selectedProject.lyrics_locked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/8 bg-[#0d0d1e]/80 backdrop-blur-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" /> Paste Your Lyrics
                    </label>
                    {lyrics && (
                      <div className="flex items-center gap-3 text-[9px] font-mono text-white/25">
                        <span>{wordCount} words</span>
                        <span>{lineCount} lines</span>
                        <span>{charCount} chars</span>
                      </div>
                    )}
                  </div>
                  <textarea
                    placeholder={"[Verse 1]\nWrite your lyrics here...\n\n[Chorus]\n..."}
                    className="w-full min-h-[320px] bg-white/[0.03] border border-white/8 rounded-xl p-4 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] resize-y font-mono leading-relaxed transition-all"
                    value={lyrics}
                    onChange={e => handleLyricsChange(e.target.value)}
                    required
                  />
                  <div className="text-[10px] text-white/20 leading-relaxed">
                    💡 Tip: Use sections like [Verse 1], [Chorus], [Bridge] to structure your lyrics clearly.
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              {selectedProject && !selectedProject.lyrics_locked && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  type="submit"
                  disabled={isSubmitting || !lyrics.trim()}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-black text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</>
                  ) : (
                    <><Send className="w-5 h-5" /> Submit Final Lyrics</>
                  )}
                </motion.button>
              )}

              {selectedProject?.lyrics_locked && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-200">Lyrics Locked</p>
                    <p className="text-xs text-amber-300/60">You&apos;ve already submitted lyrics for this project. The studio will unlock it once they&apos;ve reviewed your submission.</p>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
