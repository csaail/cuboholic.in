import { useRef } from 'react';
import LiveHero from './LiveHero';
import {
  motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion,
} from 'framer-motion';

const EASE = [0.2, 0.8, 0.2, 1];

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  // Scroll-out: the illustration drifts up, shrinks and fades; the tagline lags behind.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const artY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -160]);
  const artScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.86]);
  const artOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0.1]);
  const tagY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const tagOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0]);

  // Gentle 3D tilt that follows the pointer.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 18 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 18 });

  const onPointerMove = (e) => {
    if (reduce || e.pointerType === 'touch') return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => { px.set(0); py.set(0); };

  return (
    <section className="hero" id="hero" ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <h1 className="sr-only">Saail Chavan — AI &amp; Full-Stack Engineer</h1>

      <motion.div className="hero-art" style={{ y: artY, scale: artScale, opacity: artOpacity }}>
        <motion.div
          className="hero-art-tilt"
          style={{ rotateX: rotX, rotateY: rotY }}
          initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <LiveHero />
        </motion.div>
      </motion.div>

      <motion.div className="hero-tagline-wrap" style={{ y: tagY, opacity: tagOpacity }}>
        <motion.p
          className="hero-tagline-main"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
        >
          AI &amp; full-stack engineer building <em>intelligent, user-centered</em> software.
        </motion.p>

        <motion.div
          className="hero-cta-row"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        >
          <a href="#projects" className="btn-pill btn-pill-dark">See my work</a>
          <a href="#experience" className="btn-pill btn-pill-light">Experience</a>
        </motion.div>

        <motion.div
          className="hero-scroll"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
