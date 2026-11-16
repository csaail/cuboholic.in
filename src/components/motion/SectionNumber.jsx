import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

// Oversized outlined section number that drifts against the scroll.
export default function SectionNumber({ n }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [120, -120]);
  return (
    <motion.span ref={ref} className="section-num" style={{ y }} aria-hidden="true">
      {n}
    </motion.span>
  );
}
