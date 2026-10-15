import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SocialIcon } from '@/components/links/SocialIcon';
import { HomeInner } from '@/components/home/HomeInner';
import { PageShell } from '@/components/layout/PageShell';
import { getLinks, getProfile } from '@/lib/content';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Links',
  description: 'Places to find Abdul Jawwad.',
};

const CARD_CLASS =
  'border-border bg-card hover:border-muted-foreground/40 group flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-colors duration-200';

// paths on this site stay in the tab; anything else opens in a new one
function newTabProps(href: string) {
  return /^https?:/i.test(href) ? { target: '_blank', rel: 'noreferrer' } : {};
}

function LinkShell({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...newTabProps(href)}>
      {children}
    </a>
  );
}

function initials(fullName: string) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

export default function LinksPage() {
  const profile = getProfile();
  const links = getLinks();

  return (
    <PageShell>
      <main className="pb-24">
        <HomeInner className="pt-16">
          <div className="mx-auto w-full max-w-md">
            <div className="flex flex-col items-center text-center">
              <span
                aria-hidden
                className="border-border bg-card flex size-16 items-center justify-center rounded-full border text-lg font-medium tracking-tight"
              >
                {initials(profile.fullName)}
              </span>
              <h1 className="mt-5 text-2xl font-medium tracking-tight">{profile.fullName}</h1>
              {links.intro ? (
                <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-6 text-balance">
                  {links.intro}
                </p>
              ) : null}
            </div>

            {links.cards.length ? (
              <ul aria-label="links" className="mt-10 space-y-3">
                {links.cards.map((card) => (
                  <li key={`${card.title}-${card.href}`}>
                    <LinkShell href={card.href} className={CARD_CLASS}>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-medium tracking-tight">
                          {card.title}
                        </span>
                        <span className="text-muted-foreground mt-0.5 block text-[13px] leading-5">
                          {card.subtitle}
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-colors duration-200"
                      />
                    </LinkShell>
                  </li>
                ))}
              </ul>
            ) : null}

            {links.socials.length ? (
              <ul
                aria-label="social links"
                className="mt-12 flex flex-wrap items-center justify-center gap-0.5 sm:gap-1.5"
              >
                {links.socials.map((social) => (
                  <li key={`${social.icon}-${social.href}`}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      title={social.label}
                      className="text-muted-foreground hover:bg-card hover:text-foreground flex size-9 items-center justify-center rounded-full transition-colors duration-200 sm:size-10"
                      {...newTabProps(social.href)}
                    >
                      <SocialIcon name={social.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </HomeInner>
      </main>
    </PageShell>
  );
}
