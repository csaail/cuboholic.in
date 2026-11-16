import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionValueEvent,
  useInView, useReducedMotion,
} from 'framer-motion';
import projects from '../data/projects';
import { experience } from '../data/career';
import ProjectDiagram from './ProjectDiagram';
import Scribble from './motion/Scribble';
import SectionNumber from './motion/SectionNumber';

const EASE = [0.2, 0.8, 0.2, 1];
const N = projects.length;
const AUTOPLAY_MS = 4200;

// Position on the carousel is a continuous number of cards ("pos"); card i's offset
// from the front is wrapped into -N/2..N/2 so the loop never ends.
const mod = (a, n) => ((a % n) + n) % n;
const relOffset = (i, pos) => mod(i - pos + N / 2, N) - N / 2;

const GitHubIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
  </svg>
);

const kicker = (p) => (p.work ? `Work · ${p.work.company}` : p.category);

function WindowBar({ project }) {
  return (
    <div className="wc-window">
      <span className="wc-dots" aria-hidden="true"><i /><i /><i /></span>
      <span className="wc-path">~/{project.slug}</span>
      <span className={`wc-badge${project.work ? ' wc-badge--work' : ''}`}>{kicker(project)}</span>
    </div>
  );
}


// ---- Poster cards ------------------------------------------------------------
// Each project gets its own colour (set `accent` on a project in projects.js to
// override). PALETTE picks the set: `theme` = muted paper tones that match the site,
// `bold` = the original saturated colours.
const PALETTES = {
  theme: ['#e6d9bf', '#c9d4bf', '#e3c5b2', '#c7d0da', '#ecdfae'], // sand, sage, clay, slate, butter
  bold: ['#ff5a1f', '#ffd23f', '#2667ff', '#17a05d', '#d7263d'],
};
const PALETTE = PALETTES.theme; //PALETTES.theme / bold
const accentOf = (p, i) => p.accent || PALETTE[i % PALETTE.length];
// Ink or paper text, whichever reads better on the accent.
const onAccent = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 150 ? '#0a0a0a' : '#f5f3ee';
};
const nn = (i) => String(i + 1).padStart(2, '0');

function PosterFace({ project, index }) {
  return (
    <div className="poster">
      <div className="poster-top">
        <span className="poster-num">{nn(index)}</span>
        <span className="poster-kicker">{kicker(project)}</span>
      </div>
      <h3 className="poster-name">{project.name}</h3>
      <div className="poster-foot">
        <p>{project.tagline}</p>
        <span className="poster-tech">{project.tech.slice(0, 3).join(' · ')}</span>
      </div>
    </div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState(null);
  const [wash, setWash] = useState(accentOf(projects[0], 0));
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!selected) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [selected]);

  return (
    <section className="section projects-section" id="projects" style={{ '--wash': wash }}>
      <SectionNumber n="03" />
      <div className="container">
        <div className="section-label reveal">03 — Projects</div>
        <h2 className="editorial-heading reveal">
          Featured <Scribble>projects.</Scribble>
        </h2>
        <p className="body-text reveal">
          Spin the ring — drag it, swipe, or use the arrows. Every card shows the system's
          pipeline running live; click the front one for the full story.
        </p>
      </div>

      <Carousel
        onOpen={setSelected}
        paused={!!selected}
        reduce={reduce}
        onActiveChange={(i) => setWash(accentOf(projects[i], i))}
      />

      <div className="container">
        <div className="gh-profile-link reveal">
          <a href="https://github.com/csaail" target="_blank" rel="noreferrer" className="gh-view-all">
            <GitHubIcon />
            More on GitHub
            <span>&rarr;</span>
          </a>
        </div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} reduce={reduce} />}
      </AnimatePresence>
    </section>
  );
}

