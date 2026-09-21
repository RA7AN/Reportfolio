import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { SectionLabel } from '@/components/home/SectionLabel';
import { WorkCard } from '@/components/work/WorkCard';
import { getExperiences, getProjects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Experience and selected projects.',
};

export default function WorkPage() {
  const experiences = getExperiences();
  const projects = getProjects().filter((item) => item.kind !== 'research');

  return (
    <PageShell>
      <main>
        <Container className="max-w-5xl pt-12 pb-24">
          <h1 className="font-mono text-[11px] tracking-[0.22em] uppercase">Work</h1>
          <p className="text-muted-foreground mt-3 max-w-xl text-sm">
            Production engineering and the projects that show how the systems were built.
          </p>

          <section className="mt-14">
            <SectionLabel index="01" title="Experience" />
            <div className="divide-border border-border divide-y border-y">
              {experiences.map((job) => (
                <div key={job.id} className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr]">
                  <p className="text-muted-foreground font-mono text-[11px] tracking-[0.12em] uppercase">
                    {job.startDate} → {job.endDate}
                  </p>
                  <div>
                    <h2 className="text-lg font-medium">{job.company}</h2>
                    <p className="text-primary mt-1 font-mono text-[11px] tracking-[0.14em] uppercase">
                      {job.role}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">{job.location}</p>
                    <ul className="text-muted-foreground mt-3 space-y-1 text-sm leading-relaxed">
                      {job.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <SectionLabel index="02" title="Selected projects" />
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <WorkCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        </Container>
      </main>
    </PageShell>
  );
}
