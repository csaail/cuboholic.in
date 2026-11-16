import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { experience } from '../data/career';
import Scribble from './motion/Scribble';
import SectionNumber from './motion/SectionNumber';

// Compact snapshot of work history for the home page. Full detail lives on /career.
// The timeline line draws itself as you scroll through the list.
export default function Experience() {
  const listRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 80%', 'end 55%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section className="section" id="experience">
      <SectionNumber n="02" />
      <div className="container">
        <div className="section-label reveal">02 — Experience</div>
        <h2 className="editorial-heading reveal">
          Where I've <Scribble variant="swoosh">worked.</Scribble>
        </h2>

        <div className="xp-list" ref={listRef}>
          <motion.div className="xp-line" style={{ scaleY: reduce ? 1 : scaleY }} aria-hidden="true" />
          {experience.map((job, i) => (
            <motion.div
              className="xp-row"
              key={`${job.company}-${job.dates}`}
              initial={reduce ? false : { opacity: 0, x: -48 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <span className="xp-dot" aria-hidden="true" />
              <article className="xp-item tilt-card tilt-card--soft">
                <div className="xp-meta">
                  <span className="xp-dates">{job.dates}</span>
                  {job.location && <span className="xp-location">{job.location}</span>}
                </div>
                <div className="xp-body">
                  <h3>{job.role}</h3>
                  <p className="xp-company">{job.company}</p>
                  <p className="xp-summary">{job.bullets[0]}</p>
                  <div className="xp-stack">
                    {job.stack.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </article>
            </motion.div>
          ))}
        </div>

        <div className="xp-cta reveal">
          <Link to="/career" className="btn-pill btn-pill-light">
            Full résumé, education &amp; certs →
          </Link>
        </div>
      </div>
    </section>
  );
}
