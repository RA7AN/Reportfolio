import type { Metadata } from 'next';
import { HomeInner } from '@/components/home/HomeInner';
import { PageShell } from '@/components/layout/PageShell';
import { getProfile } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Links',
  description: 'Places to find Abdul Jawwad.',
};

export default function LinksPage() {
  const profile = getProfile();
  const links = [
    { label: 'email', href: `mailto:${profile.email}` },
    { label: 'github', href: profile.githubUrl },
    { label: 'linkedin', href: profile.linkedinUrl },
    { label: 'orcid', href: profile.orcidUrl },
    { label: 'cv', href: '/resume' },
  ].filter((item) => Boolean(item.href));

  return (
    <PageShell>
      <main className="pb-24">
        <HomeInner className="pt-16">
          <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
            links
          </p>
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
            link in bio, basically
          </h1>
          <ul className="mt-10 space-y-3">
            {links.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href ?? '#'}
                  className="border-border hover:border-note block rounded-full border px-5 py-3 text-[15px]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </HomeInner>
      </main>
    </PageShell>
  );
}
