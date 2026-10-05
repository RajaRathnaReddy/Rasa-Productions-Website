import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rasa Productions | Music. Emotion. Story.',
    short_name: 'Rasa Productions',
    description: 'Professional music and virtual production brand crafting cinematic experiences.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/logos/logo-icon.webp',
        sizes: '192x192',
        type: 'image/webp',
      },
      {
        src: '/logos/logo.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
    ],
  };
}
