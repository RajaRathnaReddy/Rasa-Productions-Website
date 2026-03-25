import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
    title: 'Terms & Conditions | Rasa Productions',
    description: 'Terms and Conditions for Rasa Productions.',
};

export default function TermsPage() {
    return <TermsClient />;
}
