"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

/**
 * Client-side auth confirm page.
 *
 * Supabase invite / password-reset emails redirect here.
 * The URL may contain:
 *   - URL hash:  #access_token=xxx&refresh_token=yyy&type=invite   (implicit flow)
 *   - Query:     ?code=xxx                                          (PKCE flow)
 *
 * The Supabase browser client automatically reads the URL hash on init
 * and fires onAuthStateChange with SIGNED_IN once it's processed.
 * We MUST wait for that event — not error out immediately on INITIAL_SESSION.
 */
export default function AuthConfirmPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let timeoutId: ReturnType<typeof setTimeout>;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          clearTimeout(timeoutId);
          const hash = typeof window !== "undefined" ? window.location.hash : "";
          const isInviteOrRecovery =
            hash.includes("type=invite") ||
            hash.includes("type=recovery") ||
            hash.includes("type=signup");

          setStatus("success");
          setTimeout(() => {
            router.replace(isInviteOrRecovery ? "/update-password" : "/dashboard");
          }, 900);
        }

        if (event === "INITIAL_SESSION") {
          if (session) {
            // Already have a session — redirect to dashboard
            clearTimeout(timeoutId);
            setStatus("success");
            setTimeout(() => router.replace("/dashboard"), 900);
            return;
          }

          // No session yet. Check for PKCE code param.
          const url = new URL(window.location.href);
          const code = url.searchParams.get("code");

          if (code) {
            // PKCE flow — exchange the code for a session
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
              setStatus("error");
              setErrorMsg("This link appears to be invalid or expired. Please ask the studio for a new invite.");
            }
            // On success, SIGNED_IN will fire automatically — handled above
            return;
          }

          // No code and no session yet. If there is a hash, the Supabase client
          // is processing it async — wait up to 8 seconds for SIGNED_IN to fire.
          const hash = window.location.hash;
          if (hash && hash.length > 1) {
            // Hash present — Supabase is processing it. Wait.
            timeoutId = setTimeout(() => {
              setStatus("error");
              setErrorMsg("Could not verify your invite link. It may have expired. Ask the studio to resend your invite.");
            }, 8000);
            return;
          }

          // No hash, no code, no session = genuinely invalid link
          setStatus("error");
          setErrorMsg("This invite link is invalid or has already been used. Please ask Rasa Productions for a new one.");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080812] p-4">
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
            <a
              href="/login"
              className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all"
            >
              Back to Login
            </a>
          </>
        )}
      </div>
    </div>
  );
}
