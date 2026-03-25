import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
    title: 'Privacy Policy | Rasa Productions',
    description: 'Privacy Policy for Rasa Productions.',
};

export default function PrivacyPage() {
    return <PrivacyClient />;
}
