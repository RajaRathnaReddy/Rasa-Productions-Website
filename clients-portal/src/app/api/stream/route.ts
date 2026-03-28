import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  // ── AUTH GUARD ── Only authenticated users can stream audio
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return new NextResponse('Missing fileId', { status: 400 });
  }

  // Basic sanity check: Google Drive file IDs are alphanumeric + dashes/underscores
  if (!/^[a-zA-Z0-9_-]{10,60}$/.test(fileId)) {
    return new NextResponse('Invalid fileId', { status: 400 });
  }

  // The proxy prevents the raw Google Drive link from being exposed to the client.
  // Fetches server-side and streams directly to the authenticated browser.
  try {
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
    
    const response = await fetch(driveUrl);
    if (!response.ok) throw new Error(`Drive responded with ${response.status}`);

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
        'Cache-Control': 'private, no-store',
        'Accept-Ranges': 'bytes',
        'Content-Disposition': 'inline',
        'X-Content-Type-Options': 'nosniff',
        // Prevent the audio URL from being re-shared
        'Cross-Origin-Resource-Policy': 'same-origin',
      }
    });
  } catch (error) {
    console.error('Drive Stream Error:', error);
    return new NextResponse('Secure Stream Unavailable', { status: 500 });
  }
}
