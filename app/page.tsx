import type { Metadata } from 'next';
import { BookingPlaceholder } from '@/components/home/BookingPlaceholder';
import { ExperienceList } from '@/components/home/ExperienceList';
import { Filmstrip } from '@/components/home/Filmstrip';
import { Globe } from '@/components/home/Globe';
import { HomeInner } from '@/components/home/HomeInner';
import { LetterTitle, RiseIn } from '@/components/home/RiseIn';
import { LocalClock } from '@/components/home/LocalClock';
import { PostsPlaceholder } from '@/components/home/PostsPlaceholder';
import { ReelsPlaceholder } from '@/components/home/ReelsPlaceholder';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StackGrid } from '@/components/home/StackGrid';
import { Ventures } from '@/components/home/Ventures';
import { WorkGrid } from '@/components/home/WorkGrid';
import { WritingPreview } from '@/components/home/WritingPreview';
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

function initials(label: string) {
  const parts = label
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

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
  const stackPreview = skills.flatMap((group) => group.items).slice(0, 7);

  return (
    <PageShell>
      <main>
        <HomeInner className="pt-24 pb-8">
          <RiseIn
            delay={0.05}
            as="p"
            className="nerd-fade text-muted-foreground flex items-center gap-2 font-mono text-[12px]"
          >
            <span className="relative flex h-2 w-2">
              <span className="dot-ping absolute inline-flex h-full w-full rounded-full bg-[#3dba6a] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3dba6a]" />
            </span>
            open to freelance and full time work
          </RiseIn>
          <div className="relative mt-6">
            <LetterTitle text="abdul jawwad" />
            <span
              className="font-hand text-note rise-in absolute top-1 right-0 hidden -rotate-6 text-xl sm:block"
              style={{ animationDelay: '1.1s' }}
            >
              or just jawwad
            </span>
          </div>
          <RiseIn
            delay={0.5}
            as="p"
            className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#c4c2ba]"
          >
            {profile.headline.toLowerCase()} {profile.objective}
          </RiseIn>
          <RiseIn delay={0.6} className="mt-5">
            <LocalClock city={city} timeZone={timeZone} />
          </RiseIn>
          <RiseIn delay={0.72} className="relative mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#work-with-me"
              className="bg-foreground text-background rounded-full px-4 py-2 text-[13px] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              book a call
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="link-draw text-muted-foreground text-[13px]"
            >
              {profile.email}
            </a>
            <span className="font-hand text-note text-lg">I actually reply</span>
          </RiseIn>
          <RiseIn delay={0.85} className="mt-10">
            <p className="text-muted-foreground text-[11px] tracking-[0.14em] uppercase">
              my stack
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {stackPreview.map((item) => (
                <li
                  key={item}
                  title={item}
                  className="border-border hover:border-note/70 flex h-10 w-10 items-center justify-center rounded-full border text-[9px] font-medium transition-colors duration-150"
                >
                  {initials(item)}
                </li>
              ))}
              <li className="text-muted-foreground flex h-10 items-center px-2 text-[12px]">
                + more
              </li>
            </ul>
          </RiseIn>
          <RiseIn
            delay={1}
            className="border-border mt-14 grid grid-cols-2 gap-6 border-y py-8 sm:grid-cols-4"
          >
            <Stat value={`${experiences.length}+`} label="roles so far" />
            <Stat value={`${projects.length}+`} label="projects shipped" />
            <Stat value={`${publications.length}+`} label="papers and notes" />
            <Stat value={`${talks.length}+`} label="talks given" />
          </RiseIn>
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
      <p className="text-3xl tracking-tight">{value}</p>
      <p className="text-muted-foreground mt-1 text-[12px]">{label}</p>
    </div>
  );
}
