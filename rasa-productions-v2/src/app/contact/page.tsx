import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: 'Contact | Rasa Productions',
    description: 'Get in touch with Rasa Productions for collaborations, business enquiries, and more.',
};

export default function ContactPage() {
    return <ContactClient />;
}
