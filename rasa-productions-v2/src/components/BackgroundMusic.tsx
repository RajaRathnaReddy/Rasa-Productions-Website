'use client';

import { useEffect, useRef } from 'react';
import { useAudioStore } from '@/store/audioStore';

// Detect if running inside WordPress by checking for the theme asset prefix
function getAssetPrefix(): string {
    if (typeof window === 'undefined') return '';
    const scriptTag = document.querySelector('script[src*="/wp-content/themes/RasaProduction-v2/"]');
    if (scriptTag) {
        const src = scriptTag.getAttribute('src') || '';
        const match = src.match(/(\/wp-content\/themes\/RasaProduction-v2)/);
        return match ? match[1] : '';
    }
    return '';
}

export default function BackgroundMusic() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { isMuted, isPlaying, isHoverPlaying } = useAudioStore();

    useEffect(() => {
        const prefix = getAssetPrefix();
        const audio = new Audio(`${prefix}/audio/ambient.mp3`);
        audio.loop = true;
        audio.volume = 0.25;
        audio.muted = isMuted;
        audioRef.current = audio;

        // Auto-play after brief delay (user interaction requirement workaround)
        const play = () => {
            audio.play().catch(() => {
                // Will play after first interaction
            });
        };

        // Try immediate play
        play();

        // Fallback: play on first user interaction
        const handleInteract = () => {
            play();
            window.removeEventListener('click', handleInteract);
            window.removeEventListener('keydown', handleInteract);
            window.removeEventListener('touchstart', handleInteract);
        };
        window.addEventListener('click', handleInteract);
        window.addEventListener('keydown', handleInteract);
        window.addEventListener('touchstart', handleInteract);

        return () => {
            audio.pause();
            audio.src = '';
            window.removeEventListener('click', handleInteract);
            window.removeEventListener('keydown', handleInteract);
            window.removeEventListener('touchstart', handleInteract);
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    useEffect(() => {
        if (audioRef.current) {
            // Drop to 5% volume when a song is playing (or previewing), otherwise stay at 25%
            audioRef.current.volume = (isPlaying || isHoverPlaying) ? 0.05 : 0.25;
        }
    }, [isPlaying, isHoverPlaying]);

    return null;
}
