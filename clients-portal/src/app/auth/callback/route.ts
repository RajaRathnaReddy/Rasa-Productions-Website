import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // ── PKCE / magic-link flow: ?code=
  const code = searchParams.get("code");
  // ── token_hash flow: ?token_hash=&type=
  const tokenHash = searchParams.get("token_hash");
  const type      = searchParams.get("type") as "invite" | "recovery" | "email" | null;
  const errorParam = searchParams.get("error");
  const errorDesc  = searchParams.get("error_description");

  // If Supabase redirected here with an error in query params
  if (errorParam) {
    const msg = encodeURIComponent(errorDesc || errorParam);
    return NextResponse.redirect(`${origin}/auth/confirm?auth_error=${msg}`);
  }

  const supabase = await createClient();

  // 1. Handle PKCE code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Always go to /update-password — this callback is only used by invite/reset flows
      return NextResponse.redirect(`${origin}/update-password`);
    }
    console.error("[auth/callback] PKCE code exchange failed:", error.message);
  }

  // 2. Handle token_hash (explicit param)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) {
      return NextResponse.redirect(`${origin}/update-password`);
    }
    console.error("[auth/callback] OTP verification failed:", error.message);
  }

  // 3. Hash fragment flow — the server can't read the hash.
  //    Return a small HTML page that reads the hash client-side and
  //    forwards to /auth/confirm (which will parse the tokens manually).
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Verifying… — Rasa Productions</title>
  <style>
    body{margin:0;background:#080812;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;color:#fff}
    .wrap{text-align:center;gap:12px;display:flex;flex-direction:column;align-items:center}
    .spinner{width:36px;height:36px;border:3px solid rgba(255,255,255,.15);border-top-color:#818cf8;border-radius:50%;animation:spin .8s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    p{color:rgba(255,255,255,.5);font-size:14px;margin:0}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="spinner"></div>
    <p>Verifying your invite link…</p>
  </div>
  <script>
    (function() {
      var hash = window.location.hash;

      // Check for error in hash
      if (hash && hash.includes('error=')) {
        var params = new URLSearchParams(hash.substring(1));
        var errMsg = params.get('error_description') || params.get('error') || 'Link expired or invalid';
        window.location.replace('/auth/confirm?auth_error=' + encodeURIComponent(errMsg));
        return;
      }

      // Forward hash tokens to the confirm page
      if (hash && hash.length > 1) {
        window.location.replace('/auth/confirm' + hash);
      } else {
        window.location.replace('/auth/confirm?auth_error=' + encodeURIComponent('No authentication token found. The link may be invalid or already used.'));
      }
    })();
  </script>
</body>
</html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }
  );
}
