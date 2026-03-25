import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About | Rasa Productions',
    description: 'Learn about Rasa Productions — our story, vision, and the team behind the music.',
};

export default function AboutPage() {
    return <AboutClient />;
}
