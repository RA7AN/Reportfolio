import type { Metadata } from 'next';
import { BookingPlaceholder } from '@/components/home/BookingPlaceholder';
import { ExperienceList } from '@/components/home/ExperienceList';
import { Filmstrip } from '@/components/home/Filmstrip';
import { Globe } from '@/components/home/Globe';
import { HomeInner } from '@/components/home/HomeInner';
import { HeroVerbLoop } from '@/components/home/HeroVerbLoop';
import { LetterTitle, RiseIn } from '@/components/home/RiseIn';
import { LocalClock } from '@/components/home/LocalClock';
import { PostsPlaceholder } from '@/components/home/PostsPlaceholder';
import { ReelsPlaceholder } from '@/components/home/ReelsPlaceholder';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StackGrid } from '@/components/home/StackGrid';
import { StackMarks } from '@/components/home/StackMarks';
import { Ventures } from '@/components/home/Ventures';
import { WorkGrid } from '@/components/home/WorkGrid';
import { WritingPreview } from '@/components/home/WritingPreview';
import { ScribbleArrow } from '@/components/layout/SiteIcons';
import { PageShell } from '@/components/layout/PageShell';
import {
  getExperiences,
  getProfile,
  getProjects,
  getPublications,
  getSkills,
  getTalks,
  getWritingList,
} from '@/lib/content';

export const metadata: Metadata = {
  title: 'Abdul Jawwad — AI Engineer · AI Researcher',
  description:
    'I build and study intelligent systems across agents, multimodal AI, and production software.',
};

export default function HomePage() {
  const profile = getProfile();
  const experiences = getExperiences();
  const projects = getProjects();
  const publications = getPublications();
  const talks = getTalks();
  const skills = getSkills();
  const writing = getWritingList().slice(0, 3);
  const city = profile.location ?? 'Jeddah';
  const timeZone = 'Asia/Riyadh';

  return (
    <PageShell>
      <main>
        <HomeInner className="pt-10 pb-16 sm:pt-36 sm:pb-24">
          <section data-nerd="hero: css stagger 40ms, rise-in 0.5s cubic">
            <RiseIn
              delay={0.05}
              as="p"
              className="nerd-fade text-muted-foreground flex items-center gap-2 font-mono text-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="dot-ping absolute inline-flex h-full w-full rounded-full bg-[#3dba6a] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3dba6a]" />
              </span>
              open to freelance and full time work
            </RiseIn>
            <div className="relative mt-6 w-fit">
              <LetterTitle text="abdul jawwad" />
              <span
                className="rise-in absolute top-2 left-full ml-5 hidden whitespace-nowrap md:inline-flex"
                style={{ animationDelay: '1.1s' }}
              >
                <span className="text-note inline-flex items-start gap-1">
                  <ScribbleArrow toward="left" className="mt-2 h-10 w-11 shrink-0" />
                  <span className="font-hand text-xl leading-tight sm:text-2xl">
                    or just jawwad
                  </span>
                </span>
              </span>
            </div>
            <RiseIn
              delay={0.5}
              as="p"
              aria-label="Full-stack Engineer, AI researcher and reader. I design reliable, useful AI agents by day and think about AGI at night."
              className="text-muted-foreground mt-5 max-w-xl text-lg leading-7 sm:text-xl"
            >
              Full-stack Engineer, AI researcher and reader. I design reliable, useful AI agents by
              day and <HeroVerbLoop /> AGI at night.
            </RiseIn>
            <RiseIn delay={0.6} className="mt-4">
              <LocalClock city={city} timeZone={timeZone} />
            </RiseIn>
            <RiseIn delay={0.72} className="relative mt-10 flex flex-wrap items-end gap-5">
              <a
                href="#work-with-me"
                className="bg-foreground text-background inline-flex h-11 items-center rounded-full px-6 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                book a call
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="link-draw text-muted-foreground py-2 text-sm"
              >
                {profile.email}
              </a>
              <span className="-mb-2 hidden md:inline-flex">
                <span className="text-note inline-flex items-start gap-1">
                  <span className="font-hand text-xl leading-tight sm:text-2xl">
                    I actually reply
                  </span>
                  <ScribbleArrow toward="down-left" className="mt-2 h-10 w-11 shrink-0" />
                </span>
              </span>
            </RiseIn>
            <RiseIn
              delay={0.85}
              className="mt-12 overflow-visible"
              data-nerd="stack preview: simple icons, hover enlarge"
            >
              <StackMarks />
            </RiseIn>
            <RiseIn
              delay={1}
              className="border-border mt-16 grid grid-cols-2 gap-8 border-y py-10 sm:grid-cols-4 sm:py-12"
              data-nerd="stats: cms row counts, no count-up yet"
            >
              <Stat value={`${experiences.length}+`} label="roles so far" />
              <Stat value={`${projects.length}+`} label="projects shipped" />
              <Stat value={`${publications.length}+`} label="papers and notes" />
              <Stat value={`${talks.length}+`} label="talks given" />
            </RiseIn>
          </section>
        </HomeInner>

        <HomeInner>
          <ExperienceList items={experiences} />
          <WorkGrid projects={projects} />
          <Ventures />
          <StackGrid skills={skills} />
        </HomeInner>

        <Filmstrip />

        <HomeInner>
          <Globe />
          <PostsPlaceholder />
          <WritingPreview items={writing} />
          <ReelsPlaceholder />
          <BookingPlaceholder email={profile.email} />
        </HomeInner>
      </main>
      <SiteFooter
        city={city}
        timeZone={timeZone}
        githubUrl={profile.githubUrl}
        linkedinUrl={profile.linkedinUrl}
      />
    </PageShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-3xl font-medium tracking-tight sm:text-4xl">{value}</p>
      <p className="text-muted-foreground mt-2 text-sm">{label}</p>
    </div>
  );
}
