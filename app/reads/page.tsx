import type { Metadata } from 'next';
import { ReadsClient } from '@/components/reads/ReadsClient';
import { getReads } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Recommended Reads',
  description:
    "Books, papers, and articles that have shaped Abdul Jawwad's thinking on AI, systems, and technology.",
};

export default function ReadsPage() {
  return <ReadsClient reads={getReads()} />;
}
