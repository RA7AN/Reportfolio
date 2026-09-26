'use client';

import { useState } from 'react';
import { LocalClock } from '@/components/home/LocalClock';

export function SiteFooter({
  city,
  timeZone,
  githubUrl,
  linkedinUrl,
}: {
  city: string;
  timeZone: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
}) {
  const [on, setOn] = useState(false);

  return (
    <footer
      className="border-border mt-8 border-t"
      data-nerd="footer: placeholder cassette, no canvas game"
    >
      <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-hand text-muted-foreground text-[17px]">
              one last thing before you go
            </p>
            <p className="font-hand text-muted-foreground mt-6 text-[16px]">
              a cassette, some vinyl, and you, space or tap to play
            </p>
          </div>
          <p className="font-hand text-muted-foreground text-[15px]">0 bets 0</p>
        </div>
        <button
          type="button"
          aria-pressed={on}
          onClick={() => setOn((value) => !value)}
          className="border-border mx-auto mt-10 flex h-7 w-12 items-center rounded-full border px-1"
        >
          <span
            className={`bg-note h-5 w-5 rounded-full transition-transform ${on ? 'translate-x-5' : ''}`}
          />
        </button>
        <p className="text-muted-foreground mt-3 text-center text-[11px]">
          {on ? 'placeholder player on · no audio yet' : 'placeholder player off'}
        </p>
        <div className="border-border mt-12 flex flex-wrap items-end justify-between gap-4 border-t pt-6">
          <div className="text-muted-foreground flex gap-4 text-[13px]">
            {githubUrl ? (
              <a href={githubUrl} rel="noreferrer">
                GitHub
              </a>
            ) : null}
            {linkedinUrl ? (
              <a href={linkedinUrl} rel="noreferrer">
                LinkedIn
              </a>
            ) : null}
          </div>
          <div className="text-muted-foreground text-right text-[12px]">
            <LocalClock city={city} timeZone={timeZone} />
            <p className="mt-1">made to be swapped</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
