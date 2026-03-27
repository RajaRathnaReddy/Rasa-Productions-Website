"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  PlusCircle, Search, FolderOpen, Clock, MessageSquare, 
  CheckCircle2, TrendingUp, FileX2, Filter
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  "Draft": { label: "Draft", color: "text-zinc-400 bg-zinc-800/60 border-zinc-700/50", dot: "bg-zinc-500" },
  "In Review": { label: "In Review", color: "text-amber-300 bg-amber-950/60 border-amber-700/50", dot: "bg-amber-400" },
  "Awaiting Client Feedback": { label: "Awaiting Feedback", color: "text-sky-300 bg-sky-950/60 border-sky-700/50", dot: "bg-sky-400" },
  "Revision Requested": { label: "Revision", color: "text-orange-300 bg-orange-950/60 border-orange-700/50", dot: "bg-orange-400" },
  "Approved": { label: "Approved", color: "text-emerald-300 bg-emerald-950/60 border-emerald-700/50", dot: "bg-emerald-400" },
  "Final Delivered": { label: "Delivered", color: "text-violet-300 bg-violet-950/60 border-violet-700/50", dot: "bg-violet-400" },
};

const ALL_STATUSES = ["All", "Draft", "In Review", "Awaiting Client Feedback", "Revision Requested", "Approved", "Final Delivered"];

type Project = {
  id: string;
  client_name: string;
  client_id: string;
  song_title: string;
  project_title: string;
  status: string;
  cover_url?: string;
  genre?: string;
  created_at: string;
};

export default function ProjectsListClient({ projects }: { projects: Project[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [clientFilter, setClientFilter] = useState("All");

  // Extract unique client names for the filter dropdown
  const uniqueClients = useMemo(() => {
    const names = [...new Set(projects.map(p => p.client_name).filter(Boolean))];
    return names.sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        (p.client_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.song_title || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.project_title || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesClient = clientFilter === "All" || p.client_name === clientFilter;
      return matchesSearch && matchesStatus && matchesClient;
    });
  }, [projects, search, statusFilter, clientFilter]);

  const stats = {
    total: projects.length,
    inReview: projects.filter(p => p.status === "In Review").length,
    awaitingFeedback: projects.filter(p => p.status === "Awaiting Client Feedback").length,
    delivered: projects.filter(p => p.status === "Final Delivered").length,
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
            <FolderOpen className="w-7 h-7 text-indigo-400" />
            Projects
          </h1>
          <p className="text-muted-foreground text-sm">Manage all client projects, statuses, and deliverables.</p>
        </div>
        <Link href="/admin/projects/new">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-200 whitespace-nowrap">
            <PlusCircle className="w-4 h-4" />
            Create Project
          </button>
        </Link>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, icon: FolderOpen, color: "text-indigo-400" },
          { label: "In Review", value: stats.inReview, icon: Clock, color: "text-amber-400" },
          { label: "Awaiting Feedback", value: stats.awaitingFeedback, icon: MessageSquare, color: "text-sky-400" },
          { label: "Delivered", value: stats.delivered, icon: CheckCircle2, color: "text-violet-400" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-border/40">
            <s.icon className={`w-5 h-5 ${s.color} shrink-0`} strokeWidth={1.8} />
            <div>
              <div className="text-2xl font-bold text-white tabular-nums">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search, Client & Status Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search by client, song, or project title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
        </div>
        {/* Client filter */}
        {uniqueClients.length > 0 && (
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="w-full sm:w-48 pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-fuchsia-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="All" className="bg-zinc-900">All Clients</option>
              {uniqueClients.map(c => (
                <option key={c} value={c} className="bg-zinc-900">{c}</option>
              ))}
            </select>
          </div>
        )}
        {/* Status filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-52 pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
          >
            {ALL_STATUSES.map(s => (
              <option key={s} value={s} className="bg-zinc-900">{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="rounded-2xl border border-border/40 bg-white/[0.02] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
            <FileX2 className="w-12 h-12 opacity-20" />
            <div className="text-center">
              <p className="font-medium text-white/40">No projects found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_2fr_1.5fr_auto] gap-4 items-center px-5 py-3 border-b border-border/30 bg-white/[0.02]">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Project / Song</div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Client</div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Genre / Date</div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Status</div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-right">Action</div>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {filtered.map((project) => {
                const sc = STATUS_CONFIG[project.status] || STATUS_CONFIG["Draft"];
                return (
                  <div key={project.id} className="grid grid-cols-1 md:grid-cols-[3fr_2fr_2fr_1.5fr_auto] gap-4 items-center px-5 py-4 hover:bg-white/[0.03] transition-colors group">
                    {/* Cover + Title */}
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-indigo-900/60 to-fuchsia-900/40 border border-white/8 flex items-center justify-center">
                        {project.cover_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={project.cover_url} alt={project.project_title} className="w-full h-full object-cover" />
                        ) : (
                          <FolderOpen className="w-4 h-4 text-white/20" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white text-sm truncate">{project.project_title}</div>
                        <div className="text-xs text-muted-foreground truncate">{project.song_title}</div>
                      </div>
                    </div>

                    {/* Client */}
                    <div className="text-sm text-white/80 font-medium truncate md:block hidden">{project.client_name}</div>

                    {/* Genre / Date */}
                    <div className="text-xs text-muted-foreground md:block hidden">
                      <div>{project.genre || <span className="opacity-40">No genre</span>}</div>
                      <div className="opacity-50">{new Date(project.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${sc.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end">
                      <Link href={`/admin/projects/${project.id}`}>
                        <button className="text-xs font-semibold text-indigo-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-indigo-500/15 transition-all border border-transparent hover:border-indigo-500/30">
                          Manage →
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Showing {filtered.length} of {projects.length} project{projects.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
