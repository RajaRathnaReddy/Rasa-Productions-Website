import type { Metadata } from 'next';
import VirtualProductionClient from './VirtualProductionClient';

export const metadata: Metadata = {
    title: 'Virtual Production | Rasa Productions',
    description: 'Cutting-edge virtual production using Unreal Engine, LED wall technology, and cinematic rendering.',
};

export default function VirtualProductionPage() {
    return <VirtualProductionClient />;
}
