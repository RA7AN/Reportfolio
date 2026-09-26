import Link from 'next/link';
import type { WritingFrontmatter } from '@/lib/content/schemas';

function dateLabel(value?: string | null) {
  if (!value) return '';
  return value;
}

export function WritingPreview({ items }: { items: WritingFrontmatter[] }) {
  return (
    <section
      className="pt-20 sm:pt-24"
      id="writing"
      data-nerd="writing: 3 latest from git markdown"
    >
      <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
        writing
      </p>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
        notes on design and making
      </h2>
      <ul className="divide-border border-border mt-8 divide-y border-y">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={item.url || `/writing/${item.slug}`}
              className="hover:text-note flex items-baseline justify-between gap-6 py-4 text-base transition-colors duration-150"
            >
              <span className="min-w-0">{item.title}</span>
              <span className="text-muted-foreground shrink-0 text-sm">
                {dateLabel(item.publishedAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/blog" className="link-draw text-muted-foreground mt-4 inline-block text-sm">
        all posts →
      </Link>
    </section>
  );
}
