import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), geolocation=(), microphone=()',
  },
];

const nextConfig: NextConfig = {
  // the nav item was renamed from beats to community, so the old music-page
  // route stays reachable instead of 404ing on any link still pointing at it
  async redirects() {
    return [{ source: '/beats', destination: '/community', permanent: true }];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
