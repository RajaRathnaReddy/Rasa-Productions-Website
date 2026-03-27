"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co") {
      setTimeout(() => { router.push("/dashboard"); }, 800);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
    setLoading(false);
  };

  if (resetSent) {
    return (
      <div className="relative w-full text-center">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-white/20 via-emerald-500/30 to-teal-500/20 z-0" />
        <div className="relative z-10 bg-[#0d0d1e]/92 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] px-8 py-10 space-y-4">
          <Mail className="w-16 h-16 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-black text-white">Reset Link Sent!</h2>
          <p className="text-sm text-white/50">Check your email for the password reset link.</p>
          <button onClick={() => { setResetSent(false); setIsForgotPassword(false); }} className="text-xs text-indigo-400 hover:text-white mt-4 block mx-auto font-bold">Return to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Glowing border */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-white/20 via-indigo-500/30 to-fuchsia-500/20 z-0" />
      {/* Card */}
      <div className="relative z-10 bg-[#0d0d1e]/92 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        
        {/* Top accent bar */}
        <div className="h-[2px] bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500 opacity-80" />

        <div className="px-8 py-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-black text-white tracking-tight">{isForgotPassword ? "Reset Password" : "Access Portal"}</h1>
            <p className="text-sm text-white/40 font-medium">{isForgotPassword ? "Enter your email to receive a reset link" : "Enter your credentials to access your studio"}</p>
          </div>

          {/* Form */}
          <form onSubmit={isForgotPassword ? handleResetPassword : handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-white/50 uppercase tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 focus:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            {!isForgotPassword && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-bold text-white/50 uppercase tracking-widest">Password</label>
                  <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-indigo-400/70 hover:text-indigo-300 transition-colors font-medium">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 focus:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl px-4 py-3 text-xs text-rose-300 font-medium">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full h-12 rounded-xl font-black text-sm text-white overflow-hidden group transition-all disabled:opacity-70"
            >
              {/* Gradient bg */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-fuchsia-600 group-hover:from-indigo-500 group-hover:to-fuchsia-500 transition-all" />
              {/* Top shine */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
              {/* Glow */}
              <div className="absolute inset-0 shadow-[0_0_30px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_45px_rgba(99,102,241,0.7)] transition-shadow" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    {isForgotPassword ? "Send Reset Link" : "Secure Login"}
                  </>
                )}
              </span>
            </button>
            {isForgotPassword && (
              <div className="text-center mt-4">
                <button type="button" onClick={() => setIsForgotPassword(false)} className="text-xs text-white/40 hover:text-white transition-colors">
                  &larr; Back to login
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
