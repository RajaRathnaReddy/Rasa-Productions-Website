import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // ── PKCE / magic-link flow: ?code=
  const code = searchParams.get("code");
  // ── token_hash flow (some Supabase configs): ?token_hash=&type=
  const tokenHash = searchParams.get("token_hash");
  const type      = searchParams.get("type") as "invite" | "recovery" | "email" | null;
  const next      = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  // 1. Handle PKCE code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const destination = next === "/update-password" ? "/update-password" : next;
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  // 2. Handle token_hash (explicit param — some flows send this)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) {
      const destination = (type === "invite" || type === "recovery")
        ? "/update-password"
        : next;
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  // 3. No recognisable query params — the token is almost certainly in the URL
  //    HASH FRAGMENT (#access_token=...&type=invite) which the server CANNOT read.
  //    Return a minimal HTML page with inline JS that:
  //      a) reads the hash client-side
  //      b) if a hash is present, forwards to /auth/confirm WITH the hash preserved
  //      c) if no hash either, shows the "invalid link" error
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
      var hash   = window.location.hash;    // e.g. #access_token=xxx&type=invite
      var search = window.location.search;  // e.g. ?next=/update-password

      if (hash && hash.length > 1) {
        // Forward to the client-side confirm page WITH the hash intact
        window.location.replace('/auth/confirm' + search + hash);
      } else {
        // Genuinely no token anywhere — show error
        window.location.replace('/login?error=Invalid+or+expired+link');
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
