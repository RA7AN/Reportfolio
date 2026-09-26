import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { CaseStudyFlipStack } from '@/components/ui/case-study-flip-stack';
import { getProjects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected builds, research, and shipped software.',
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <PageShell>
      <main>
        <CaseStudyFlipStack
          hint="scroll"
          heading="everything I have shipped."
          endLabel="that's the stack"
          items={projects.map((project, index) => ({
            number: String(index + 1).padStart(2, '0'),
            eyebrow:
              project.isResearch === 'yes'
                ? 'research'
                : (project.tools[0] ?? project.dateLabel).toLowerCase(),
            title: project.title,
            description: project.highlights[0] ?? project.dateLabel,
            image: `/projects/${project.id}.svg`,
            imageAlt: `${project.title} screenshot placeholder`,
            background: index % 2 === 0 ? '#111111' : '#161616',
            foreground: '#edebe6',
            href: project.url ?? undefined,
          }))}
        />
        <div className="px-6 pb-16 text-center">
          <Link href="/" className="text-muted-foreground inline-block text-[13px]">
            ← back
          </Link>
        </div>
      </main>
    </PageShell>
  );
}
