"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  FolderOpen, Users, Clock, CheckCircle2, MessageSquare, 
  PlusCircle, ExternalLink, Activity, TrendingUp, Zap,
  AlertTriangle, Mail, X, Loader2, Send
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const STATUS_COLORS: Record<string, string> = {
  "Draft": "text-zinc-400 bg-zinc-800/60 border-zinc-700/50",
  "In Review": "text-amber-300 bg-amber-950/60 border-amber-800/50",
  "Awaiting Client Feedback": "text-sky-300 bg-sky-950/60 border-sky-800/50",
  "Revision Requested": "text-orange-300 bg-orange-950/60 border-orange-800/50",
  "Approved": "text-emerald-300 bg-emerald-950/60 border-emerald-800/50",
  "Final Delivered": "text-violet-300 bg-violet-950/60 border-violet-800/50",
};

const EVENT_TYPE_ICONS: Record<string, string> = {
  "New Mix (V1.0)": "🎵",
  "Stem Request": "🎛️",
  "Feedback Needed": "💬",
  "Mastering Completed": "✅",
  "Client Feedback": "📝",
  "Update": "📌",
};

type Counts = {
  totalProjects: number;
  uniqueClients: number;
  inReview: number;
  awaitingFeedback: number;
  approved: number;
  delivered: number;
};

type Props = {
  projects: any[];
  events: any[];
  counts: Counts;
};

