'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';

import { cn } from '@/lib/utils';

export type CaseStudyFlipItem = {
  number?: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  background: string;
  foreground?: string;
  href?: string;
};

type CaseStudyFlipStackProps = {
  items: CaseStudyFlipItem[];
  hint?: string;
  heading?: string;
  endLabel?: string;
  className?: string;
};

function FlipCard({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: CaseStudyFlipItem;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const rotateX = useTransform(scrollYProgress, [start, end], [0, 90]);
  const y = useTransform(scrollYProgress, [start, end], ['0%', '-20%']);
  const brightness = useTransform(scrollYProgress, [start, end], [1, 0.55]);
  const filter = useTransform(brightness, (value) => `brightness(${value})`);
  const zIndex = total - index;
  const foreground = item.foreground ?? '#edebe6';

  return (
    <motion.article
      style={{
        rotateX,
        y,
        filter,
        zIndex,
        background: item.background,
        color: foreground,
        transformOrigin: 'top center',
        transformStyle: 'preserve-3d',
      }}
      className="absolute inset-0 grid grid-rows-[1fr_42%] overflow-hidden rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:grid-cols-[1.15fr_0.85fr] md:grid-rows-none"
    >
      <div className="flex min-h-0 flex-col justify-between gap-6 overflow-hidden p-6 sm:gap-10 sm:p-10 lg:p-14">
        <span className="font-mono text-xs tracking-[0.22em] uppercase opacity-70">
          {item.number ?? String(index + 1).padStart(2, '0')}
        </span>
        <div className="max-w-xl space-y-4">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase opacity-70">
            {item.eyebrow}
          </p>
          <h3 className="text-3xl leading-[1.05] font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {item.title}
          </h3>
          <p className="max-w-md text-sm leading-relaxed opacity-80 sm:text-base">
            {item.description}
          </p>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm opacity-80 hover:opacity-100"
            >
              open ↗
            </a>
          ) : null}
        </div>
      </div>
      <div className="relative min-h-[240px] md:min-h-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </motion.article>
  );
}

export function CaseStudyFlipStack({
  items,
  hint = 'Scroll Down',
  heading = 'Design That Delivers.',
  endLabel = 'The End',
  className,
}: CaseStudyFlipStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.4,
  });

  const total = Math.max(items.length, 1);

  return (
    <div className={cn('bg-background text-foreground relative font-sans', className)}>
      <section className="flex min-h-[72vh] flex-col items-center justify-end px-6 pb-16 text-center">
        <p className="text-muted-foreground mb-8 flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] uppercase">
          <span aria-hidden>↓</span>
          {hint}
          <span aria-hidden>↓</span>
        </p>
        <h1 className="text-foreground max-w-4xl text-5xl leading-[0.9] font-semibold tracking-tighter sm:text-7xl">
          {heading}
        </h1>
      </section>

      <div ref={stackRef} className="relative" style={{ height: `${(items.length + 1) * 100}vh` }}>
        <div
          className="sticky top-14 flex h-[calc(100vh-3.5rem)] items-center px-4 py-8 sm:px-8"
          style={{ perspective: 1600 }}
        >
          <div className="relative mx-auto h-[min(78vh,720px)] w-full max-w-6xl">
            {items.map((item, index) => (
              <FlipCard
                key={`${item.title}-${index}`}
                item={item}
                index={index}
                total={total}
                scrollYProgress={smoothProgress}
              />
            ))}
          </div>
        </div>
      </div>

      <section className="flex min-h-[50vh] items-center justify-center px-6 pb-24">
        <p className="text-muted-foreground font-mono text-sm tracking-[0.24em] uppercase">
          {endLabel}
        </p>
      </section>
    </div>
  );
}
