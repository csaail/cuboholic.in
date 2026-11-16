import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Pointer-driven polish for mouse/trackpad users (stays off for touch):
//  • replaces the system cursor with a precise dot + a trailing ring; the ring
//    grows a little over clickable things and the dot becomes a text bar over
//    inputs (no pop-up labels)
//  • magnetic buttons (.btn-pill, .gh-view-all, .submit-btn, .magnetic)
//  • 3D tilt + glare on cards (.tilt-card)
// Magnet and tilt are skipped when the visitor prefers reduced motion.

const MAGNETIC = '.btn-pill, .gh-view-all, .submit-btn, .magnetic';
const TILT = '.tilt-card';
const INTERACTIVE = 'a, button, [role="button"], label, select, .lh-poke';
const TEXT_INPUT = 'input, textarea';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function PointerFX() {
  // Switched on by real mouse movement rather than a media query: touchscreen
  // laptops often report "(hover: none)" even when a mouse is in use, which left
  // the system arrow showing and the custom cursor off.
  const [active, setActive] = useState(false);
  const [cursor, setCursor] = useState({ hover: false, text: false, down: false, visible: false });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // The ring trails the dot slightly.
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });

  useEffect(() => {
    const reduce = reducedMotion();
    const root = document.documentElement;
    let usingMouse = false;
    let magnetEl = null;
    let tiltEl = null;

    const update = (patch) => setCursor((c) => {
      for (const k of Object.keys(patch)) if (c[k] !== patch[k]) return { ...c, ...patch };
      return c;
    });

    const resetMagnet = () => { if (magnetEl) { magnetEl.style.translate = ''; magnetEl = null; } };
    const resetTilt = () => {
      if (tiltEl) {
        tiltEl.style.removeProperty('--rx');
        tiltEl.style.removeProperty('--ry');
        tiltEl = null;
      }
    };

    // Hide the system cursor only while a mouse is in use on a page that mounts
    // this component (CubeFlow and other pages keep the normal one).
    const setMouseMode = (on) => {
      if (on === usingMouse) return;
      usingMouse = on;
      root.classList.toggle('has-custom-cursor', on);
      setActive(on);
      if (!on) { resetMagnet(); resetTilt(); }
    };

    // Cursor state for whatever is under (cx, cy).
    const describe = (t) => ({
      hover: !!t?.closest(INTERACTIVE),
      text: !!t?.closest(TEXT_INPUT),
    });
    let lastX = -1;
    let lastY = -1;

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') { if (e.pointerType === 'touch') setMouseMode(false); return; }
      if (!usingMouse) {
        setMouseMode(true);
        x.jump(e.clientX); y.jump(e.clientY);
        sx.jump(e.clientX); sy.jump(e.clientY);
      }
      x.set(e.clientX);
      y.set(e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
      const t = e.target instanceof Element ? e.target : null;
      update({ visible: true, ...describe(t) });

      if (reduce) return;

      // Magnetic pull toward the pointer.
      const m = t?.closest(MAGNETIC);
      if (m !== magnetEl) resetMagnet();
      if (m) {
        magnetEl = m;
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        m.style.translate = `${dx * 0.22}px ${dy * 0.3}px`;
      }

      // Card tilt + glare position.
      const c = t?.closest(TILT);
      if (c !== tiltEl) resetTilt();
      if (c) {
        tiltEl = c;
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        c.style.setProperty('--ry', `${(px - 0.5) * 12}deg`);
        c.style.setProperty('--rx', `${(0.5 - py) * 10}deg`);
        c.style.setProperty('--gx', `${px * 100}%`);
        c.style.setProperty('--gy', `${py * 100}%`);
      }
    };

    const onDown = (e) => {
      if (e.pointerType === 'touch') { setMouseMode(false); return; }
      update({ down: true });
    };
    // A click can open a modal or change the page under a still pointer, so
    // re-check what's beneath it shortly after release.
    let recheck = 0;
    const onUp = () => {
      update({ down: false });
      clearTimeout(recheck);
      recheck = setTimeout(() => {
        if (!usingMouse || lastX < 0) return;
        update(describe(document.elementFromPoint(lastX, lastY)));
      }, 120);
    };
    const onLeave = () => { update({ visible: false }); resetMagnet(); resetTilt(); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      clearTimeout(recheck);
      root.classList.remove('has-custom-cursor');
      resetMagnet();
      resetTilt();
    };
  }, [x, y, sx, sy]);

  if (!active) return null;

  const state = [
    cursor.hover && !cursor.text && 'is-hover',
    cursor.text && 'is-text',
    cursor.down && 'is-down',
    !cursor.visible && 'is-hidden',
  ].filter(Boolean).join(' ');

  return (
    <>
      <motion.div className={`cursor-ring ${state}`} style={{ x: sx, y: sy }} aria-hidden="true" />
      <motion.div className={`cursor-dot ${state}`} style={{ x, y }} aria-hidden="true" />
    </>
  );
}