export function AdminOverviewClient({ projects, events, counts }: Props) {
  const supabase = createClient();
  const { totalProjects, uniqueClients, inReview, awaitingFeedback, approved, delivered } = counts;

  const statCards = [
    { label: "Total Projects",    value: totalProjects,    icon: FolderOpen,    color: "from-indigo-500/20 to-indigo-600/10",   border: "border-indigo-500/30",   iconColor: "text-indigo-400",   href: "/admin/projects" },
    { label: "Active Clients",    value: uniqueClients,    icon: Users,         color: "from-fuchsia-500/20 to-fuchsia-600/10", border: "border-fuchsia-500/30", iconColor: "text-fuchsia-400", href: "/admin/clients" },
    { label: "In Review",         value: inReview,         icon: Clock,         color: "from-amber-500/20 to-amber-600/10",    border: "border-amber-500/30",   iconColor: "text-amber-400",   href: "/admin/projects" },
    { label: "Awaiting Feedback", value: awaitingFeedback, icon: MessageSquare, color: "from-sky-500/20 to-sky-600/10",        border: "border-sky-500/30",     iconColor: "text-sky-400",     href: "/admin/projects" },
    { label: "Approved",          value: approved,         icon: TrendingUp,    color: "from-emerald-500/20 to-emerald-600/10",border: "border-emerald-500/30", iconColor: "text-emerald-400", href: "/admin/projects" },
    { label: "Final Delivered",   value: delivered,        icon: CheckCircle2,  color: "from-violet-500/20 to-violet-600/10", border: "border-violet-500/30", iconColor: "text-violet-400",  href: "/admin/projects" },
  ];
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ success: boolean; message: string } | null>(null);

  // Projects needing action
  const actionRequired = projects.filter(p => 
    p.status === "Revision Requested" || p.status === "Awaiting Client Feedback"
  );
  const recentProjects = projects.slice(0, 5);

  // Completion ring
  const completionPct = totalProjects > 0 ? Math.round((delivered / totalProjects) * 100) : 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPct / 100) * circumference;

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviteLoading(true);
    // Call the server action endpoint
    const res = await fetch("/api/invite-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });
    const data = await res.json();
    if (res.ok) {
      setInviteResult({ success: true, message: `Invite sent to ${inviteEmail}!` });
      setInviteEmail("");
    } else {
      setInviteResult({ success: false, message: data.error || "Failed to send invite." });
    }
    setInviteLoading(false);
    setTimeout(() => setInviteResult(null), 4000);
  };

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Overview</h1>
          </div>
          <p className="text-muted-foreground pl-[52px]">Your studio command centre — everything at a glance.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all duration-200"
          >
            <Mail className="w-4 h-4 text-fuchsia-400" />
            Invite Client
          </button>
          <Link href="/admin/projects/new">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-200">
              <PlusCircle className="w-4 h-4" />
              New Project
            </button>
          </Link>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowInviteModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#0f0f1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="h-[2px] bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-black text-white">Invite a Client</h2>
                    <p className="text-xs text-white/40 mt-0.5">They'll receive a secure invite email to set up their account.</p>
                  </div>
                  <button onClick={() => setShowInviteModal(false)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <AnimatePresence>
                  {inviteResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${inviteResult.success ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300" : "bg-rose-500/10 border border-rose-500/25 text-rose-300"}`}
                    >
                      {inviteResult.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleInvite()}
                      placeholder="client@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/60 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleInvite}
                    disabled={inviteLoading || !inviteEmail.trim()}
                    className="relative w-full h-11 rounded-xl font-bold text-sm text-white overflow-hidden group transition-all disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-fuchsia-600 group-hover:from-indigo-500 group-hover:to-fuchsia-500 transition-all" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {inviteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {inviteLoading ? "Sending Invite..." : "Send Invite"}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat: any) => (
          <Link key={stat.label} href={stat.href} className="group block">
            <div className={`relative overflow-hidden rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.color} p-5 hover:scale-[1.02] transition-all duration-200 cursor-pointer`}>
              <div className="flex flex-col gap-3">
                <div className={`w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center ${stat.iconColor}`}>
                  <stat.icon className="w-4.5 h-4.5" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white tabular-nums">{stat.value}</div>
                  <div className="text-xs font-medium text-white/50 mt-0.5 leading-tight">{stat.label}</div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-white/3 translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </Link>
        ))}
      </div>

      {/* Action Required & Completion Ring Row */}
      {actionRequired.length > 0 && (
        <div className="rounded-2xl border border-orange-500/20 bg-orange-950/20 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-black text-orange-300 uppercase tracking-widest">Action Required ({actionRequired.length})</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {actionRequired.map((p: any) => (
              <Link key={p.id} href={`/admin/projects/${p.id}`} className="group">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-orange-500/15 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-orange-900/40 border border-orange-500/20 flex items-center justify-center">
                    {p.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-orange-400 text-xs font-black">⚡</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-xs truncate">{p.song_title}</div>
                    <div className="text-[10px] text-orange-300/60 truncate">{p.client_name} · {p.status}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-indigo-400" />
              Recent Projects
            </h2>
            <Link href="/admin/projects" className="text-xs text-muted-foreground hover:text-white transition-colors">
              View all →
            </Link>
          </div>

          <div className="space-y-2">
            {recentProjects.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border/50 rounded-2xl text-muted-foreground">
                No projects yet. <Link href="/admin/projects/new" className="text-indigo-400 hover:underline">Create your first →</Link>
              </div>
            ) : (
              recentProjects.map((project: any) => (
                <Link key={project.id} href={`/admin/projects/${project.id}`} className="block group">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-border/40 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-200">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-indigo-900/60 to-fuchsia-900/40 border border-white/10 flex items-center justify-center">
                      {project.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={project.cover_url} alt={project.project_title} className="w-full h-full object-cover" />
                      ) : (
                        <FolderOpen className="w-5 h-5 text-white/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm truncate">{project.project_title}</div>
                      <div className="text-xs text-muted-foreground truncate">{project.song_title} · {project.client_name}</div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${STATUS_COLORS[project.status] || "text-zinc-400 bg-zinc-800/60 border-zinc-700/50"}`}>
                      {project.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Completion Ring + Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Completion Ring */}
          <div className="rounded-2xl border border-border/30 bg-white/[0.02] p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Delivery Rate
            </h3>
            <div className="flex items-center gap-5">
              <div className="relative w-[100px] h-[100px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r={radius}
                    fill="none"
                    stroke="url(#ringGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{completionPct}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div><span className="text-2xl font-black text-white">{delivered}</span><span className="text-xs text-white/40 ml-1.5">delivered</span></div>
                <div className="text-xs text-white/40">out of {totalProjects} total projects</div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                  {completionPct >= 80 ? "🔥 Excellent" : completionPct >= 50 ? "✅ On Track" : "⚡ In Progress"}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-fuchsia-400" /> Recent Activity
            </h2>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {!events || events.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border/50 rounded-2xl text-muted-foreground text-sm">No activity yet.</div>
              ) : (
                events.map((ev: any) => (
                  <div key={ev.id} className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-border/30 hover:border-white/10 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-sm shrink-0">
                      {EVENT_TYPE_ICONS[ev.type] || "📌"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{ev.title}</div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {ev.projects?.project_title} · {ev.projects?.client_name}
                      </div>
                      <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                        {new Date(ev.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Links */}
            <div className="pt-2 border-t border-white/5 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-2">Quick Links</p>
              <a href="https://supabase.com/dashboard/project/_/auth/users" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-all">
                <ExternalLink className="w-4 h-4 text-indigo-400" />
                Manage Auth in Supabase
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
