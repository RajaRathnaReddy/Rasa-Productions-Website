"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

/**
 * Manually extract tokens from the URL hash fragment.
 * Supabase's @supabase/ssr client does NOT auto-detect hash fragments
 * (it's designed for PKCE/cookie-based auth). For admin invites that use
 * implicit flow (hash redirect), we must parse and setSession manually.
 */
function parseHashTokens(hash: string): { access_token: string; refresh_token: string } | null {
  if (!hash || hash.length <= 1) return null;
  const params = new URLSearchParams(hash.substring(1)); // Remove the leading '#'
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  if (access_token && refresh_token) {
    return { access_token, refresh_token };
  }
  return null;
}

function parseHashError(hash: string): string | null {
  if (!hash || hash.length <= 1) return null;
  const params = new URLSearchParams(hash.substring(1));
  const error = params.get("error");
  const errorDesc = params.get("error_description");
  if (error) {
    return errorDesc || error;
  }
  return null;
}

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Check if the callback route sent us an explicit error
    const authError = searchParams.get("auth_error");
    if (authError) {
      setStatus("error");
      setErrorMsg(decodeURIComponent(authError));
      return;
    }

    const supabase = createClient();

    async function handleAuth() {
      const hash = window.location.hash;
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      // ── 1. Check for error in hash (Supabase puts errors there too)
      const hashError = parseHashError(hash);
      if (hashError) {
        setStatus("error");
        setErrorMsg(`${hashError}. Please ask the studio for a new invite.`);
        return;
      }

      // ── 2. Try to extract tokens from the hash (implicit / admin invite flow)
      //    @supabase/ssr does NOT auto-detect hash fragments, so we do it manually.
      const tokens = parseHashTokens(hash);
      if (tokens) {
        const { error } = await supabase.auth.setSession({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        });

        if (error) {
          setStatus("error");
          setErrorMsg(`Session error: ${error.message}. Please ask for a new invite.`);
          return;
        }

        setStatus("success");
        // Clear the hash so tokens aren't left in the URL
        window.history.replaceState(null, "", window.location.pathname);
        // Always go to password setup — this page is only reached via invite/reset
        setTimeout(() => {
          window.location.href = "/update-password";
        }, 900);
        return;
      }

      // ── 3. Try PKCE code exchange (if code query param is present)
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus("error");
          setErrorMsg(`Code exchange failed: ${error.message}. Please ask for a new invite.`);
          return;
        }

        setStatus("success");
        setTimeout(() => {
          router.replace("/update-password");
        }, 900);
        return;
      }

      // ── 4. Check if there's already an active session (maybe already verified)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setStatus("success");
        setTimeout(() => router.replace("/dashboard"), 900);
        return;
      }

      // ── 5. No tokens, no code, no session — genuinely invalid
      setStatus("error");
      setErrorMsg(
        "This invite link is invalid or has already been used. Please ask Rasa Productions for a new one."
      );
    }

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="text-center space-y-5 max-w-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/logo.png"
        alt="Rasa Productions"
        className="h-24 w-auto mx-auto drop-shadow-[0_0_25px_rgba(255,160,0,0.4)]"
      />

      {status === "loading" && (
        <>
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
          <p className="text-white/60 text-sm">Verifying your invite link…</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <div>
            <p className="text-white font-bold text-lg">Invite Accepted!</p>
            <p className="text-white/50 text-sm mt-1">Taking you to set your password…</p>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <div>
            <p className="text-white font-bold text-lg">Link Expired</p>
            <p className="text-white/50 text-sm mt-2 leading-relaxed max-w-xs mx-auto">{errorMsg}</p>
          </div>
          <div className="flex flex-col items-center gap-3 mt-4">
            <a
              href="/login"
              className="inline-block px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all"
            >
              Back to Login
            </a>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Try Again
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function AuthConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080812] p-4">
      <Suspense
        fallback={
          <div className="text-center space-y-5">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
            <p className="text-white/60 text-sm">Loading…</p>
          </div>
        }
      >
        <ConfirmContent />
      </Suspense>
    </div>
  );
}
