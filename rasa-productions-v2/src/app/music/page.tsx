import type { Metadata } from 'next';
import MusicClient from './MusicClient';

export const metadata: Metadata = {
    title: 'Music | Rasa Productions',
    description: 'Explore our collection of original songs. Stream on Spotify, Apple Music, YouTube Music, Amazon Music, and more.',
};

export default function MusicPage() {
    return <MusicClient />;
}
