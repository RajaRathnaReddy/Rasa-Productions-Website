"use client";

import { motion, Variants } from "framer-motion";
import { Project } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Clock, FolderIcon, Activity, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function ClientDashboardView({ projects, stats }: { projects: Project[], stats: any[] }) {
  const hasProjects = projects.length > 0;

  return (
    <div className="space-y-12 pb-12">
      {/* ─── DARK CINEMATIC STUDIO HERO ─── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative w-full overflow-hidden rounded-[2.5rem] bg-[#0d0d1a] border border-white/5 shadow-[0_30px_80px_-20px_rgba(99,102,241,0.5)] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 h-[400px]"
      >
        {/* Animated neon orbs */}
        <motion.div animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.3, 1] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-700/40 rounded-full blur-[120px] pointer-events-none" />
        <motion.div animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.4, 1] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-fuchsia-700/30 rounded-full blur-[130px] pointer-events-none" />
        <motion.div animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.2, 1] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 left-[40%] w-[300px] h-[300px] bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[30%] right-[30%] w-[200px] h-[200px] bg-rose-600/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-5 max-w-2xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-300 bg-indigo-900/60 border border-indigo-500/30 backdrop-blur-md">
              ✦ Client Portal
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[1.08]"
          >
            Welcome to the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.5)]">
              Studio.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-white/60 text-lg leading-relaxed max-w-xl font-light"
          >
            Your exclusive digital studio environment. Review your mixes and securely collaborate on your production journey.
          </motion.p>
        </div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="relative z-10 flex-shrink-0 hidden md:flex items-center justify-center"
        >
          <div className="relative w-44 h-44 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30" />
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-900/80 to-fuchsia-900/80 border border-indigo-500/30 shadow-[0_0_60px_rgba(99,102,241,0.4)] flex items-center justify-center backdrop-blur-xl">
              <Music className="w-16 h-16 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
              <div className="w-4 h-4 bg-cyan-400 rounded-full absolute -top-1 left-1/2 -translate-x-1/2 shadow-[0_0_12px_#22d3ee]" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {!hasProjects ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="w-full flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-24 h-24 rounded-full border border-dashed border-white/10 flex flex-col items-center justify-center mb-8 bg-white/[0.02] backdrop-blur-3xl shadow-[0_0_30px_rgba(255,255,255,0.02)]">
             <FolderIcon className="w-8 h-8 text-white/20" />
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500 mb-4 tracking-tight">Awaiting Studio Assignment</h2>
          <p className="text-white/40 max-w-md text-sm leading-relaxed">
            Your dashboard is currently empty. Once Rasa Productions creates a new project and assigns it to your email, it will appear here instantly.
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div variants={item} key={index}>
                <Card className="bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.2)] hover:-translate-y-1 hover:bg-white/8 transition-all duration-300 rounded-2xl backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold text-white/50 uppercase tracking-widest">
                      {stat.label}
                    </CardTitle>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }} className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 shadow-sm">
                      <Activity className="w-4 h-4 text-indigo-400" />
                    </motion.div>
                  </CardHeader>
                  <CardContent className="flex justify-between items-end">
                    <div className="text-4xl font-black text-white">{stat.value}</div>
                    <div className="flex items-end gap-1 h-6 opacity-70">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ["40%", "100%", "40%"] }}
                          transition={{ duration: 1.5 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                          className="w-1.5 bg-gradient-to-t from-indigo-500 to-fuchsia-400 rounded-t-sm"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
              <h2 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-600 flex items-center gap-2">
                <FolderIcon className="w-6 h-6 text-rose-500" /> Your Projects
              </h2>
            </div>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={container}
            >
              {projects.map((project) => (
                <motion.div variants={item} key={project.id} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Link href={`/project/${project.id}`}>
                    <Card className="group overflow-hidden bg-slate-100 border border-white/80 backdrop-blur-xl transition-all duration-500 cursor-pointer shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.3)] h-[280px] rounded-2xl relative">
                      
                      {project.coverUrl ? (
                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={project.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                          <Music className="w-20 h-20 opacity-30" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                      
                      {project.status === "Awaiting Client Feedback" && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                          </span>
                        </div>
                      )}
                      
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg drop-shadow-md ${
                          project.status === "Final Delivered"
                            ? "bg-emerald-500 text-white"
                            : project.status === "Awaiting Client Feedback"
                            ? "bg-amber-400 text-amber-950"
                            : project.status === "In Review"
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-700 text-white"
                        }`}>
                          {project.status.replace(/-/g, ' ')}
                        </span>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex flex-col justify-end z-10 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                        <CardTitle className="text-xl md:text-2xl font-black text-white leading-tight drop-shadow-lg line-clamp-2 pb-1.5">
                          {project.songTitle}
                        </CardTitle>
                        <CardDescription className="text-xs text-white/80 uppercase tracking-[0.2em] font-bold mt-1 line-clamp-1 drop-shadow-md">
                          {project.projectTitle}
                        </CardDescription>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pb-8">
            {/* Quick Studio Actions */}
            <div className="space-y-6 lg:col-span-1">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                <h2 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-pink-500">Quick Actions</h2>
              </div>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 rounded-[2rem]">
                <div className="space-y-3">
                  <Link href="/submit-lyrics">
                    <Button variant="outline" className="w-full justify-start bg-white/60 border-white/80 hover:bg-white text-slate-700 shadow-sm transition-all h-12 rounded-xl mb-3">
                      <Music className="w-4 h-4 mr-3 text-slate-400" /> Submit Lyrics
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start bg-white/60 border-white/80 hover:bg-white text-slate-700 shadow-sm transition-all h-12 rounded-xl">
                    <Clock className="w-4 h-4 mr-3 text-slate-400" /> Book Studio Session
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Recent Activity Space (Empty for now until requested) */}
            <div className="lg:col-span-2 space-y-6">
               <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                  <h2 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center gap-2">
                     <Activity className="w-6 h-6 text-indigo-500" /> Recent Activity
                  </h2>
                </div>
                <Card className="bg-white/5 backdrop-blur-xl border border-dashed border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-10 rounded-[2rem] flex flex-col items-center justify-center text-center">
                  <Activity className="w-8 h-8 text-white/20 mb-3" />
                  <p className="text-white/40 text-sm">Activity feed will populate once project milestones are recorded in the studio.</p>
                </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
