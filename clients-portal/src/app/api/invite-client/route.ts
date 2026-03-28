import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { email } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const origin = new URL(request.url).origin;

  // Use admin client with service role key
  const { createClient: createAdminClient } = await import("@supabase/supabase-js");

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: "Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is not set." },
      { status: 500 }
    );
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );

  // Try to invite the user first.
  // redirectTo → /auth/callback so the SERVER handler exchanges the code.
  const redirectTo = `${origin}/auth/callback?next=/update-password`;

  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo,
  });

  // If already registered — send a password reset link instead.
  // IMPORTANT: We use the admin (service-role) client for resetPasswordForEmail.
  // Using the SSR server client would generate a PKCE code_verifier stored in the
  // server's cookie context, unreachable by the invited user's browser — causing
  // "Link Expired" every time. The admin client avoids PKCE entirely.
  if (error) {
    const isAlreadyRegistered =
      error.message.toLowerCase().includes("already been registered") ||
      error.message.toLowerCase().includes("already registered") ||
      error.message.toLowerCase().includes("user already exists");

    if (isAlreadyRegistered) {
      const { error: resetError } = await adminClient.auth.resetPasswordForEmail(
        email,
        { redirectTo }
      );

      if (resetError) {
        return NextResponse.json(
          { error: `Password reset failed: ${resetError.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        message: "This email is already registered. A password reset link has been sent to them instead.",
      });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, alreadyRegistered: false, user: data.user });
}
