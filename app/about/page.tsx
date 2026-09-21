import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/button';
import { getEducation, getExperiences, getProfile } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description: 'Abdul Jawwad — AI engineer and AI researcher.',
};

export default function AboutPage() {
  const profile = getProfile();
  const current = getExperiences()[0];
  const school = getEducation()[0];

  return (
    <PageShell>
      <main>
        <Container className="max-w-3xl pt-12 pb-24">
          <h1 className="font-mono text-[11px] tracking-[0.22em] uppercase">About</h1>
          <h2 className="mt-6 text-3xl font-medium tracking-tight">{profile.fullName}</h2>
          <p className="text-primary mt-3 font-mono text-[11px] tracking-[0.16em] uppercase">
            {profile.headline}
          </p>
          <p className="mt-6 text-base leading-relaxed">{profile.objective}</p>
          {current ? (
            <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
              Currently {current.role} at {current.company} ({current.startDate} → {current.endDate}
              ).
            </p>
          ) : null}
          {school ? (
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {school.program}, {school.institution}.
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href={`mailto:${profile.email}`}>Email</a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/start-here">Start here</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/resume">CV</Link>
            </Button>
          </div>
        </Container>
      </main>
    </PageShell>
  );
}
