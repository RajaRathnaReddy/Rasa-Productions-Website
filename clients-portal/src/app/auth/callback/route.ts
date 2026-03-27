import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // ── OAuth / magic-link flow: uses ?code=
  const code = searchParams.get("code");
  // ── Invite / password-reset flow: uses ?token_hash= & ?type=
  const tokenHash = searchParams.get("token_hash");
  const type      = searchParams.get("type") as "invite" | "recovery" | "email" | null;
  const next      = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  // Handle OAuth / magic-link code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Handle invite / password-reset token_hash
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) {
      // Invite & recovery both go to set-password page
      const destination = (type === "invite" || type === "recovery")
        ? "/update-password"
        : next;
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  // Fallback — invalid or expired link
  return NextResponse.redirect(`${origin}/login?error=Invalid+or+expired+link`);
}
