'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { useSiteUi } from '@/components/layout/SiteUi';
import type { TimelinePost } from '@/lib/content/schemas';

// X embed theme tokens, so the stand-in header matches the card beneath it —
// the real header sits fully covered under this overlay
type MaskTheme = {
  bg: string;
  text: string;
  muted: string;
  avatarBg: string;
  accent?: string;
  logo?: string;
};

const X_MASK_THEME: Record<'dark' | 'light', MaskTheme> = {
  dark: {
    bg: '#15202b',
    text: '#e7e9ea',
    muted: '#71767b',
    accent: '#1d9bf0',
    avatarBg: '#2f3b47',
    logo: '#e7e9ea',
  },
  light: {
    bg: '#ffffff',
    text: '#0f1419',
    muted: '#536471',
    accent: '#1d9bf0',
    avatarBg: '#e7e9ea',
    logo: '#536471',
  },
};

// LinkedIn embeds are always white; same stand-in, LinkedIn proportions
const LINKEDIN_MASK_THEME: MaskTheme = {
  bg: '#ffffff',
  text: '#191919',
  muted: '#666666',
  avatarBg: '#e8e8e8',
};

// Replaces the embed header with an anonymous look-alike (avatar, name,
// handle) and swallows every click so a masked card cannot navigate to the
// post or profile. The embeds render in cross-origin iframes we cannot style
// or intercept from inside, so the stand-in header and the click guard live
// on our side of the glass.
function AnonymousMask({ platform, light }: { platform: 'x' | 'linkedin'; light: boolean }) {
  const theme =
    platform === 'x' ? (light ? X_MASK_THEME.light : X_MASK_THEME.dark) : LINKEDIN_MASK_THEME;
  const heightClass = platform === 'x' ? 'h-[68px]' : 'h-20';
  const avatarSize = platform === 'x' ? 'h-10 w-10' : 'h-12 w-12';
  const iconSize = platform === 'x' ? 'h-5 w-5' : 'h-6 w-6';

  return (
    <>
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 z-10 ${heightClass}`}
        style={{
          backgroundColor: theme.bg,
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div className="flex items-start gap-3 px-4 pt-3">
          <span
            className={`flex ${avatarSize} items-center justify-center rounded-full`}
            style={{ backgroundColor: theme.avatarBg }}
          >
            <User className={iconSize} style={{ color: theme.muted }} strokeWidth={1.8} />
          </span>
          <span className="flex flex-col" style={{ lineHeight: 1.3 }}>
            <span className="text-[15px] font-bold" style={{ color: theme.text }}>
              Anonymous
            </span>
            <span className="text-[13px]" style={{ color: theme.muted }}>
              {platform === 'x' ? (
                <>
                  @johndoe · <span style={{ color: theme.accent }}>Follow</span>
                </>
              ) : (
                'Member'
              )}
            </span>
          </span>
        </div>
        {platform === 'x' ? (
          <span
            className="absolute top-3 right-4 text-lg leading-none"
            style={{ color: theme.logo }}
          >
            𝕏
          </span>
        ) : null}
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

// X's embed document is a white page with a rounded dark card floating inside
// it, so a crescent of that white body can peek through near the card's
// corner arc no matter where we clip — the document's arc and our clip arc
// are never perfectly concentric, and the white sits inside the card's own
// corner radius. XCornerCovers paints each corner (everything our 12px clip
// arc leaves visible) in the card's own background color: invisible against
// the card, but it covers any white underneath.
const X_CORNER_SIZE = 'h-3 w-3';

function XCornerCovers({ color }: { color: string }) {
  const base = `pointer-events-none absolute z-10 ${X_CORNER_SIZE}`;
  return (
    <>
      <div aria-hidden className={`${base} top-0 left-0`} style={{ backgroundColor: color }} />
      <div aria-hidden className={`${base} top-0 right-0`} style={{ backgroundColor: color }} />
      <div aria-hidden className={`${base} bottom-0 left-0`} style={{ backgroundColor: color }} />
      <div aria-hidden className={`${base} right-0 bottom-0`} style={{ backgroundColor: color }} />
    </>
  );
}

// height used until the embed document reports its natural height
const DEFAULT_X_HEIGHT = 350;

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

function xTweetEmbedUrl(tweetId: string, light: boolean): string {
  const theme = light ? 'light' : 'dark';
  return `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&theme=${theme}&dnt=true&lang=en`;
}

// The embed document postMessages its natural size to the parent as
// { "twttr.embed": { method: "twttr.private.resize", params: [{ height,
// data: { tweet_id } }] } } — the same JSON-RPC channel widgets.js uses —
// so the iframe can size itself to the tweet instead of a fixed guess.
type TwttrResizeParams = { width?: number; height?: number; data?: { tweet_id?: string } };
type TwttrEmbedMessage = {
  method?: string;
  params?: TwttrResizeParams[];
  // legacy flat format some builds send: { method: "height", id, height }
  id?: string;
  height?: number;
};
type TwttrHeightMessage = ({ 'twttr.embed'?: TwttrEmbedMessage } & TwttrEmbedMessage) | undefined;

export function TimelinePosts({ posts }: { posts: TimelinePost[] }) {
  const [visible, setVisible] = useState(4);
  const { light } = useSiteUi();
  const [xHeights, setXHeights] = useState<Record<string, number>>({});

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== 'https://platform.twitter.com') return;
      const raw = event.data as TwttrHeightMessage;
      const msg = raw?.['twttr.embed'] ?? raw;
      if (msg?.method === 'twttr.private.resize') {
        const param = msg.params?.[0];
        const tweetId = param?.data?.tweet_id;
        const height = param?.height;
        if (typeof tweetId === 'string' && typeof height === 'number') {
          setXHeights((prev) => ({ ...prev, [tweetId]: height }));
        }
        return;
      }
      // legacy flat format: { method: "height", id, height }
      if (msg?.method !== 'height') return;
      if (typeof msg.id !== 'string' || typeof msg.height !== 'number') return;
      const tweetId = msg.id.replace(/^twitter-widget-\d+$/, '');
      const height = msg.height;
      setXHeights((prev) => ({ ...prev, [tweetId]: height }));
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  if (posts.length === 0) return null;

  return (
    <section
      className="scroll-mt-20 py-20 sm:py-24"
      id="posts"
      data-nerd="posts: live x + linkedin embeds, first 4 then load more"
    >
      <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
        on the timeline
      </p>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">posts worth keeping</h2>

      {/* masonry via CSS multicol: cards pack tightly regardless of embed height */}
      <div className="mt-8 columns-1 gap-4 sm:columns-2">
        {posts.slice(0, visible).map((post) => {
          const tweetId = post.platform === 'x' ? xTweetId(post.url) : '';
          return (
            <div
              key={post.url}
              className="relative mb-4 break-inside-avoid overflow-hidden rounded-xl"
            >
              {post.platform === 'x' ? (
                <iframe
                  src={xTweetEmbedUrl(tweetId, light)}
                  title="X post"
                  loading="lazy"
                  height={xHeights[tweetId] ?? DEFAULT_X_HEIGHT}
                  className={`block w-full ${light ? 'bg-white' : 'bg-[#15202b]'}`}
                />
              ) : (
                <iframe
                  src={linkedinEmbedUrl(post.url)}
                  title="LinkedIn post"
                  height={540}
                  loading="lazy"
                  className="block w-full bg-white"
                />
              )}
              {post.platform === 'x' ? (
                <XCornerCovers color={light ? '#ffffff' : '#15202b'} />
              ) : null}
              {post.anonymous ? <AnonymousMask platform={post.platform} light={light} /> : null}
            </div>
          );
        })}
      </div>

      {visible < posts.length ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="border-border rounded-full border px-4 py-1.5 text-[13px]"
            onClick={() => setVisible(posts.length)}
          >
            load more
          </button>
        </div>
      ) : null}
    </section>
  );
}
