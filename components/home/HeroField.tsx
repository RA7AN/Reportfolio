'use client';

import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export function HeroField() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const x = useSpring(useTransform(pointerX, [0, 1], [-14, 14]), { stiffness: 45, damping: 24 });
  const y = useSpring(useTransform(pointerY, [0, 1], [-10, 10]), { stiffness: 45, damping: 24 });
  const { scrollY } = useScroll();
  const scrollYValue = useTransform(scrollY, [0, 520], [0, -180]);
  const scrollScale = useTransform(scrollY, [0, 520], [1, 0.8]);
  const scrollOpacity = useTransform(scrollY, [0, 460], [1, 0]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const motionStyle = reducedMotion
    ? undefined
    : { x, y, translateY: scrollYValue, scale: scrollScale, opacity: scrollOpacity };

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
      <motion.div className="hero-field__ambient" style={motionStyle} />
      <motion.div className="tesseract-field" style={motionStyle}>
        <div className="tesseract-field__halo" />
        <div className="tesseract-field__core">
          <span className="tesseract-field__cube tesseract-field__cube--outer" />
          <span className="tesseract-field__cube tesseract-field__cube--inner" />
          <span className="tesseract-field__axis tesseract-field__axis--one" />
          <span className="tesseract-field__axis tesseract-field__axis--two" />
          <span className="tesseract-field__axis tesseract-field__axis--three" />
        </div>
      </motion.div>
    </div>
  );
}

export default HeroField;
