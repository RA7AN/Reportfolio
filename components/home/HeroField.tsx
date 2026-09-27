'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const stages = [
  { tone: 'warm', width: '72%' },
  { tone: 'violet', width: '48%' },
  { tone: 'blue', width: '66%' },
  { tone: 'green', width: '54%' },
  { tone: 'white', width: '80%' },
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
      <motion.div className="agent-pipeline" style={reducedMotion ? undefined : { x, y }}>
        <div className="agent-pipeline__flow">
          {stages.map((stage, index) => (
            <div className="agent-stage-wrap" key={stage.tone}>
              <motion.div
                className={`agent-stage agent-stage--${stage.tone}`}
                initial={reducedMotion ? false : { opacity: 0, scaleX: 0.86 }}
                animate={reducedMotion ? undefined : { opacity: 1, scaleX: 1 }}
                transition={{ delay: index * 0.14 + 0.2, duration: 0.7 }}
              >
                <span
                  className="agent-stage__line"
                  style={{ '--line-width': stage.width } as React.CSSProperties}
                />
                <span className="agent-stage__node" />
              </motion.div>
              {index < stages.length - 1 && (
                <span className="agent-stage__connector">
                  <b />
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default HeroField;
