import { useRef } from 'react';
import {
  motion, useScroll, useVelocity, useSpring, useTransform, useMotionValue,
  useAnimationFrame, useReducedMotion,
} from 'framer-motion';

const skills = [
  'Python', 'LangChain', 'OpenAI', 'Hugging Face', 'RAG', 'PyTorch',
  'React', 'Next.js', 'Flask', 'OpenCV', 'Firestore', 'GCP',
];

const BASE_SPEED = -2.6; // % of the track per second
const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// Drifts on its own, speeds up with scroll speed, flips direction with scroll
// direction, and leans into the movement.
export default function SkillsMarquee() {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const skewX = useTransform(velocity, [-2500, 2500], [10, -10]);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1;
    else if (vf > 0) direction.current = 1;
    let moveBy = direction.current * BASE_SPEED * (delta / 1000);
    moveBy += direction.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  const items = [...skills, ...skills];

  return (
    <div className="marquee">
      <p className="sr-only">Skills: {skills.join(', ')}</p>
      <motion.div className="marquee-track marquee-track--scroll" style={{ x, skewX: reduce ? 0 : skewX }} aria-hidden="true">
        {items.map((skill, i) => (
          <span key={i}>
            {i > 0 && <span className="marquee-sep">✦</span>}
            {skill}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