function useCardSize() {
  const measure = () => {
    const w = typeof window === 'undefined' ? 1200 : window.innerWidth;
    const card = Math.round(Math.min(380, w * 0.74));
    // Horizontal spacing between neighbouring cards.
    return { card, gap: Math.round(card * (w < 720 ? 0.7 : 0.62)) };
  };
  const [size, setSize] = useState(measure);
  useEffect(() => {
    const onResize = () => setSize(measure());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

function Carousel({ onOpen, paused, reduce, onActiveChange }) {
  const { card, gap } = useCardSize();
  const stageRef = useRef(null);
  const inView = useInView(stageRef, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);

  const target = useMotionValue(0); // where the carousel is headed (in cards)
  const pos = useSpring(target, { stiffness: 110, damping: 20, mass: 0.9 });

  useMotionValueEvent(target, 'change', (v) => {
    const next = mod(Math.round(v), N);
    setActive(next);
    onActiveChange?.(next);
  });

  const snap = useCallback((v) => target.set(Math.round(v)), [target]);
  const spin = useCallback((dir) => snap(Math.round(target.get()) + dir), [snap, target]);
  const goTo = useCallback((i) => target.set(Math.round(target.get()) + Math.round(relOffset(i, Math.round(target.get())))), [target]);

  // Auto-spin while on screen and untouched.
  useEffect(() => {
    if (reduce || !inView || hovering || dragging || paused) return undefined;
    const id = setInterval(() => spin(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reduce, inView, hovering, dragging, paused, spin]);

  // Drag with momentum.
  const drag = useRef(null);
  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, start: target.get(), lastX: e.clientX, lastT: performance.now(), v: 0, moved: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
      stageRef.current.setPointerCapture?.(e.pointerId);
    }
    if (!d.moved) return;
    const now = performance.now();
    d.v = (e.clientX - d.lastX) / Math.max(1, now - d.lastT);
    d.lastX = e.clientX;
    d.lastT = now;
    target.set(d.start - dx / gap);
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d) return;
    if (d.moved) {
      const fling = Math.max(-1, Math.min(1, -d.v * 0.6)); // at most one extra card
      snap(target.get() + fling);
      // swallow the click that follows a drag
      const stop = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
      window.addEventListener('click', stop, { capture: true, once: true });
      setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 0);
    }
    drag.current = null;
    setDragging(false);
  };

  // Sideways trackpad swipes / shift+wheel spin it; plain vertical scrolling passes through.
  const wheelTimer = useRef(0);
  const onWheel = (e) => {
    const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
    if (!dx) return;
    target.set(target.get() + dx / 320);
    clearTimeout(wheelTimer.current);
    wheelTimer.current = setTimeout(() => snap(target.get()), 140);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); spin(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); spin(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); onOpen(projects[active]); }
  };

  return (
    <div className="ring-wrap" style={{ '--card': `${card}px` }}>
      <div
        ref={stageRef}
        className={`ring-stage${dragging ? ' is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="listbox"
        aria-label="Projects carousel. Use left and right arrow keys to spin, Enter to open."
        aria-activedescendant={`ring-card-${projects[active].slug}`}
      >
        <div className="ring">
          {projects.map((p, i) => (
            <RingCard
              key={p.slug}
              project={p}
              index={i}
              pos={pos}
              gap={gap}
              isActive={i === active}
              onClick={() => (i === active ? onOpen(p) : goTo(i))}
            />
          ))}
        </div>
        <div className="ring-floor" aria-hidden="true" />
      </div>

      <div className="ring-controls">
        <button type="button" className="ring-arrow magnetic" onClick={() => spin(-1)} aria-label="Previous project">←</button>
        <div className="ring-status">
          <div className="ring-dots">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                className={`ring-dot${i === active ? ' is-active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Show ${p.name}`}
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              className="ring-caption"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <span>{String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span>
              {projects[active].name}
            </motion.p>
          </AnimatePresence>
        </div>
        <button type="button" className="ring-arrow magnetic" onClick={() => spin(1)} aria-label="Next project">→</button>
      </div>
    </div>
  );
}

function RingCard({ project, index, pos, gap, isActive, onClick }) {
  // Cards swing round a 3D arc: neighbours angle in, step back and fade.
  const o = useTransform(pos, (p) => relOffset(index, p));
  const transform = useTransform(o, (v) => {
    const a = Math.abs(v);
    const tilt = Math.max(-1.4, Math.min(1.4, v)) * -34;
    return `translateX(${v * gap}px) translateZ(${-a * 230}px) rotateY(${tilt}deg) scale(${1 - Math.min(a, 2) * 0.05})`;
  });
  const opacity = useTransform(o, (v) => Math.max(0, Math.min(1, 1 - (Math.abs(v) - 1.2) / 1.2)));
  const zIndex = useTransform(o, (v) => 100 - Math.round(Math.abs(v) * 10));
  const accent = accentOf(project, index);

  return (
    <motion.div className="ring-slot" style={{ transform, opacity, zIndex }}>
      <button
        type="button"
        id={`ring-card-${project.slug}`}
        role="option"
        aria-selected={isActive}
        tabIndex={-1}
        className={`ring-card ring-card--poster${isActive ? ' is-active' : ''}`}
        style={{ '--accent': accent, '--on-accent': onAccent(accent) }}
        onClick={onClick}
      >
        <PosterFace project={project} index={index} />
      </button>
    </motion.div>
  );
}

// The project intro: architecture flow on the left, the story on the right.
function ProjectModal({ project, onClose, reduce }) {
  const job = project.work ? experience.find((e) => e.company === project.work.company) : null;

  return (
    <motion.div
      className="project-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="project-modal-inner pm2"
        onClick={(e) => e.stopPropagation()}
        initial={reduce ? false : { y: 40, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <button className="project-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="pm2-visual">
          <WindowBar project={project} />
          <div className="pm2-diagram">
            <ProjectDiagram steps={project.flow} id={`${project.slug}-modal`} large />
          </div>
          <ol className="pm2-steps">
            {project.flow.map((s, i) => (
              <li key={s}><span>{String(i + 1).padStart(2, '0')}</span>{s}</li>
            ))}
          </ol>
        </div>

        <div className="project-modal-body">
          <p className="project-modal-slug">
            {job ? `${job.role} · ${job.company} · ${job.dates}` : project.category}
          </p>
          <h2 className="project-modal-title">{project.name}</h2>
          <p className="project-modal-tagline">{project.tagline}</p>
          {project.status && <p className="pm2-status"><i aria-hidden="true" />{project.status}</p>}
          <p className="project-modal-desc">{project.description}</p>

          {job && (
            <>
              <h3 className="pm2-subhead">What I did</h3>
              <ul className="pm2-bullets">
                {(project.work.bullets ? project.work.bullets.map((n) => job.bullets[n]) : job.bullets.slice(0, 4))
                  .filter(Boolean)
                  .map((b) => <li key={b}>{b}</li>)}
              </ul>
            </>
          )}

          <div className="project-modal-tags">
            {project.tech.map((t) => <span key={t}>{t}</span>)}
          </div>

          <div className="project-modal-cta">
            {project.codeLink && (
              <a href={project.codeLink} target="_blank" rel="noreferrer" className="project-modal-btn project-modal-btn-dark">
                <GitHubIcon /> View Code
              </a>
            )}
            {project.liveLink && project.liveLink.startsWith('/') && !project.liveLink.endsWith('/') && (
              <Link to={project.liveLink} className="project-modal-btn project-modal-btn-light">Try it live →</Link>
            )}
            {project.liveLink && project.liveLink.startsWith('/') && project.liveLink.endsWith('/') && (
              // separate app built into public/ — needs a full page load, not a router link
              <a href={project.liveLink} className="project-modal-btn project-modal-btn-light">
                {project.status ? 'Try the preview →' : 'Try it live →'}
              </a>
            )}
            {project.liveLink && !project.liveLink.startsWith('/') && (
              <a href={project.liveLink} target="_blank" rel="noreferrer" className="project-modal-btn project-modal-btn-light">
                Live Site ↗
              </a>
            )}
            {project.links?.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="project-modal-btn project-modal-btn-light">
                {l.label} ↗
              </a>
            ))}
            {!project.codeLink && !project.liveLink && !project.links?.length && (
              <span className="pm2-private">
                {project.work ? `Built at ${project.work.company} — the code is private.` : 'Live demo and code coming soon.'}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
