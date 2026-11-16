import { useRef } from 'react';
import {
  motion, useAnimationControls, useMotionValue, useSpring, useTransform, useVelocity, useReducedMotion,
} from 'framer-motion';
import manifest from '../data/hero-pieces.json';

// The hero illustration, cut into pieces by scripts/split-hero.py and re-assembled
// here so each part can move: letters drop in and bounce (characters sitting on a
// letter ride along), the drone chases the cursor, notes and hearts float away.

const { width: W, height: H } = manifest;
const PIECES = Object.fromEntries(manifest.pieces.map((p) => [p.key, p]));
const LETTERS = manifest.pieces.filter((p) => p.kind === 'letter');
const src = (key) => `/hero/${key}.webp`;

function Img({ p, ...rest }) {
  return <image href={src(p.key)} x={p.x} y={p.y} width={p.w} height={p.h} {...rest} />;
}

const JUMP = {
  y: [0, -70, 0, -14, 0],
  scaleY: [1, 1.07, 0.88, 1.03, 1],
  scaleX: [1, 0.95, 1.09, 0.99, 1],
  transition: { duration: 0.75, times: [0, 0.35, 0.62, 0.82, 1], ease: 'easeOut' },
};
const WOBBLE = {
  rotate: [0, -10, 8, -5, 3, 0],
  transition: { duration: 0.7, ease: 'easeInOut' },
};

// A piece that hops (or wobbles on click) when poked.
function Poke({ p, reduce, hop = JUMP, className, children }) {
  const controls = useAnimationControls();
  const busy = useRef(false);
  const play = (anim) => {
    if (reduce || busy.current) return;
    busy.current = true;
    controls.start(anim).then(() => { busy.current = false; });
  };
  return (
    <motion.g
      className={`lh-poke ${className || ''}`}
      animate={controls}
      style={{ originX: 0.5, originY: 1 }}
      onPointerEnter={() => play(hop)}
      onClick={() => play(WOBBLE)}
    >
      {children || <Img p={p} />}
    </motion.g>
  );
}

export default function LiveHero() {
  const reduce = useReducedMotion();
  const svgRef = useRef(null);

  // Drone chases the pointer (within reason) and banks into the turn.
  const drone = PIECES.drone;
  const home = { x: drone.x + drone.w / 2, y: drone.y + drone.h / 2 };
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const dx = useSpring(tx, { stiffness: 40, damping: 12, mass: 1.2 });
  const dy = useSpring(ty, { stiffness: 40, damping: 12, mass: 1.2 });
  const bank = useTransform(useVelocity(dx), [-900, 900], [-18, 18], { clamp: true });

  const onPointerMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const py = ((e.clientY - r.top) / r.height) * H;
    // fly toward the cursor, staying above the ground and a little shy of it
    tx.set(Math.max(-home.x + 120, Math.min(W - home.x - 120, (px - home.x) * 0.8)));
    ty.set(Math.max(-home.y + 60, Math.min(H * 0.62 - home.y, (py - 90 - home.y) * 0.8)));
  };
  const onPointerLeave = () => { tx.set(0); ty.set(0); };

  return (
    <svg
      ref={svgRef}
      className={`live-hero${reduce ? ' is-still' : ''}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Illustrated lettering of the name Saail Chavan, with doodled kids, a robot, a drone and pets around the letters"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* Letters drop in one by one, then bob in a gentle wave */}
      {LETTERS.map((p, i) => (
        <motion.g
          key={p.key}
          initial={reduce ? false : { y: -420, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, mass: 0.9, delay: 0.25 + i * 0.07 }}
        >
          <g className="lh-bob" style={{ '--d': `${i * 0.18}s` }}>
            <Poke p={p} reduce={reduce} />
          </g>
        </motion.g>
      ))}

      {/* grass line stays put, so letters jump off it */}
      <Img p={PIECES.ground} />

      {/* Characters on the ground */}
      <motion.g
        initial={reduce ? false : { x: -160, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 16, delay: 0.5 }}
      >
        <g className="lh-breathe"><Poke p={PIECES.robot} reduce={reduce} hop={WOBBLE} /></g>
      </motion.g>
      {/* reader + cat + the C behind them — they hop together when poked */}
      <Poke p={PIECES.reader} reduce={reduce} />
      <motion.g
        initial={reduce ? false : { x: 160, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 16, delay: 0.6 }}
      >
        <g className="lh-breathe"><Poke p={PIECES.boy} reduce={reduce} /></g>
        <g className="lh-wag">
          <Poke p={PIECES.dog} reduce={reduce} />
        </g>
      </motion.g>

      {/* Floating notes and hearts, looping */}
      {[0, 1, 2].map((k) => (
        <g key={`n${k}`} className="lh-float" style={{ '--d': `${k * 1.3}s`, '--dx': `${k % 2 ? 30 : -10}px` }}>
          <Img p={PIECES.notes} />
        </g>
      ))}
      {[0, 1].map((k) => (
        <g key={`h${k}`} className="lh-float lh-float--heart" style={{ '--d': `${k * 1.7}s`, '--dx': `${k ? -18 : 14}px` }}>
          <Img p={PIECES.heart} />
        </g>
      ))}

      {/* Drone: follows the cursor */}
      <motion.g style={{ x: dx, y: dy }}>
        <motion.g style={{ rotate: bank, originX: 0.5, originY: 0.5 }}>
          <g className="lh-hover">
            <Img p={drone} />
          </g>
        </motion.g>
      </motion.g>
    </svg>
  );
}
