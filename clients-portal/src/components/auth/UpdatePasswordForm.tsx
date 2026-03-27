"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="relative w-full text-center">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-white/20 via-emerald-500/30 to-teal-500/20 z-0" />
        <div className="relative z-10 bg-[#0d0d1e]/92 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] px-8 py-10 space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-black text-white">Password Updated!</h2>
          <p className="text-sm text-white/50">Your new password is set. Taking you to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-white/20 via-indigo-500/30 to-fuchsia-500/20 z-0" />
      <div className="relative z-10 bg-[#0d0d1e]/92 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <div className="h-[2px] bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500 opacity-80" />
        <div className="px-8 py-8 space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-black text-white tracking-tight">Set New Password</h1>
            <p className="text-sm text-white/40 font-medium">Please enter your new secure password.</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl px-4 py-3 text-xs text-rose-300 font-medium">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="relative w-full h-12 rounded-xl font-black text-sm text-white overflow-hidden group transition-all mt-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-fuchsia-600 group-hover:from-indigo-500 group-hover:to-fuchsia-500 transition-all" />
              <div className="absolute inset-0 shadow-[0_0_30px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_45px_rgba(99,102,241,0.7)] transition-shadow" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
