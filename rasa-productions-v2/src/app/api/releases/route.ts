import { NextRequest, NextResponse } from 'next/server';
import fallbackSongsData from '@/data/songs.json';

export interface SongRelease {
    id: string;
    title: string;
    artist: string;
    duration: string;
    cover: string;
    audio: string;
    isNew?: boolean;
    releaseDate: string;
    platforms: {
        youtube?: string;
        spotify?: string;
        amazon?: string;
        apple?: string;
        jiosaavn?: string;
        [key: string]: string | undefined;
    };
}

// In-memory cache for runtime updates
let dynamicReleasesCache: SongRelease[] | null = null;

export function autoArrangeSongs(songs: SongRelease[]): SongRelease[] {
    if (!songs || !Array.isArray(songs)) return [];

    // 1. Sort descending by release date (newest first)
    const sorted = [...songs].sort((a, b) => {
        const dateA = new Date(a.releaseDate || '1970-01-01').getTime();
        const dateB = new Date(b.releaseDate || '1970-01-01').getTime();
        return dateB - dateA;
    });

    // 2. Automatically compute `isNew`:
    // The very latest release is always marked as NEW,
    // plus any release within the last 30 days.
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    return sorted.map((song, index) => {
        const releaseTime = new Date(song.releaseDate || '1970-01-01').getTime();
        const isRecent = (now - releaseTime) < thirtyDaysMs;
        const isLatest = index === 0; // The newest released song is always marked NEW

        return {
            ...song,
            isNew: isLatest || isRecent,
        };
    });
}

export async function GET() {
    try {
        // If an external dynamic DB / API URL is provided (e.g. Supabase, n8n storage endpoint)
        const remoteUrl = process.env.RELEASES_UPSTREAM_URL || process.env.NEXT_PUBLIC_RELEASES_API_URL;
        
        let songs: SongRelease[] = dynamicReleasesCache || (fallbackSongsData as SongRelease[]);

        if (remoteUrl && !dynamicReleasesCache) {
            try {
                const res = await fetch(remoteUrl, { next: { revalidate: 60 } });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        songs = data;
                    }
                }
            } catch (fetchErr) {
                console.warn('[Releases API] Failed to fetch upstream releases, falling back to local:', fetchErr);
            }
        }

        const arrangedSongs = autoArrangeSongs(songs);

        return NextResponse.json(arrangedSongs, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('[Releases API] Error:', error);
        return NextResponse.json(autoArrangeSongs(fallbackSongsData as SongRelease[]), { status: 200 });
    }
}

// POST endpoint for n8n Webhook auto-updates
export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization') || req.headers.get('x-n8n-token') || req.nextUrl.searchParams.get('secret');
        const expectedSecret = process.env.N8N_RELEASE_SECRET || process.env.CRON_SECRET || 'rasa-secret-n8n';

        // Check authentication if a secret is configured in production
        if (process.env.NODE_ENV === 'production' && process.env.N8N_RELEASE_SECRET) {
            const token = authHeader?.replace('Bearer ', '').trim();
            if (token !== expectedSecret) {
                return NextResponse.json({ error: 'Unauthorized n8n webhook request' }, { status: 401 });
            }
        }

        const body = await req.json();

        // Support single song or batch songs array from n8n
        const newSongs: SongRelease[] = Array.isArray(body) ? body : [body];

        for (const song of newSongs) {
            if (!song.title) {
                return NextResponse.json({ error: 'Title is required for each song' }, { status: 400 });
            }
            if (!song.id) {
                song.id = song.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
            if (!song.artist) song.artist = 'Rasa Productions';
            if (!song.duration) song.duration = '0:00';
            if (!song.releaseDate) song.releaseDate = new Date().toISOString().split('T')[0];
            if (!song.cover) song.cover = '/covers/default.webp';
            if (!song.audio) song.audio = '';
            if (!song.platforms) song.platforms = {};
        }

        const currentSongs = dynamicReleasesCache || (fallbackSongsData as SongRelease[]);
        
        // Merge without duplicates (matched by id or title)
        const merged = [...currentSongs];
        for (const newSong of newSongs) {
            const index = merged.findIndex(s => s.id === newSong.id || s.title.toLowerCase() === newSong.title.toLowerCase());
            if (index >= 0) {
                merged[index] = { ...merged[index], ...newSong };
            } else {
                merged.unshift(newSong);
            }
        }

        const arranged = autoArrangeSongs(merged);
        dynamicReleasesCache = arranged;

        return NextResponse.json({
            success: true,
            message: 'Release updated and auto-arranged successfully',
            count: arranged.length,
            latest: arranged[0],
            releases: arranged,
        }, { status: 200 });

    } catch (error) {
        console.error('[n8n Webhook Error]:', error);
        return NextResponse.json({ error: 'Failed to process n8n release update' }, { status: 500 });
    }
}
