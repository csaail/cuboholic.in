import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, GraduationCap, Box, Timer, Camera, Sparkles, Trophy,
  Zap, Brain, Eye, Layers,
} from 'lucide-react';
import Cube3D from '../components/cube/Cube3D.jsx';
import Button from '../components/ui/Button.jsx';
import GlassPanel from '../components/ui/GlassPanel.jsx';
import Chip from '../components/ui/Chip.jsx';

const FEATURES = [
  { icon: Box, title: 'Interactive 3D cube', body: 'Real cube physics. Drag to rotate, click to turn faces. Every algorithm animates step-by-step.', tone: 'accent' },
  { icon: GraduationCap, title: 'Visual lessons', body: 'Learn the beginner method, then graduate to CFOP. No walls of text — just guided practice.', tone: 'mint' },
  { icon: Camera, title: 'Webcam scanner', body: 'Show your cube to your camera. CubeFlow reads the colors and continues from where you are.', tone: 'warn' },
  { icon: Timer, title: 'WCA-style timer', body: 'Hold-to-start, official scrambles, ao5 / ao12 tracking. Built for serious practice.', tone: 'accent' },
  { icon: Brain, title: 'Algorithm trainer', body: 'Spaced-repetition drills for OLL, PLL, F2L. Recognition timed to the millisecond.', tone: 'mint' },
  { icon: Trophy, title: 'XP, streaks, badges', body: 'Daily challenges, level-ups, and a heatmap that shows every minute you practiced.', tone: 'warn' },
];

const ROADMAP_STAGES = [
  { label: 'Cube anatomy', desc: 'Centers, edges, corners' },
  { label: 'White cross', desc: '4 edges aligned' },
  { label: 'F2L pairing', desc: 'Corner + edge inserts' },
  { label: 'OLL', desc: 'Orient last layer' },
  { label: 'PLL', desc: 'Permute last layer' },
  { label: 'Speedcubing', desc: 'Sub-15 fingertricks' },
];

export default function Landing() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 cf-glass rounded-full px-3 py-1.5 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cf-accent2 animate-pulse" />
              <span className="text-xs text-cf-mid">Free forever · No signup to try</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight"
            >
              Master the
              <br />
              <span className="bg-gradient-to-r from-cf-accent via-cf-accent2 to-cf-accent bg-clip-text text-transparent">
                Rubik's Cube
              </span>
              <br />
              for free.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-lg text-cf-mid max-w-xl leading-relaxed"
            >
              Interactive lessons, visual cube solving, and guided practice
              built for everyone — from your first solve to sub-15 speedcubing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/cubeflow/learn">
                <Button size="lg" iconRight={ArrowRight}>Start Learning</Button>
              </Link>
              <Link to="/cubeflow/algorithms">
                <Button size="lg" variant="secondary">Explore Algorithms</Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-cf-lo"
            >
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> 4-min onboarding</span>
              <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Visual everything</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Works offline</span>
            </motion.div>
          </div>

          {/* Hero cube */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative h-[420px] sm:h-[520px]"
          >
            <div className="absolute inset-0 rounded-cf-xl">
              <Cube3D autoSpin interactive={false} cameraDistance={6} />
            </div>
            {/* Floating algo cards */}
            <FloatingCard
              algo="R U R' U'"
              label="Right-hand trigger"
              className="top-8 -left-2 sm:left-8"
              delay={0.8}
            />
            <FloatingCard
              algo="F R U R' U' F'"
              label="OLL Bar"
              className="bottom-12 -right-2 sm:right-4"
              delay={1.0}
            />
            <FloatingCard
              algo="M2 U M2"
              label="H Perm start"
              className="top-1/2 -right-4 sm:right-0"
              delay={1.2}
            />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeading
          eyebrow="Why CubeFlow"
          title={<>Everything you need to <em className="not-italic text-cf-accent2">actually</em> get good.</>}
          subtitle="Built around the principle that watching tutorials doesn't make you faster — practicing does."
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <GlassPanel hover className="h-full">
                <div className={`w-10 h-10 rounded-cf-md flex items-center justify-center mb-4 ${
                  f.tone === 'accent' ? 'bg-cf-accent/20 text-cf-accent' :
                  f.tone === 'mint' ? 'bg-cf-accent2/20 text-cf-accent2' :
                  'bg-cf-warn/20 text-cf-warn'
                }`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-lg text-cf-hi mb-1.5">{f.title}</h3>
                <p className="text-sm text-cf-mid leading-relaxed">{f.body}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ROADMAP PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeading
          eyebrow="Your path"
          title="From your first cross to sub-15 solves."
          subtitle="A connected roadmap. Each node unlocks the next."
        />
        <div className="mt-12 cf-glass rounded-cf-xl p-6 sm:p-10 overflow-hidden relative">
          <div className="flex flex-wrap items-center justify-center gap-4 relative">
            {ROADMAP_STAGES.map((s, i) => (
              <RoadmapNode key={s.label} index={i} {...s} last={i === ROADMAP_STAGES.length - 1} />
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Link to="/cubeflow/learn">
            <Button variant="secondary" iconRight={ArrowRight}>See full roadmap</Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <GlassPanel className="text-center !p-12 sm:!p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cf-accent/15 via-transparent to-cf-accent2/10 pointer-events-none" />
          <Layers className="w-10 h-10 text-cf-accent mx-auto mb-4 relative" />
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-cf-hi relative">
            Pick up your cube.
          </h2>
          <p className="mt-3 text-cf-mid relative">No account required. Start in 5 seconds.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 relative">
            <Link to="/cubeflow/learn">
              <Button size="lg" iconRight={ArrowRight}>Start the first lesson</Button>
            </Link>
            <Link to="/cubeflow/timer">
              <Button size="lg" variant="secondary" icon={Timer}>Open the timer</Button>
            </Link>
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}

function FloatingCard({ algo, label, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] }}
      className={`absolute z-10 cf-glass rounded-cf-md px-3 py-2.5 shadow-cf-card animate-cf-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="cf-notation text-sm text-cf-hi">{algo}</div>
      <div className="text-[10px] text-cf-lo mt-0.5">{label}</div>
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-3xl">
      <Chip tone="accent">{eyebrow}</Chip>
      <h2 className="font-display font-bold text-3xl sm:text-5xl text-cf-hi mt-4 leading-[1.05]">{title}</h2>
      {subtitle && <p className="mt-3 text-cf-mid text-base sm:text-lg max-w-xl">{subtitle}</p>}
    </div>
  );
}

function RoadmapNode({ label, desc, index, last }) {
  return (
    <div className="flex items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="cf-glass rounded-cf-md px-4 py-3 min-w-[140px] text-center hover:border-cf-accent/40 transition-colors"
      >
        <div className="text-[10px] uppercase tracking-wider text-cf-lo mb-1">Step {index + 1}</div>
        <div className="font-display font-semibold text-sm text-cf-hi">{label}</div>
        <div className="text-[11px] text-cf-mid mt-0.5">{desc}</div>
      </motion.div>
      {!last && (
        <div className="hidden sm:block w-6 h-0.5 mx-1 bg-gradient-to-r from-cf-accent/40 to-cf-accent2/40" />
      )}
    </div>
  );
}
