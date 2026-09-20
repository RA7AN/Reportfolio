import { env } from '@/lib/env';
import { getWriting } from '@/lib/content';

export function GET() {
  const base = env.SITE_URL.replace(/\/$/, '');
  const items = getWriting()
    .map(
      (item) => `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${base}/writing/${item.slug}</link>
      <guid>${base}/writing/${item.slug}</guid>
      <description><![CDATA[${item.summary ?? ''}]]></description>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Event Horizon — Writing</title>
    <link>${base}/writing</link>
    <description>Essays, notes, and links from Abdul Jawwad.</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
