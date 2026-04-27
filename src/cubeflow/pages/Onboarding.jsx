import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel.jsx';
import Button from '../components/ui/Button.jsx';
import Chip from '../components/ui/Chip.jsx';
import { useUserStore } from '../store/userStore.js';

const LEVELS = [
  { id: 'never', label: 'I\'ve never solved one', desc: 'Total beginner. Start with cube anatomy.' },
  { id: 'sometimes', label: 'I can solve it slowly', desc: 'You know the beginner method. Time to learn F2L.' },
  { id: 'often', label: 'I solve regularly', desc: 'Comfortable with CFOP basics. Drill OLL/PLL.' },
  { id: 'fast', label: 'I\'m a speedcuber', desc: 'You want fingertricks, lookahead, sub-15.' },
];

const GOALS = [
  { id: 'solve', label: 'Solve it for the first time' },
  { id: 'sub-60', label: 'Get under 60 seconds' },
  { id: 'sub-30', label: 'Get under 30 seconds' },
  { id: 'sub-15', label: 'Get under 15 seconds' },
  { id: 'compete', label: 'Compete in WCA events' },
];

export default function Onboarding() {
  const nav = useNavigate();
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const setDisplayName = useUserStore((s) => s.setDisplayName);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [level, setLevel] = useState(null);
  const [goal, setGoal] = useState(null);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    if (name) setDisplayName(name);
    completeOnboarding();
    nav('/cubeflow/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <GlassPanel className="!p-8 sm:!p-12">
        <div className="flex items-center justify-between mb-8">
          <Chip tone="accent">
            <Sparkles className="w-3 h-3" /> Step {step + 1} of 4
          </Chip>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 w-8 rounded-full transition-colors ${
                  i <= step ? 'bg-cf-accent' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <>
                <h2 className="font-display font-bold text-3xl text-cf-hi">Welcome to CubeFlow.</h2>
                <p className="mt-2 text-cf-mid">Let's customise your learning path. Takes 30 seconds.</p>
                <div className="mt-6">
                  <label className="text-xs uppercase tracking-wider text-cf-lo">What should we call you?</label>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Saail"
                    className="mt-2 w-full bg-white/5 border border-cf-line rounded-cf-md px-4 py-3 text-cf-hi placeholder:text-cf-lo focus:outline-none focus:border-cf-accent transition-colors"
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="font-display font-bold text-3xl text-cf-hi">Where are you starting from?</h2>
                <p className="mt-2 text-cf-mid">Be honest — we'll skip what you already know.</p>
                <div className="mt-6 space-y-2">
                  {LEVELS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLevel(l.id)}
                      className={`w-full text-left p-4 rounded-cf-md border transition-all ${
                        level === l.id
                          ? 'bg-cf-accent/10 border-cf-accent shadow-cf-glow'
                          : 'bg-white/5 border-cf-line hover:border-cf-line2'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-display font-semibold text-cf-hi">{l.label}</div>
                          <div className="text-sm text-cf-mid mt-0.5">{l.desc}</div>
                        </div>
                        {level === l.id && <Check className="w-5 h-5 text-cf-accent" />}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="font-display font-bold text-3xl text-cf-hi">What's your goal?</h2>
                <p className="mt-2 text-cf-mid">We'll set up daily challenges to match.</p>
                <div className="mt-6 grid sm:grid-cols-2 gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={`p-4 rounded-cf-md border text-left transition-all ${
                        goal === g.id
                          ? 'bg-cf-accent2/10 border-cf-accent2 shadow-cf-glow-mint'
                          : 'bg-white/5 border-cf-line hover:border-cf-line2'
                      }`}
                    >
                      <div className="font-display font-semibold text-cf-hi text-sm">{g.label}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="font-display font-bold text-3xl text-cf-hi">You're all set, {name || 'cuber'}.</h2>
                <p className="mt-3 text-cf-mid leading-relaxed">
                  Based on your answers, we'll start you at{' '}
                  <span className="text-cf-hi font-medium">
                    {level === 'never' ? 'Cube Anatomy' : level === 'sometimes' ? 'F2L Pair & Insert' : level === 'often' ? '2-Look OLL' : 'Fingertricks'}
                  </span>.
                  You can change tracks anytime from the Learn page.
                </p>
                <GlassPanel className="mt-6 !bg-white/5">
                  <div className="text-xs uppercase tracking-wider text-cf-lo mb-2">Daily ritual unlocked</div>
                  <ul className="space-y-2 text-sm text-cf-mid">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-cf-accent2 mt-0.5" /> One lesson per day to keep your streak</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-cf-accent2 mt-0.5" /> Daily scramble challenge against yesterday's time</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-cf-accent2 mt-0.5" /> XP, badges, heatmap — track every solve</li>
                  </ul>
                </GlassPanel>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex justify-between">
          {step > 0 ? (
            <Button variant="ghost" icon={ArrowLeft} onClick={back}>Back</Button>
          ) : <span />}
          {step < 3 ? (
            <Button
              iconRight={ArrowRight}
              onClick={next}
              disabled={(step === 0 && !name) || (step === 1 && !level) || (step === 2 && !goal)}
            >
              Continue
            </Button>
          ) : (
            <Button iconRight={ArrowRight} onClick={finish}>Open dashboard</Button>
          )}
        </div>
      </GlassPanel>
    </div>
  );
}
