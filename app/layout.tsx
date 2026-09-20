import type { Metadata, Viewport } from 'next';
import { Fraunces, IBM_Plex_Sans } from 'next/font/google';
import { env } from '@/lib/env';
import './globals.css';

const ibmPlex = IBM_Plex_Sans({
  variable: '--font-ibm-plex',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
});

const SITE_DESCRIPTION =
  "Welcome to Abdul Jawwad's digital home. Exploring the intersection of AI research, systems engineering, and meaningful technology.";

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: 'Event Horizon — On a trajectory shaped by curiosity',
    template: '%s — Event Horizon',
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'Event Horizon',
    title: 'Event Horizon — On a trajectory shaped by curiosity',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Event Horizon — On a trajectory shaped by curiosity',
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${ibmPlex.variable} ${fraunces.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
