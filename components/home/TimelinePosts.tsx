'use client';

import 'react-tweet/theme.css';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Tweet } from 'react-tweet';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { User } from 'lucide-react';
import { useSiteUi } from '@/components/layout/SiteUi';
import type { TimelinePost } from '@/lib/content/schemas';

// react-tweet theme tokens, so the stand-in header matches the card beneath
// it — the real header sits fully covered under this overlay
type MaskTheme = {
  text: string;
  muted: string;
  avatarBg: string;
  // X cards take the stand-in header's background from the data-theme-scoped
  // .x-anon-mask class in globals.css (exactly react-tweet's own card
  // background); only the always-white LinkedIn embed needs one here
  bg?: string;
  // X-only: "Follow" accent and the brand-glyph color
  accent?: string;
  logo?: string;
};

const X_MASK_THEME: Record<'dark' | 'light', MaskTheme> = {
  dark: {
    text: '#f7f9f9',
    muted: '#8b98a5',
    avatarBg: '#2f3b47',
    accent: '#6bc9fb',
    logo: '#f7f9f9',
  },
  light: {
    text: '#0f1419',
    muted: '#536471',
    avatarBg: '#e7e9ea',
    accent: '#1d9bf0',
    logo: '#0f1419',
  },
};

// LinkedIn embeds are always white; same stand-in, LinkedIn proportions
const LINKEDIN_MASK_THEME: MaskTheme = {
  bg: '#ffffff',
  text: '#191919',
  muted: '#666666',
  avatarBg: '#e8e8e8',
};

// Replaces the card header with an anonymous look-alike (avatar, name,
// handle) and swallows every click so a masked card cannot navigate to the
// post or profile. X cards render as real DOM (react-tweet), LinkedIn cards
// as cross-origin iframes; the stand-in header and the click guard live on
// our side of the glass in both cases.
function AnonymousMask({ platform, light }: { platform: 'x' | 'linkedin'; light: boolean }) {
  const isX = platform === 'x';
  const theme = isX ? (light ? X_MASK_THEME.light : X_MASK_THEME.dark) : LINKEDIN_MASK_THEME;

  return (
    <>
      {/* On X the stand-in covers exactly the real header's content box — 1px
          card border + 16px side padding + 12px top padding in from the card
          edge, 48px tall — so the card's own border, corners, and padding
          band stay untouched and no clipping is needed. LinkedIn's embed
          header is flush to the iframe's top edge inside its clipped
          wrapper. */}
      <div
        aria-hidden
        className={`absolute z-10 ${
          isX ? 'x-anon-mask top-[13px] right-[17px] left-[17px] h-12' : 'inset-x-0 top-0 h-20'
        }`}
        style={{
          backgroundColor: isX ? undefined : theme.bg,
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div className={`flex ${isX ? 'h-full items-center' : 'items-start gap-3 px-4 pt-3'}`}>
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: theme.avatarBg }}
          >
            <User className="h-6 w-6" style={{ color: theme.muted }} strokeWidth={1.8} />
          </span>
          <span
            className={`flex flex-col ${isX ? 'ml-2 justify-center' : ''}`}
            style={{ lineHeight: 1.3 }}
          >
            <span className="text-[15px] font-bold" style={{ color: theme.text }}>
              Anonymous
            </span>
            <span className="text-[13px]" style={{ color: theme.muted }}>
              {isX ? (
                <>
                  @johndoe · <span style={{ color: theme.accent }}>Follow</span>
                </>
              ) : (
                'Member'
              )}
            </span>
          </span>
          {isX ? (
            /* react-tweet's own brand icon: the X glyph, 23.75px, currentColor */
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="ml-auto h-[23.75px] w-[23.75px]"
              style={{ color: theme.logo, fill: 'currentColor' }}
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          ) : null}
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 z-20 cursor-default"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />
    </>
  );
}

