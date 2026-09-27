'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState, type CSSProperties } from 'react';

const nodes = [
  { x: 18, y: 36, label: 'signal', delay: 0 },
  { x: 38, y: 19, label: 'context', delay: 0.7 },
  { x: 61, y: 31, label: 'reason', delay: 1.4 },
  { x: 82, y: 18, label: 'output', delay: 0.35 },
  { x: 74, y: 65, label: 'feedback', delay: 1.1 },
  { x: 48, y: 77, label: 'memory', delay: 1.8 },
  { x: 24, y: 69, label: 'curiosity', delay: 0.5 },
];

const links = [
  ['18,36', '38,19'],
  ['38,19', '61,31'],
  ['61,31', '82,18'],
  ['61,31', '74,65'],
  ['74,65', '48,77'],
  ['48,77', '24,69'],
  ['24,69', '18,36'],
  ['38,19', '48,77'],
];

export function HeroField() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(useTransform(pointerX, [0, 1], [-12, 12]), { stiffness: 55, damping: 18 });
  const y = useSpring(useTransform(pointerY, [0, 1], [-8, 8]), { stiffness: 55, damping: 18 });

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <div
      className="hero-field"
      aria-hidden="true"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set((event.clientX - rect.left) / rect.width);
        pointerY.set((event.clientY - rect.top) / rect.height);
      }}
      onPointerLeave={() => {
        pointerX.set(0.5);
        pointerY.set(0.5);
      }}
    >
      <motion.div className="hero-field__glow" style={reducedMotion ? undefined : { x, y }} />
      <div className="hero-field__grid" />
      <div className="hero-field__orbital orbital-one" />
      <div className="hero-field__orbital orbital-two" />
      <div className="hero-field__signal signal-one" />
      <div className="hero-field__signal signal-two" />
      <motion.svg
        className="hero-field__network"
        viewBox="0 0 100 100"
        fill="none"
        style={reducedMotion ? undefined : { x, y }}
      >
        <defs>
          <linearGradient id="network-line" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--accent)" stopOpacity="0.08" />
            <stop offset="0.48" stopColor="var(--accent)" stopOpacity="0.7" />
            <stop offset="1" stopColor="var(--accent-2)" stopOpacity="0.15" />
          </linearGradient>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {links.map(([from, to]) => (
          <line
            key={`${from}-${to}`}
            x1={from.split(',')[0]}
            y1={from.split(',')[1]}
            x2={to.split(',')[0]}
            y2={to.split(',')[1]}
            className="hero-field__link"
          />
        ))}
        <path d="M4 53 C 24 42, 29 82, 52 49 S 78 52, 97 38" className="hero-field__trace" />
        {nodes.map((node) => (
          <g
            key={node.label}
            className="hero-field__node"
            style={{ '--node-delay': `${node.delay}s` } as CSSProperties}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="2.1"
              className="hero-field__halo"
              filter="url(#node-glow)"
            />
            <circle cx={node.x} cy={node.y} r="0.8" className="hero-field__dot" />
            <text x={node.x + 3.5} y={node.y - 3} className="hero-field__label">
              {node.label}
            </text>
          </g>
        ))}
      </motion.svg>
      <div className="hero-field__meta font-mono">
        <span>latent field / 01</span>
        <span>systems that learn</span>
      </div>
      <div className="hero-field__cursor" />
    </div>
  );
}

export default HeroField;
