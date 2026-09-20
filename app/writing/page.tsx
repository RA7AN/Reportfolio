import type { Metadata } from 'next';
import { WritingListClient } from '@/components/writing/WritingListClient';
import { getWritingList } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Essays, notes, and links. Filter by kind and tags.',
};

export default function WritingPage() {
  return <WritingListClient items={getWritingList()} />;
}
