"use client";

import Link from "next/link";
import { Music, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Generates initials from a name/email string
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+|@/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// Generates a deterministic gradient based on the string (consistent per user)
function getAvatarGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const gradients = [
    "from-indigo-500 to-purple-600",
    "from-fuchsia-500 to-pink-600",
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-red-600",
    "from-violet-500 to-indigo-600",
  ];
  return gradients[Math.abs(hash) % gradients.length];
}

type NavigationProps = {
  userRole?: "super_admin" | "client";
  isAdmin?: boolean;
  userEmail?: string;
  displayName?: string;
};

export function Navigation({ userRole, isAdmin, userEmail, displayName = "User" }: NavigationProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const logoHref = (userRole === "super_admin" || isAdmin) ? "/admin" : userRole === "client" ? "/dashboard" : "/";
  const initials = getInitials(displayName || userEmail || "U");
  const gradient = getAvatarGradient(userEmail || displayName || "user");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#080812]/92 backdrop-blur-2xl shadow-[0_1px_0_rgba(99,102,241,0.12)]">
      <div className="container flex h-16 items-center px-6 md:px-10 max-w-7xl mx-auto">

        {/* ── RP LOGO + BRAND NAME ── */}
        <Link href={logoHref} className="flex items-center gap-3 mr-10 group flex-shrink-0" aria-label="Rasa Productions">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/logo.png"
            alt="Rasa Productions"
            className="h-9 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,160,0,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(255,160,0,0.65)] group-hover:scale-105 transition-all duration-300 flex-shrink-0"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 group-hover:from-amber-200 group-hover:to-white transition-all duration-300">
              Rasa Productions
            </span>
            <span className="text-[9px] font-bold text-white/25 uppercase tracking-[0.22em]">Studio Portal</span>
          </div>
        </Link>

        {/* ── NAV LINKS — only shown when logged in ── */}
        {(userRole || isAdmin) && (
          <div className="flex flex-1 items-center justify-end gap-1.5">
            <nav className="flex items-center gap-1">
              {/* Admin Panel + Client Portal links */}
              {(userRole === "super_admin" || isAdmin) && (
                <>
                  <Link
                    href="/admin"
                    className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 rounded-full hover:bg-white/6 transition-all border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)] hover:shadow-[0_0_20px_rgba(52,211,153,0.2)] mx-1"
                  >
                    Admin Panel
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 px-4 py-2 rounded-full hover:bg-white/6 transition-all border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] mx-1"
                  >
                    Client Portal
                  </Link>
                </>
              )}
              
              {userRole === "client" && (
                <>
                  <Link href="/dashboard" className="text-sm font-semibold text-white/55 hover:text-white px-4 py-2 rounded-full hover:bg-white/6 transition-all hidden sm:block">My Mixes</Link>
                  <Link
                    href="/submit-lyrics"
                    className="text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 px-5 py-2 rounded-full shadow-[0_0_18px_rgba(99,102,241,0.4)] hover:shadow-[0_0_28px_rgba(99,102,241,0.65)] transition-all flex items-center gap-2 ml-1"
                  >
                    <Music className="h-3.5 w-3.5" />
                    Submit Lyrics
                  </Link>
                </>
              )}
            </nav>

            {/* ── USER AVATAR + LOGOUT ── */}
            <div className="flex items-center ml-3 pl-3 border-l border-white/8 gap-3">
              {/* Profile Avatar */}
              <div className="relative group/avatar cursor-default">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ring-2 ring-white/10 group-hover/avatar:ring-white/25 transition-all`}>
                  <span className="text-white font-black text-xs select-none">{initials}</span>
                </div>
                {/* Tooltip */}
                <div className="absolute top-full right-0 mt-2 opacity-0 group-hover/avatar:opacity-100 transition-all pointer-events-none z-50">
                  <div className="bg-[#13131f] border border-white/10 rounded-xl px-3 py-2 shadow-2xl whitespace-nowrap">
                    <p className="text-white text-xs font-semibold">{displayName}</p>
                    {userEmail && <p className="text-white/35 text-[10px] mt-0.5">{userEmail}</p>}
                    <p className="text-[9px] font-black uppercase tracking-widest mt-1 text-indigo-400">{isAdmin ? "Admin" : "Client"}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-semibold text-white/35 hover:text-rose-400 px-3 py-2 rounded-full hover:bg-rose-500/10 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
