import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Rasa Productions | Music. Emotion. Story.',
  description:
    'Official website of Rasa Productions — a cinematic music and virtual production brand. Discover our songs, video productions, and more.',
};

export default function HomePage() {
  return <HomeClient />;
}
