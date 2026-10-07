import type { Metadata, Viewport } from 'next';
import { Caveat, Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { SiteUiProvider } from '@/components/layout/SiteUi';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { env } from '@/lib/env';
import './globals.css';

// pauses the landing's hero animations behind the wip curtain before first paint
// on every full page load (html.intro-pending). runs once per document load; the
// IntroGate component re-arms the pause itself on client-side navigations.
const INTRO_GATE_BOOTSTRAP =
  "try{if(location.pathname==='/'){document.documentElement.classList.add('intro-pending')}}catch(e){}";

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
  weight: '500',
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
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.svg', type: 'image/svg+xml' }],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <SiteUiProvider>
          <Script
            id="intro-gate-bootstrap"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: INTRO_GATE_BOOTSTRAP }}
          />
          <SmoothScroll>{children}</SmoothScroll>
        </SiteUiProvider>
      </body>
    </html>
  );
}
