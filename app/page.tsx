import type { Metadata } from 'next';
import Link from 'next/link';
import { EventHorizonVisual } from '@/components/home/EventHorizonVisual';
import { LocalClock } from '@/components/home/LocalClock';
import { SectionLabel } from '@/components/home/SectionLabel';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/button';
import { WorkCard } from '@/components/work/WorkCard';
import {
  getFeaturedProjects,
  getNow,
  getProfile,
  getPublications,
  getResearchProjects,
  getWritingList,
} from '@/lib/content';

export const metadata: Metadata = {
  title: 'Abdul Jawwad — AI Engineer · AI Researcher',
  description:
    'I build and study intelligent systems across agents, multimodal AI, and production software.',
};

function isPlaceholder(value: string | null | undefined) {
  return !value || value.startsWith('[PLACEHOLDER');
}

export default function HomePage() {
  const profile = getProfile();
  const featured = getFeaturedProjects();
  const now = getNow();
  const research = getResearchProjects();
  const publications = getPublications()
    .filter((item) => item.kind !== 'Magazine')
    .slice(0, 3);
  const latestWriting = getWritingList()[0];
  const city = profile.locationLabel ?? 'Jeddah';
  const timeZone = profile.timezone ?? 'Asia/Riyadh';

  return (
    <PageShell>
      <main className="pb-24">
        <Container className="max-w-5xl">
          <section className="pt-16 text-center md:pt-24" id="intro">
            <LocalClock city={city} timeZone={timeZone} />
            <h1 className="mt-10 text-3xl font-medium tracking-[0.18em] uppercase sm:text-5xl md:text-6xl">
              Abdul Jawaad
            </h1>
            <p className="text-primary mt-5 font-mono text-xs tracking-[0.22em] uppercase">
              {profile.headline}
            </p>
            <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
              {profile.objective}
            </p>
            <p className="text-muted-foreground/80 mx-auto mt-3 max-w-xl text-sm italic">
              Building the foundations of my universe.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link href="/work">Explore work</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/resume">View CV</Link>
              </Button>
            </div>
            <div className="text-muted-foreground mt-6 flex flex-wrap justify-center gap-5 font-mono text-[11px] tracking-[0.14em] uppercase">
              {profile.githubUrl ? (
                <a href={profile.githubUrl} className="hover:text-primary" rel="noreferrer">
                  GitHub
                </a>
              ) : null}
              {profile.linkedinUrl ? (
                <a href={profile.linkedinUrl} className="hover:text-primary" rel="noreferrer">
                  LinkedIn
                </a>
              ) : null}
              <a href={`mailto:${profile.email}`} className="hover:text-primary">
                Email
              </a>
            </div>
            <EventHorizonVisual />
          </section>

          <section className="mt-24" id="work">
            <SectionLabel index="01" title="Selected work" />
            <div className="grid gap-4 sm:grid-cols-2">
              {featured.map((project) => (
                <WorkCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          <section className="mt-24" id="now">
            <SectionLabel index="02" title="Now" />
            <p className="text-muted-foreground mb-6 font-mono text-[11px] tracking-[0.18em] uppercase">
              {now.period}
            </p>
            <dl className="divide-border border-border divide-y border-y">
              <NowRow label="Building" value={now.building} />
              <NowRow label="Exploring" value={now.exploring.join(' · ')} />
              <NowRow label="Experimenting" value={now.experimenting.join(' · ')} />
              <NowRow
                label="Reading"
                value={now.reading}
                placeholder={isPlaceholder(now.reading)}
              />
              <NowRow
                label="Thinking about"
                value={now.thinkingAbout}
                placeholder={isPlaceholder(now.thinkingAbout)}
              />
            </dl>
          </section>

          <section className="mt-24" id="research">
            <SectionLabel index="03" title="Research" />
            <div className="grid gap-4 md:grid-cols-3">
              {research.map((item) => (
                <WorkCard key={item.id} project={item} />
              ))}
              {publications.map((pub) => (
                <a
                  key={pub.id}
                  href={pub.url || '/resume'}
                  className="border-border bg-card/40 hover:border-primary/50 rounded-sm border p-5 transition-colors"
                >
                  <p className="text-muted-foreground font-mono text-[10px] tracking-[0.18em] uppercase">
                    {pub.kind} · {pub.year}
                  </p>
                  <h3 className="mt-3 text-base leading-snug font-medium">{pub.title}</h3>
                  {pub.venue ? (
                    <p className="text-muted-foreground mt-2 text-sm">{pub.venue}</p>
                  ) : null}
                </a>
              ))}
            </div>
          </section>

          <section className="mt-24" id="signals">
            <SectionLabel index="04" title="Signals" />
            <div className="grid gap-4 md:grid-cols-2">
              {latestWriting ? (
                <Link
                  href={`/writing/${latestWriting.slug}`}
                  className="border-border bg-card/40 hover:border-primary/50 rounded-sm border p-5 transition-colors"
                >
                  <p className="text-muted-foreground font-mono text-[10px] tracking-[0.18em] uppercase">
                    Latest writing
                  </p>
                  <h3 className="mt-3 text-lg font-medium">{latestWriting.title}</h3>
                  {latestWriting.summary ? (
                    <p className="text-muted-foreground mt-2 text-sm">{latestWriting.summary}</p>
                  ) : null}
                </Link>
              ) : null}
              <div className="border-border bg-card/40 rounded-sm border p-5">
                <p className="text-muted-foreground font-mono text-[10px] tracking-[0.18em] uppercase">
                  Currently reading
                </p>
                <p className="mt-3 text-lg font-medium">
                  {isPlaceholder(now.reading) ? 'Not listed yet' : now.reading}
                </p>
                {isPlaceholder(now.reading) ? (
                  <p className="text-muted-foreground mt-2 font-mono text-[10px]">{now.reading}</p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="mt-24" id="about">
            <SectionLabel index="05" title="About" />
            <p className="max-w-2xl text-base leading-relaxed">
              {isPlaceholder(profile.bio) ? profile.objective : profile.bio}
            </p>
            {isPlaceholder(profile.bio) ? (
              <p className="text-muted-foreground mt-3 font-mono text-[10px] tracking-[0.12em]">
                {profile.bio}
              </p>
            ) : null}
            <Link
              href="/about"
              className="text-primary mt-4 inline-block font-mono text-[11px] tracking-[0.16em] uppercase"
            >
              More about me
            </Link>
          </section>

          <section className="mt-24" id="contact">
            <SectionLabel index="06" title="Let’s talk" />
            <p className="text-muted-foreground max-w-xl text-sm">
              Email, GitHub, or LinkedIn. CV is one click away.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href={`mailto:${profile.email}`}>Email</a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/resume">View CV</Link>
              </Button>
            </div>
          </section>
        </Container>
      </main>
    </PageShell>
  );
}

function NowRow({
  label,
  value,
  placeholder,
}: {
  label: string;
  value: string;
  placeholder?: boolean;
}) {
  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[10rem_1fr] sm:items-baseline">
      <dt className="text-muted-foreground font-mono text-[11px] tracking-[0.16em] uppercase">
        {label}
      </dt>
      <dd className={placeholder ? 'text-muted-foreground text-sm' : 'text-sm leading-relaxed'}>
        {value}
      </dd>
    </div>
  );
}
