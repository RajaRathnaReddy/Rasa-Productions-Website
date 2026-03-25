import type { Metadata } from 'next';
import VideosClient from './VideosClient';

export const metadata: Metadata = {
    title: 'Video Songs | Rasa Productions',
    description: 'Watch our stunning cinematic music videos. Hover to preview, click to watch in fullscreen.',
};

export default function VideosPage() {
    return <VideosClient />;
}
