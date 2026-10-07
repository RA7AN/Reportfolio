'use client';

import { useState, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Publication } from '@/lib/content/schemas';
import { cn } from '@/lib/utils';

// how many grid cards show before the button reveals the rest
const VISIBLE_COUNT = 3;

// the card's primary link: the article if we have it, else its doi
function primaryHref(item: Publication) {
  if (item.url) return item.url;
  return item.doi ? `https://doi.org/${item.doi}` : undefined;
}

function Thumb({ item, className }: { item: Publication; className?: string }) {
  return (
    <span className={cn('relative block overflow-hidden rounded-xl', className)}>
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt=""
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        // no cover art yet: a quiet pixel cluster holds the frame
        <span className="bg-muted flex size-full items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <span className="grid grid-cols-2 gap-[2px]">
            <span className="bg-note size-[5px] opacity-40" />
            <span className="bg-note size-[5px] opacity-70" />
            <span className="bg-note size-[5px] opacity-70" />
            <span className="bg-note size-[5px]" />
          </span>
        </span>
      )}
      {/* the tint keeps bright art calm on the dark card, and lightens on hover */}
      <span
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(to top, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.28) 55%, rgba(0, 0, 0, 0.06))',
        }}
      />
      {/* pixel cluster signature in the corner, like the contribution grid */}
      <span aria-hidden className="absolute right-2 bottom-2 grid grid-cols-2 gap-[2px]">
        <span className="bg-note size-[4px]" />
        <span className="bg-note size-[4px]" />
        <span className="bg-note size-[4px]" />
        <span className="bg-note size-[4px]" />
      </span>
    </span>
  );
}

// an anchor even without a href keeps the card markup identical; without one it
// simply is not focusable
function CardLink({
  item,
  className,
  children,
}: {
  item: Publication;
  className?: string;
  children: ReactNode;
}) {
  const href = primaryHref(item);
  return (
    <a
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      className={className}
    >
      {children}
    </a>
  );
}

export function PublicationsPreview({ items }: { items: Publication[] }) {
  const [expanded, setExpanded] = useState(false);
  if (items.length === 0) return null;

  // the top card is simply the first card of the cms order — the metadata sort rules
  const featured = items[0];
  const rest = items.slice(1);
  const shown = expanded ? rest : rest.slice(0, VISIBLE_COUNT);

  return (
    <section
      className="scroll-mt-20 py-20 sm:py-24"
      id="publications"
      data-nerd="publications: real cms data, lead card + grid, tinted thumbs with pixel clusters"
    >
      {/* eyebrow reads WRITING — this row superseded the old writing preview */}
      <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
        writing
      </p>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">things I have published</h2>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6 sm:text-base">
        papers, a case study, and one poem that snuck in
      </p>

      <div className="border-border group relative mt-8 rounded-2xl border p-5 transition-colors duration-200 hover:border-[#5a5a5a]">
        <CardLink item={featured} className="group relative block">
          <article>
            <ArrowUpRight
              className="text-muted-foreground group-hover:text-note absolute top-5 right-5 size-4 transition-colors duration-200"
              aria-hidden
            />
            <Thumb item={featured} className="aspect-[3/2] w-56 max-w-full" />
            <p className="text-note mt-4 font-mono text-[10px] tracking-widest uppercase">
              {featured.kind}
            </p>
            <h3 className="mt-1.5 text-xl font-medium tracking-tight sm:text-2xl">
              {featured.title}
            </h3>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {[featured.venue, featured.year].filter(Boolean).join(' · ')}
            </p>
            {featured.excerpt ? (
              <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">
                {featured.excerpt}
              </p>
            ) : null}
          </article>
        </CardLink>
        {/* extra links sit beside the card anchor, not inside it — anchors cannot nest */}
        {featured.links?.length ? (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {featured.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw text-note font-mono text-xs"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item, index) => {
          const href = primaryHref(item);
          return (
            <li
              key={item.id}
              className={index >= VISIBLE_COUNT ? 'rise-in' : undefined}
              style={
                index >= VISIBLE_COUNT
                  ? { animationDelay: `${(index - VISIBLE_COUNT) * 0.06}s` }
                  : undefined
              }
            >
              <CardLink
                item={item}
                className="border-border group flex h-full flex-col overflow-hidden rounded-2xl border transition-colors duration-200 hover:border-[#5a5a5a]"
              >
                <article className="flex h-full flex-col">
                  <Thumb item={item} className="aspect-[8/5] w-full rounded-none" />
                  <div className="flex grow flex-col p-4">
                    <h3 className="text-[15px] leading-snug font-medium tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 text-xs">
                      {[item.venue, item.year].filter(Boolean).join(' · ')}
                    </p>
                    {item.excerpt ? (
                      <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-6">
                        {item.excerpt}
                      </p>
                    ) : null}
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="text-muted-foreground rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase">
                        {item.kind}
                      </span>
                      {href ? (
                        <ArrowUpRight
                          className="text-muted-foreground group-hover:text-note size-4 transition-colors duration-200"
                          aria-hidden
                        />
                      ) : null}
                    </div>
                  </div>
                </article>
              </CardLink>
            </li>
          );
        })}
      </ul>
      {rest.length > VISIBLE_COUNT ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="border-border bg-background text-muted-foreground hover:text-foreground rounded-full border px-5 py-2 text-[13px] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'show less' : 'more written things'}
          </button>
        </div>
      ) : null}
    </section>
  );
}
