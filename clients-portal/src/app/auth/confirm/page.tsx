"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

/**
 * Client-side auth confirm page.
 *
 * Supabase invite / password-reset emails redirect here with a URL hash like:
 *   #access_token=xxx&refresh_token=yyy&type=invite
 *
 * The Supabase browser client automatically detects and processes this hash,
 * creating a valid session. We then redirect to /update-password.
 *
 * We also handle the PKCE code flow (?code=) as a fallback.
 */
export default function AuthConfirmPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const supabase = createClient();

    // The Supabase client automatically reads the URL hash on initialisation.
    // Wait for the auth state to settle.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          // For invite-type sessions, go to set-password page
          // Check if this came from an invite or recovery
          const hash = window.location.hash;
          const isInviteOrRecovery =
            hash.includes("type=invite") ||
            hash.includes("type=recovery") ||
            hash.includes("type=signup");

          setStatus("success");
          setTimeout(() => {
            if (isInviteOrRecovery) {
              router.replace("/update-password");
            } else {
              router.replace("/dashboard");
            }
          }, 800);
        } else if (event === "INITIAL_SESSION" && !session) {
          // No session — check if there is a ?code= in the URL (PKCE flow)
          const url = new URL(window.location.href);
          const code = url.searchParams.get("code");
          if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
              setStatus("error");
              setErrorMsg(error.message);
            }
            // Auth state change will fire again with SIGNED_IN
          } else {
            setStatus("error");
            setErrorMsg("This link is invalid or has already been used. Please request a new invitation.");
          }
        }
      }
    );

    return () => subscription.unsubscribe();
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
            <p className="text-white/60 text-sm">Verifying your link…</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div>
              <p className="text-white font-bold text-lg">Verified!</p>
              <p className="text-white/50 text-sm mt-1">Taking you to set your password…</p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <div>
              <p className="text-white font-bold text-lg">Link Expired</p>
              <p className="text-white/50 text-sm mt-2 leading-relaxed">{errorMsg}</p>
            </div>
            <a
              href="/login"
              className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all"
            >
              Back to Login
            </a>
          </>
        )}
      </div>
    </div>
  );
}
