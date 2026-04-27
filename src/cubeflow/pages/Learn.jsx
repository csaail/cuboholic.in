import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Check, Play, Star } from 'lucide-react';
import { LESSONS, TRACKS } from '../data/lessons.js';
import { useUserStore } from '../store/userStore.js';
import GlassPanel from '../components/ui/GlassPanel.jsx';
import Chip from '../components/ui/Chip.jsx';

export default function Learn() {
  const completed = useUserStore((s) => s.lessonsCompleted);

  const isUnlocked = (lesson) =>
    lesson.prereq.length === 0 || lesson.prereq.every((p) => completed.includes(p));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <Chip tone="accent">Roadmap</Chip>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-cf-hi mt-3">Learn the cube.</h1>
        <p className="mt-3 text-cf-mid max-w-2xl">
          A connected learning path from your first cross to sub-15 speedcubing.
          Each lesson unlocks the next.
        </p>
      </div>

      <div className="space-y-12">
        {TRACKS.map((track) => {
          const trackLessons = LESSONS.filter((l) => l.track === track.id);
          if (!trackLessons.length) return null;
          const trackComplete = trackLessons.every((l) => completed.includes(l.id));
          return (
            <div key={track.id}>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-2 h-8 rounded-full"
                  style={{ background: track.color, boxShadow: `0 0 16px ${track.color}80` }}
                />
                <h2 className="font-display font-bold text-2xl text-cf-hi">{track.label}</h2>
                {trackComplete && (
                  <Chip tone="mint"><Star className="w-3 h-3" /> Complete</Chip>
                )}
              </div>
              <div className="relative">
                {/* connector line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-cf-line via-cf-line2 to-cf-line" />
                <div className="space-y-3">
                  {trackLessons.map((lesson, i) => {
                    const done = completed.includes(lesson.id);
                    const unlocked = isUnlocked(lesson);
                    return (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04, duration: 0.4 }}
                        className="relative pl-16"
                      >
                        <div
                          className={`absolute left-0 top-3 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                            done
                              ? 'bg-cf-accent2 border-cf-accent2 text-cf-bg0 shadow-cf-glow-mint'
                              : unlocked
                              ? 'bg-cf-bg2 border-cf-accent text-cf-accent shadow-cf-glow'
                              : 'bg-cf-bg2 border-cf-line text-cf-lo'
                          }`}
                          style={{ zIndex: 1 }}
                        >
                          {done ? <Check className="w-5 h-5" /> : unlocked ? <Play className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </div>
                        {unlocked ? (
                          <Link to={`/cubeflow/learn/${lesson.id}`}>
                            <GlassPanel hover className="!p-4 cursor-pointer">
                              <LessonRow lesson={lesson} done={done} />
                            </GlassPanel>
                          </Link>
                        ) : (
                          <GlassPanel className="!p-4 opacity-60">
                            <LessonRow lesson={lesson} done={done} />
                          </GlassPanel>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LessonRow({ lesson, done }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="font-display font-semibold text-cf-hi">{lesson.title}</span>
          <Chip tone={lesson.level === 'Beginner' ? 'mint' : lesson.level === 'Intermediate' ? 'accent' : lesson.level === 'Advanced' ? 'warn' : 'danger'}>
            {lesson.level}
          </Chip>
        </div>
        <div className="text-sm text-cf-mid line-clamp-1">{lesson.summary}</div>
      </div>
      <div className="text-right shrink-0">
        <div className={`text-xs font-mono ${done ? 'text-cf-accent2' : 'text-cf-lo'}`}>
          +{lesson.rewardXp} XP
        </div>
        <div className="text-[10px] text-cf-lo mt-0.5">{lesson.estMinutes}m</div>
      </div>
    </div>
  );
}
