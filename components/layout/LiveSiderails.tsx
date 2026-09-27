'use client';

import { useEffect, useRef, useState } from 'react';

type RailSection = { id: string; label: string; short: string };

const sections: RailSection[] = [
  { id: 'overview', label: 'overview', short: '01' },
  { id: 'work', label: 'work', short: '02' },
  { id: 'notes', label: 'notes', short: '03' },
  { id: 'work-with-me', label: 'contact', short: '04' },
];

export function LiveSiderails() {
  const artRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState('overview');
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement) setActive(visible.target.id);
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.2, 0.55] },
    );
    nodes.forEach((node) => observer.observe(node));

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      setProgress(nextProgress);
      artRef.current?.style.setProperty('--art-shift', `${nextProgress * -32}px`);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const copyHandle = async () => {
    try {
      await navigator.clipboard.writeText('hey.jawwad@gmail.com');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = 'mailto:hey.jawwad@gmail.com';
    }
  };

  return (
    <>
      <div ref={artRef} className="site-rails-grid" aria-hidden="true">
        <svg className="site-rails-art" viewBox="0 0 1600 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="rail-ink" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity=".05" />
              <stop offset=".48" stopColor="currentColor" stopOpacity=".52" />
              <stop offset="1" stopColor="currentColor" stopOpacity=".08" />
            </linearGradient>
          </defs>
          <g className="site-rails-art__ghost" fill="none" stroke="currentColor">
            <path d="M-80 190 C 120 54, 220 332, 390 184 S 650 58, 780 204 S 1010 355, 1170 176 S 1450 28, 1690 190" />
            <path d="M-90 720 C 100 604, 190 780, 350 662 S 610 528, 750 680 S 1000 812, 1190 632 S 1480 542, 1690 700" />
            <path
              className="site-rails-art__script"
              d="M-70 476 C 90 444, 140 292, 270 376 C 368 440, 286 586, 402 592 C 536 600, 472 310, 610 300 C 760 288, 690 574, 834 550 C 978 526, 920 338, 1042 364 C 1176 392, 1098 612, 1262 578 C 1400 550, 1374 410, 1680 440"
            />
            <path d="M28 0 C 190 140, 94 248, 220 340 S 388 584, 310 900" />
            <path d="M1572 0 C 1418 160, 1510 260, 1384 368 S 1238 600, 1306 900" />
            <path
              stroke="url(#rail-ink)"
              strokeDasharray="2 14"
              d="M-40 120 H1640 M-40 780 H1640"
            />
          </g>
          <g className="site-rails-art__nodes" fill="currentColor">
            <circle cx="270" cy="376" r="4" />
            <circle cx="610" cy="300" r="3" />
            <circle cx="834" cy="550" r="4" />
            <circle cx="1262" cy="578" r="3" />
          </g>
          <g
            className="site-rails-art__ticks"
            fill="currentColor"
            fontFamily="monospace"
            fontSize="10"
          >
            <text x="24" y="150">
              A / 01
            </text>
            <text x="1370" y="750">
              B / 04
            </text>
          </g>
        </svg>
      </div>
      <aside className="site-rail site-rail--left" aria-label="Page progress">
        <div className="site-rail__inner">
          <div className="site-rail__topline">
            <span className="site-rail__pulse" />
            <span>live index</span>
          </div>
          <div className="site-rail__track">
            <span className="site-rail__track-fill" style={{ height: `${progress * 100}%` }} />
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`site-rail__marker ${active === section.id ? 'is-active' : ''}`}
                aria-label={`Jump to ${section.label}`}
                aria-current={active === section.id ? 'location' : undefined}
              >
                <span>{section.short}</span>
                <i />
                <strong>{section.label}</strong>
              </a>
            ))}
          </div>
          <div className="site-rail__readout">
            <span>scroll</span>
            <b>
              {Math.round(progress * 100)
                .toString()
                .padStart(2, '0')}
              %
            </b>
          </div>
        </div>
      </aside>
      <aside className="site-rail site-rail--right" aria-label="Quick actions">
        <div className="site-rail__inner site-rail__inner--right">
          <div className="site-rail__topline site-rail__topline--right">
            <span>utility / 04</span>
            <span className="site-rail__signal">+</span>
          </div>
          <div className="site-rail__actions">
            <a href="/projects" className="site-rail__action" aria-label="Open projects">
              <span>work</span>
              <b>↗</b>
            </a>
            <a href="#work-with-me" className="site-rail__action" aria-label="Jump to contact">
              <span>talk</span>
              <b>↘</b>
            </a>
            <button
              type="button"
              className="site-rail__action"
              onClick={copyHandle}
              aria-label="Copy email address"
            >
              <span>{copied ? 'copied' : 'email'}</span>
              <b>{copied ? '✓' : '@'}</b>
            </button>
            <a
              href="#overview"
              className="site-rail__action site-rail__action--top"
              aria-label="Back to top"
            >
              <span>top</span>
              <b>↑</b>
            </a>
          </div>
          <div className="site-rail__footer-note">
            built with
            <br />
            curiosity
          </div>
        </div>
      </aside>
    </>
  );
}
