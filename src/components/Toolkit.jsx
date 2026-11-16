import { useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { skills } from '../data/career';
import Scribble from './motion/Scribble';
import SectionNumber from './motion/SectionNumber';

// Skills as stickers slapped on a laptop lid. Drag them around (mouse), hover a group
// in the legend to light its stickers up, or hit shuffle to re-stick everything.

const GROUPS = skills.filter((g) => !/languages/i.test(g.group)); // spoken languages aren't tech skills

// Muted paper tones that match the site; one per group.
const GROUP_COLORS = ['#c7d0da', '#ecdfae', '#c9d4bf', '#e3c5b2', '#e6d9bf', '#d9cfe3'];
const colorOf = (group) => GROUP_COLORS[Math.max(0, GROUPS.findIndex((g) => g.group === group)) % GROUP_COLORS.length];

// Every skill once (SQL is listed under two groups — keep the first).
const STICKERS = (() => {
  const seen = new Set();
  const out = [];
  for (const g of GROUPS) {
    for (const name of g.items) {
      if (seen.has(name)) continue;
      seen.add(name);
      out.push({ name, group: g.group });
    }
  }
  return out;
})();

// Small seeded RNG so a given shuffle always looks the same.
function rng(seed) {
  let h = 2166136261 ^ seed;
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
const hashStr = (s) => [...s].reduce((a, c) => Math.imul(a ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;

function layout(seed) {
  const r = rng(seed * 7919 + 11);
  const order = [...STICKERS];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order.map((s) => {
    const p = rng(hashStr(s.name) + seed * 104729);
    const a = p(); const b = p(); const c = p(); const d = p();
    const shape = s.name.length <= 4 ? 'circle' : a < 0.45 ? 'pill' : a < 0.8 ? 'rect' : 'tag';
    const font = b < 0.5 ? 'display' : b < 0.8 ? 'mono' : 'hand';
    return { ...s, shape, font, rot: (c - 0.5) * 18, nudge: Math.round((d - 0.5) * 16) };
  });
}

const canDrag = () => typeof window !== 'undefined' && window.matchMedia('(any-pointer: fine)').matches;

function Sticker({ s, i, lidRef, draggable, reduce, dim, lit }) {
  // Dragging switches on only after the sticker has landed: while it slaps in it is
  // scaled up, and measuring the drag bounds then would shove it out of place.
  const [landed, setLanded] = useState(!!reduce);
  return (
    <motion.li
      className={`stk stk--${s.shape} stk--${s.font}${dim ? ' is-dim' : ''}${lit ? ' is-lit' : ''}`}
      style={{ '--c': colorOf(s.group), marginTop: s.nudge }}
      title={s.group}
      drag={draggable && landed}
      dragConstraints={lidRef}
      dragElastic={0.12}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
      initial={reduce ? false : { opacity: 0, scale: 1.9, rotate: s.rot * 3 }}
      whileInView={{ opacity: 1, scale: 1, rotate: s.rot }}
      viewport={{ once: true, margin: '-40px' }}
      onAnimationComplete={() => setLanded(true)}
      whileHover={reduce || !landed ? undefined : { scale: 1.1, rotate: 0, zIndex: 5 }}
      whileDrag={{ scale: 1.16, rotate: 0, zIndex: 10 }}
      transition={{ type: 'spring', stiffness: 420, damping: 19, delay: reduce ? 0 : i * 0.035 }}
    >
      {s.name}
    </motion.li>
  );
}

export default function Toolkit() {
  const reduce = useReducedMotion();
  const lidRef = useRef(null);
  const [seed, setSeed] = useState(1);
  const [active, setActive] = useState(null);
  const [draggable] = useState(canDrag);
  const stickers = useMemo(() => layout(seed), [seed]);

  return (
    <section className="section toolkit" id="toolkit">
      <SectionNumber n="04" />
      <div className="container">
        <div className="section-label reveal">04 — Skills</div>
        <h2 className="editorial-heading reveal">
          Skills &amp; <Scribble variant="loop">toolkit.</Scribble>
        </h2>
        <p className="body-text reveal">
          Every tool I work with, stuck on the lid where I can see it.
          {draggable ? ' Go ahead, peel them around — it’s my laptop, I don’t mind.' : ''}
        </p>

        <div className="laptop reveal">
          <div className="laptop-lid" ref={lidRef}>
            <svg className="laptop-logo" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Zm0 0v9m0 0 8-4.5M12 12l-8-4.5M12 12v9" />
            </svg>
            <ul className="stickers" aria-label="Skills">
              {stickers.map((s, i) => (
                <Sticker
                  key={`${s.name}-${seed}`}
                  s={s}
                  i={i}
                  lidRef={lidRef}
                  draggable={draggable}
                  reduce={reduce}
                  dim={!!active && active !== s.group}
                  lit={active === s.group}
                />
              ))}
            </ul>
          </div>
          <div className="laptop-base" aria-hidden="true"><span /></div>
        </div>

        <div className="stk-controls reveal">
          <div className="stk-legend" role="group" aria-label="Highlight a skill group">
            {GROUPS.map((g) => (
              <button
                key={g.group}
                type="button"
                className={`stk-legend-btn${active === g.group ? ' is-active' : ''}`}
                style={{ '--c': colorOf(g.group) }}
                aria-pressed={active === g.group}
                onMouseEnter={() => setActive(g.group)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(g.group)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((a) => (a === g.group ? null : g.group))}
              >
                <i aria-hidden="true" />
                {g.group}
                <span>{g.items.length}</span>
              </button>
            ))}
          </div>
          <button type="button" className="btn-pill btn-pill-dark stk-shuffle" onClick={() => setSeed((n) => n + 1)}>
            ↻ Shuffle stickers
          </button>
        </div>
      </div>
    </section>
  );
}
