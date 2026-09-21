import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { SectionLabel } from '@/components/home/SectionLabel';
import { getPortfolio } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Experience, education, and publications.',
};

export default function ResumePage() {
  const data = getPortfolio();

  return (
    <PageShell>
      <main>
        <Container className="max-w-3xl pt-12 pb-24">
          <h1 className="text-3xl font-medium tracking-tight">{data.profile.fullName}</h1>
          <p className="text-primary mt-2 font-mono text-[11px] tracking-[0.16em] uppercase">
            {data.profile.headline}
          </p>
          <p className="text-muted-foreground mt-4 text-sm">{data.profile.email}</p>
          <p className="mt-6 text-sm leading-relaxed">{data.profile.objective}</p>

          <section className="mt-14">
            <SectionLabel index="01" title="Experience" />
            <div className="space-y-8">
              {data.experiences.map((job) => (
                <div key={job.id}>
                  <h2 className="font-medium">{job.role}</h2>
                  <p className="text-muted-foreground mt-1 font-mono text-[11px] tracking-[0.12em] uppercase">
                    {job.company} · {job.startDate} → {job.endDate}
                  </p>
                  <ul className="text-muted-foreground mt-3 space-y-1 text-sm">
                    {job.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <SectionLabel index="02" title="Education" />
            {data.education.map((item) => (
              <p key={item.id} className="mb-3 text-sm">
                {item.program} — {item.institution} ({item.endDate})
              </p>
            ))}
          </section>

          <section className="mt-14">
            <SectionLabel index="03" title="Publications" />
            <ul className="space-y-3">
              {data.publications.map((pub) => (
                <li key={pub.id} className="text-sm">
                  {pub.title}{' '}
                  <span className="text-muted-foreground">
                    ({pub.year}
                    {pub.venue ? `, ${pub.venue}` : ''})
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </Container>
      </main>
    </PageShell>
  );
}
