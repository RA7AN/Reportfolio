import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { CaseStudy } from '@/components/work/CaseStudy';
import { getProjectBySlug, getResearchProjects, projectSlug } from '@/lib/content';

type Params = { slug: string };

export function generateStaticParams() {
  return getResearchProjects().map((project) => ({ slug: projectSlug(project) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Research' };
  return { title: project.title, description: project.oneLiner ?? project.highlights[0] };
}

export default async function ResearchDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  if (project.kind !== 'research') redirect(`/projects/${projectSlug(project)}`);

  return (
    <PageShell>
      <Container>
        <CaseStudy project={project} />
      </Container>
    </PageShell>
  );
}
