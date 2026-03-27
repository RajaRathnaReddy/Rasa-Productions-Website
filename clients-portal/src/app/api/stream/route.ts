import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return new NextResponse('Missing fileId', { status: 400 });
  }

  // The proxy prevents the raw Google Drive link from being exposed to the client.
  // It fetches the stream server-side and funnels it to the browser.
  try {
     const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
     const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
     
     const response = await fetch(driveUrl);
     if (!response.ok) throw new Error('Failed to fetch from Drive');

     // Stream the response back to the client directly via the proxy
     return new NextResponse(response.body, {
       headers: {
         'Content-Type': 'audio/mpeg',
         'Cache-Control': 'no-cache, no-store, must-revalidate',
         'Accept-Ranges': 'bytes',
         // Anti-download headers
         'Content-Disposition': 'inline', 
         'X-Content-Type-Options': 'nosniff',
       }
     });
  } catch (error) {
     console.error('Drive Stream Error:', error);
     return new NextResponse('Secure Stream Unavailable', { status: 500 });
  }
}
