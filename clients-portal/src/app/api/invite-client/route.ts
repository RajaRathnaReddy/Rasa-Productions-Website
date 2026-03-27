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
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Try to invite the user first
  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${origin}/auth/confirm`,
  });

  // If already registered — send a password reset link instead
  if (error) {
    const isAlreadyRegistered =
      error.message.toLowerCase().includes("already been registered") ||
      error.message.toLowerCase().includes("already registered") ||
      error.message.toLowerCase().includes("user already exists");

    if (isAlreadyRegistered) {
      // Send password reset so they can set/recover their password
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/confirm`,
      });

      if (resetError) {
        return NextResponse.json({ error: resetError.message }, { status: 500 });
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
