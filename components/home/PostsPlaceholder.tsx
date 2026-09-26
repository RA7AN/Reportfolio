'use client';

import { useState } from 'react';

const posts = [
  {
    handle: '@placeholder',
    name: 'Signal one',
    body: 'Placeholder post. Swap in a real screenshot, tweet, or LinkedIn embed later.',
  },
  {
    handle: '@lab-notes',
    name: 'Signal two',
    body: 'Another keep-worthy note. This card is fake so the layout can be judged without third-party widgets.',
  },
  {
    handle: '@shipped',
    name: 'Signal three',
    body: 'Third card for the grid. Load more reveals one extra dummy item.',
  },
  {
    handle: '@extra',
    name: 'Signal four',
    body: 'Hidden until load more. Discard this whole section if it does not belong.',
  },
];

export function PostsPlaceholder() {
  const [count, setCount] = useState(3);

  return (
    <section
      className="pt-20 sm:pt-24"
      id="posts"
      data-nerd="posts: dummy cards, no tweet embeds yet"
    >
      <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
        on the timeline
      </p>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">posts worth keeping</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {posts.slice(0, count).map((post) => (
          <article key={post.handle} className="border-border rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium">{post.name}</p>
                <p className="text-muted-foreground text-[12px]">{post.handle}</p>
              </div>
              <span className="text-muted-foreground text-lg">𝕏</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{post.body}</p>
          </article>
        ))}
      </div>
      {count < posts.length ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="border-border rounded-full border px-4 py-1.5 text-[13px]"
            onClick={() => setCount(posts.length)}
          >
            load more
          </button>
        </div>
      ) : null}
    </section>
  );
}
