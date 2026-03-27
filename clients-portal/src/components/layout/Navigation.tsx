"use client";

import Link from "next/link";
import { Music, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function Navigation({ userRole, isAdmin }: { userRole?: "super_admin" | "client", isAdmin?: boolean }) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const logoHref = (userRole === "super_admin" || isAdmin) ? "/admin/projects" : userRole === "client" ? "/dashboard" : "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#080812]/92 backdrop-blur-2xl shadow-[0_1px_0_rgba(99,102,241,0.12)]">
      <div className="container flex h-16 items-center px-6 md:px-10 max-w-7xl mx-auto">

        {/* ── RP LOGO IMAGE ── */}
        <Link href={logoHref} className="flex items-center gap-2 mr-10 group flex-shrink-0" aria-label="Rasa Productions">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/logo.png"
            alt="Rasa Productions"
            className="h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,160,0,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(255,160,0,0.65)] group-hover:scale-105 transition-all duration-300"
          />
        </Link>

        {/* ── NAV LINKS — only shown when logged in ── */}
        {(userRole || isAdmin) && (
          <div className="flex flex-1 items-center justify-end gap-1.5">
            <nav className="flex items-center gap-1">
              {/* Link to Admin Panel - Visible only to admins */}
              {(userRole === "super_admin" || isAdmin) && (
                <Link
                  href="/admin"
                  className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 rounded-full hover:bg-white/6 transition-all border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)] hover:shadow-[0_0_20px_rgba(52,211,153,0.2)] mx-1"
                >
                  Admin Panel
                </Link>
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
            <div className="flex items-center ml-3 pl-3 border-l border-white/8">
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
