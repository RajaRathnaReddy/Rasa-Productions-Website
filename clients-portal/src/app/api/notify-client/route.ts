import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";

function buildEmail({
  clientName,
  songTitle,
  projectTitle,
  eventTitle,
  eventDescription,
  portalUrl,
  type,
}: {
  clientName: string;
  songTitle: string;
  projectTitle: string;
  eventTitle: string;
  eventDescription?: string;
  portalUrl: string;
  type: "new_mix" | "awaiting_feedback" | "status_update";
}) {
  const headline =
    type === "new_mix"
      ? `🎵 New Mix Ready: ${songTitle}`
      : type === "awaiting_feedback"
      ? `💬 Your Feedback is Needed`
      : `📌 Project Update: ${projectTitle}`;

  const subline =
    type === "new_mix"
      ? `A new audio version has been uploaded for your project. Head into your portal to listen and share your thoughts.`
      : type === "awaiting_feedback"
      ? `Rasa Productions is waiting on your feedback for <strong>${songTitle}</strong> before moving to the next stage.`
      : `There's a new update on your project <strong>${projectTitle}</strong>.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${headline}</title>
</head>
<body style="margin:0;padding:0;background:#080812;font-family:'Inter','Segoe UI',sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080812;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a1a3e,#0f0f25);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;border-bottom:1px solid rgba(99,102,241,0.3);">
          <div style="font-size:22px;font-weight:900;letter-spacing:-0.5px;color:#fff;">
            <span style="color:#f59e0b;">●</span> Rasa Productions
          </div>
          <div style="font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:4px;text-transform:uppercase;margin-top:4px;">Studio Portal</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#0d0d1e;padding:40px;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);">
          <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0 0 8px;">Hi ${clientName},</p>
          <h1 style="font-size:26px;font-weight:900;margin:0 0 16px;line-height:1.2;">${headline}</h1>
          <p style="color:rgba(255,255,255,0.65);font-size:15px;line-height:1.6;margin:0 0 24px;">${subline}</p>

          <!-- Event Card -->
          <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:20px;margin-bottom:32px;">
            <div style="font-size:11px;color:rgba(139,92,246,0.8);font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">${eventTitle}</div>
            ${eventDescription ? `<div style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.5;">${eventDescription}</div>` : ""}
            <div style="margin-top:12px;font-size:12px;color:rgba(255,255,255,0.3);">Project: ${projectTitle} · Track: ${songTitle}</div>
          </div>

          <!-- CTA Button -->
          <div style="text-align:center;">
            <a href="${portalUrl}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:12px;letter-spacing:0.5px;">
              Open My Portal →
            </a>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#080812;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;">
            © Rasa Productions · Studio Portal<br/>
            You're receiving this because you have an active project. <a href="${portalUrl}" style="color:rgba(99,102,241,0.6);">Visit portal</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clientEmail, clientName, songTitle, projectTitle, eventTitle, eventDescription, projectId, type } = body;

    if (!clientEmail || !projectId || !type) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const portalUrl = `${new URL(request.url).origin}/project/${projectId}`;

    const html = buildEmail({
      clientName: clientName || "there",
      songTitle: songTitle || "Untitled",
      projectTitle: projectTitle || "Your Project",
      eventTitle,
      eventDescription,
      portalUrl,
      type,
    });

    const subject =
      type === "new_mix"
        ? `🎵 New mix ready: ${songTitle}`
        : type === "awaiting_feedback"
        ? `💬 Your feedback is needed — ${songTitle}`
        : `📌 Update on ${projectTitle}`;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Rasa Productions <noreply@rasaproductions.in>",
      to: [clientEmail],
      subject,
      html,
    });

    if (error) {
      console.error("[notify-client] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error("[notify-client] Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
