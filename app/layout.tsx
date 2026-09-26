import type { Metadata, Viewport } from 'next';
import { Caveat, Geist, Geist_Mono } from 'next/font/google';
import { SiteUiProvider } from '@/components/layout/SiteUi';
import { env } from '@/lib/env';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  weight: ['400', '600'],
});

const SITE_DESCRIPTION =
  'I build and study intelligent systems across agents, multimodal AI, and production software.';

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: 'Abdul Jawwad — AI Engineer · AI Researcher',
    template: '%s — Abdul Jawwad',
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'Abdul Jawwad',
    title: 'Abdul Jawwad — AI Engineer · AI Researcher',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abdul Jawwad — AI Engineer · AI Researcher',
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <SiteUiProvider>{children}</SiteUiProvider>
      </body>
    </html>
  );
}
