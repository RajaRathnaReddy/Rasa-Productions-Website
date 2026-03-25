import type { Metadata } from 'next';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
    title: 'Admin | Rasa Productions',
    description: 'Admin panel for Rasa Productions',
    robots: 'noindex, nofollow',
};

export default function AdminPage() {
    return <AdminClient />;
}
