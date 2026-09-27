'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const stages = [
  { label: 'instruction', detail: 'Research the next move', tone: 'warm' },
  { label: 'reasoning', detail: 'Plan · retrieve · decide', tone: 'violet' },
  { label: 'tool call', detail: 'search / memory / code', tone: 'blue' },
  { label: 'observation', detail: 'New context received', tone: 'green' },
  { label: 'output', detail: 'Useful, grounded answer', tone: 'white' },
];

export function HeroField() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const x = useSpring(useTransform(pointerX, [0, 1], [-10, 10]), { stiffness: 50, damping: 20 });
  const y = useSpring(useTransform(pointerY, [0, 1], [-7, 7]), { stiffness: 50, damping: 20 });

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
      <motion.div className="hero-field__ambient" style={reducedMotion ? undefined : { x, y }} />
      <div className="hero-field__eyebrow font-mono">agent loop / 00:01:24</div>
      <motion.div className="agent-pipeline" style={reducedMotion ? undefined : { x, y }}>
        <div className="agent-pipeline__header">
          <span className="agent-pipeline__status">
            <i /> live process
          </span>
          <span className="font-mono">autonomous / v.04</span>
        </div>
        <div className="agent-pipeline__prompt">
          <span className="agent-pipeline__prompt-mark">↳</span>
          <span>turn a question into a useful system</span>
          <span className="agent-pipeline__caret" />
        </div>
        <div className="agent-pipeline__flow">
          {stages.map((stage, index) => (
            <div className="agent-stage-wrap" key={stage.label}>
              <motion.div
                className={`agent-stage agent-stage--${stage.tone}`}
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.16 + 0.2, duration: 0.55 }}
              >
                <span className="agent-stage__index">0{index + 1}</span>
                <span className="agent-stage__label">{stage.label}</span>
                <span className="agent-stage__detail">{stage.detail}</span>
              </motion.div>
              {index < stages.length - 1 && (
                <span className="agent-stage__connector">
                  <b />
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="agent-pipeline__footer font-mono">
          <span>memory: on</span>
          <span>tools: 03</span>
          <span>confidence: 0.98</span>
        </div>
      </motion.div>
      <div className="hero-field__note font-mono">observe → adapt → return</div>
    </div>
  );
}

export default HeroField;
