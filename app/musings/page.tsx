import type { Metadata } from 'next';
import { MusingsClient } from '@/components/musings/MusingsClient';
import { getMusings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Musings',
  description:
    'Organized thoughts and explorations across AI research, system design, philosophy, and more.',
};

export default function MusingsPage() {
  return <MusingsClient notebooks={getMusings()} />;
}
