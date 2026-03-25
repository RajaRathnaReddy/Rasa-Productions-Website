import { create } from 'zustand';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  audio: string;
  isNew: boolean;
  releaseDate: string;
  platforms: {
    youtube?: string;
    amazon?: string;
    spotify?: string;
    apple?: string;
    instagram?: string;
  };
}

interface AudioStore {
  // Background music
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;

  // Currently playing song
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  stopSong: () => void;
  isHoverPlaying: boolean;
  setHoverPlaying: (playing: boolean) => void;

  // New song notification
  hasNewSong: boolean;
  clearNewSong: () => void;

  // Modal
  selectedSong: Song | null;
  openSongModal: (song: Song) => void;
  closeSongModal: () => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setMuted: (muted) => set({ isMuted: muted }),

  currentSong: null,
  isPlaying: false,
  playSong: (song) => set({ currentSong: song, isPlaying: true }),
  pauseSong: () => set({ isPlaying: false }),
  stopSong: () => set({ currentSong: null, isPlaying: false }),
  isHoverPlaying: false,
  setHoverPlaying: (playing) => set({ isHoverPlaying: playing }),

  hasNewSong: false,
  clearNewSong: () => set({ hasNewSong: false }),

  selectedSong: null,
  openSongModal: (song) => set({ selectedSong: song }),
  closeSongModal: () => set({ selectedSong: null }),
}));
