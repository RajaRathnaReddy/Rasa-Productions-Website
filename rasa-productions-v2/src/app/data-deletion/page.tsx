import type { Metadata } from 'next';
import DataDeletionClient from './DataDeletionClient';

export const metadata: Metadata = {
    title: 'Data Deletion | Rasa Productions',
    description: 'Data Deletion Instructions for Rasa Productions.',
};

export default function DataDeletionPage() {
    return <DataDeletionClient />;
}
