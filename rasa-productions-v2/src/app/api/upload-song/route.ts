import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const artist = formData.get('artist') as string;
        const duration = formData.get('duration') as string;
        const spotify = formData.get('spotify') as string;
        const youtube = formData.get('youtube') as string;
        const amazon = formData.get('amazon') as string;
        const apple = formData.get('apple') as string;
        const coverFile = formData.get('cover') as File | null;
        const audioFile = formData.get('audio') as File | null;

        if (!title || !artist) {
            return NextResponse.json({ error: 'Title and artist required' }, { status: 400 });
        }

        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const publicDir = path.join(process.cwd(), 'public');

        // Save cover image
        let coverPath = '/covers/default.jpg';
        if (coverFile && coverFile.size > 0) {
            const coverBytes = await coverFile.arrayBuffer();
            const coverExt = coverFile.name.split('.').pop() || 'jpg';
            const coverFileName = `${id}.${coverExt}`;
            await writeFile(path.join(publicDir, 'covers', coverFileName), Buffer.from(coverBytes));
            coverPath = `/covers/${coverFileName}`;
        }

        // Save audio
        let audioPath = '';
        if (audioFile && audioFile.size > 0) {
            const audioBytes = await audioFile.arrayBuffer();
            const audioExt = audioFile.name.split('.').pop() || 'mp3';
            const dir = path.join(publicDir, 'music', id);
            await writeFile(path.join(dir, `song.${audioExt}`), Buffer.from(audioBytes)).catch(async () => {
                const { mkdir } = await import('fs/promises');
                await mkdir(dir, { recursive: true });
                await writeFile(path.join(dir, `song.${audioExt}`), Buffer.from(audioBytes));
            });
            audioPath = `/music/${id}/song.${audioExt}`;
        }

        // Read existing songs
        const songsPath = path.join(process.cwd(), 'src', 'data', 'songs.json');
        const existingJson = await readFile(songsPath, 'utf-8');
        const songs = JSON.parse(existingJson);

        // Add new song
        const newSong = {
            id,
            title,
            artist,
            duration: duration || '0:00',
            cover: coverPath,
            audio: audioPath,
            isNew: true,
            releaseDate: new Date().toISOString().split('T')[0],
            platforms: { spotify, youtube, amazon, apple },
        };
        songs.unshift(newSong);
        await writeFile(songsPath, JSON.stringify(songs, null, 2));

        return NextResponse.json({ success: true, song: newSong });
    } catch (error) {
        console.error('[Upload Song] Error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
