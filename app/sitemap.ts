import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { getWriting } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.SITE_URL.replace(/\/$/, '');
  const staticPaths = [
    '/',
    '/about',
    '/writing',
    '/musings',
    '/start-here',
    '/projects',
    '/reads',
    '/resume',
    '/certificates',
  ];
  const lastModified = new Date();
  return [
    ...staticPaths.map((path) => ({
      url: path === '/' ? base : `${base}${path}`,
      lastModified,
      changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '/' ? 1 : 0.7,
    })),
    ...getWriting().map((item) => ({
      url: `${base}/writing/${item.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