// Static fallback for an X post: shown while the tweet loads, and again if it
// cannot be fetched — the same link-card role the reference site uses
function XLinkCard({ id, note }: { id: string; note: string }) {
  return (
    <a
      href={`https://x.com/i/status/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="border-border text-muted-foreground hover:text-foreground bg-muted/60 flex min-h-28 flex-col justify-between rounded-2xl border p-5 text-sm transition-colors duration-200 hover:border-[#5a5a5a]"
    >
      <span>{note}</span>
      <span className="text-muted-foreground/70 mt-3 font-mono text-[11px]">open on x.com ↗</span>
    </a>
  );
}

// LinkedIn's official embed is an iframe served from /embed/feed/update/.
// Derive it from a normal post URL's urn:li id — copy-link URLs use
// "activity:123…", share URLs use "ugcPost-123…", "ugcPost:123…", or
// "urn:li:share:123…". Every embed gets collapsed=1 so the post renders the
// way it appears in the LinkedIn feed: clipped, with a "...more" button,
// instead of the tall fully-expanded document.
function linkedinEmbedUrl(url: string): string {
  const withCollapsed = (embedUrl: string) => {
    const [base, query = ''] = embedUrl.split('?');
    const params = new URLSearchParams(query);
    params.set('collapsed', '1');
    return `${base}?${params.toString()}`;
  };
  const urn = url.match(/urn:li:(activity|ugcPost|share):(\d+)/i);
  if (urn) {
    return withCollapsed(`https://www.linkedin.com/embed/feed/update/urn:li:${urn[1]}:${urn[2]}`);
  }
  const bareUgcPost = url.match(/ugcPost[-:](\d+)/);
  if (bareUgcPost) {
    return withCollapsed(
      `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${bareUgcPost[1]}`,
    );
  }
  if (url.includes('/embed/feed/update/')) return withCollapsed(url);
  return url;
}

// Same id the CMS loader validated at build time.
function xTweetId(url: string): string {
  const match = url.match(/(?:x|twitter)\.com\/[^/]+\/status(?:es)?\/(\d+)/);
  return match ? match[1] : '';
}

// One timeline card, keyed by its post url.
function TimelineCard({ post, light }: { post: TimelinePost; light: boolean }) {
  if (post.platform === 'x') {
    const tweetId = xTweetId(post.url);
    // `group` gates the hover shade lift to anonymous cards
    return (
      <div className={post.anonymous ? 'group relative' : 'relative'}>
        <Tweet
          id={tweetId}
          apiUrl={`/api/tweet/${tweetId}`}
          fallback={<XLinkCard id={tweetId} note="loading tweet..." />}
          components={{
            TweetNotFound: () => (
              <XLinkCard id={tweetId} note="this one would not load, but it is a good one." />
            ),
          }}
        />
        {post.anonymous ? <AnonymousMask platform="x" light={light} /> : null}
      </div>
    );
  }
  return (
    <div className="border-border bg-muted/60 relative overflow-hidden rounded-2xl border">
      <iframe
        src={linkedinEmbedUrl(post.url)}
        title="LinkedIn post"
        height={540}
        loading="lazy"
        className="block w-full bg-white"
      />
      {post.anonymous ? <AnonymousMask platform="linkedin" light={light} /> : null}
    </div>
  );
}

/** Wall-clock reveal queue: cards that enter the viewport in the same
 * burst (right after the fold opens) cascade one after another this many
 * seconds apart in sortOrder, while a card reached by scrolling on its own
 * starts fading in immediately — a fixed per-index delay instead makes
 * later sortOrders keep you waiting as you scroll. */
const REVEAL_GAP = 0.3;
let revealCursor = -1;

/** the reference site's Reveal: cards rise 12px and fade in the first time
 * they scroll into view (8% past the bottom edge). Cards hidden by the fold
 * stay transparent until it opens and they scroll into view. */
function Reveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });
  const [revealed, setRevealed] = useState(false);
  const [delay, setDelay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current || reduceMotion) return;
    startedRef.current = true;
    const now = performance.now() / 1000;
    revealCursor = Math.max(revealCursor + REVEAL_GAP, now);
    setDelay(revealCursor - now);
    setRevealed(true);
  }, [inView, reduceMotion]);

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={revealed ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

export function TimelinePosts({ posts }: { posts: TimelinePost[] }) {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const { light } = useSiteUi();

  if (posts.length === 0) return null;

  // Fill the two columns row by row — 1 beside 2, 3 below 1 — so the grid
  // reads in sortOrder. CSS multicol packs tightly too, but fills column
  // first, which puts 3 beside 1. Each column stacks its cards
  // independently, so uneven card heights still pack without dead space.
  const leftColumn = posts.filter((_, i) => i % 2 === 0);
  const rightColumn = posts.filter((_, i) => i % 2 === 1);

  return (
    <section
      className="scroll-mt-20 py-20 sm:py-24"
      id="posts"
      data-nerd="posts: react-tweet + linkedin iframes"
    >
      <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
        on the timeline
      </p>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">posts worth keeping</h2>

      {/* the reference site's fold: cap the grid at a fixed height and fade
          the overshoot into the page background instead of counting rows;
          the button unfolds it and folds it back. data-theme drives
          react-tweet's dark/light palette */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 680 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: 'easeInOut' }}
        className="relative mt-8 overflow-hidden"
      >
        <div className="flex flex-col gap-4 sm:hidden" data-theme={light ? 'light' : 'dark'}>
          {posts.map((post) => (
            <Reveal key={post.url}>
              <TimelineCard post={post} light={light} />
            </Reveal>
          ))}
        </div>

        {/* two columns from sm up: evens down the left, odds down the right,
            which lands as 1 beside 2, 3 below 1, … in sortOrder */}
        <div className="hidden gap-4 sm:flex" data-theme={light ? 'light' : 'dark'}>
          <div className="flex flex-1 flex-col gap-4">
            {leftColumn.map((post) => (
              <Reveal key={post.url}>
                <TimelineCard post={post} light={light} />
              </Reveal>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-4">
            {rightColumn.map((post) => (
              <Reveal key={post.url}>
                <TimelineCard post={post} light={light} />
              </Reveal>
            ))}
          </div>
        </div>

        {!expanded ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 [mask-image:linear-gradient(to_top,black,transparent)] backdrop-blur-[2px]"
            />
            <div
              aria-hidden
              className="from-background via-background/60 pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t to-transparent"
            />
          </>
        ) : null}
      </motion.div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          aria-expanded={expanded}
          className="border-border bg-background rounded-full border px-4 py-1.5 text-[13px]"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'fold them back' : 'load more'}
        </button>
      </div>
    </section>
  );
}
