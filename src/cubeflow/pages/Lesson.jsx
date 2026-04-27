import { useState } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Trophy } from 'lucide-react';
import { getLesson, LESSONS } from '../data/lessons.js';
import { getAlgorithm } from '../data/algorithms.js';
import { useUserStore } from '../store/userStore.js';
import CubeStage from '../components/cube/CubeStage.jsx';
import GlassPanel from '../components/ui/GlassPanel.jsx';
import Button from '../components/ui/Button.jsx';
import Chip from '../components/ui/Chip.jsx';

export default function Lesson() {
  const { lessonId } = useParams();
  const nav = useNavigate();
  const lesson = getLesson(lessonId);
  const completed = useUserStore((s) => s.lessonsCompleted);
  const completeLesson = useUserStore((s) => s.completeLesson);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  if (!lesson) return <Navigate to="/cubeflow/learn" replace />;
  const alreadyDone = completed.includes(lesson.id);
  const algo = lesson.algorithmId ? getAlgorithm(lesson.algorithmId) : null;
  const step = lesson.steps[stepIndex];
  const isLast = stepIndex === lesson.steps.length - 1;

  const next = () => {
    if (isLast) {
      if (!alreadyDone) completeLesson(lesson.id, lesson.rewardXp);
      setDone(true);
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const prev = () => setStepIndex((i) => Math.max(0, i - 1));

  const nextLesson = LESSONS.find(
    (l) => l.prereq.includes(lesson.id) && !completed.includes(l.id),
  );

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cf-accent to-cf-accent2 flex items-center justify-center shadow-cf-glow"
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="font-display font-bold text-4xl text-cf-hi">Lesson complete.</h1>
        <p className="mt-3 text-cf-mid">+{lesson.rewardXp} XP added to your level.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/cubeflow/learn"><Button variant="secondary">Back to roadmap</Button></Link>
          {nextLesson && (
            <Link to={`/cubeflow/learn/${nextLesson.id}`}>
              <Button iconRight={ArrowRight}>Next: {nextLesson.title}</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => nav('/cubeflow/learn')} className="text-sm text-cf-mid hover:text-cf-hi flex items-center gap-1 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to roadmap
      </button>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Chip tone={lesson.level === 'Beginner' ? 'mint' : lesson.level === 'Intermediate' ? 'accent' : lesson.level === 'Advanced' ? 'warn' : 'danger'}>
          {lesson.level}
        </Chip>
        <Chip>+{lesson.rewardXp} XP</Chip>
        <Chip>{lesson.estMinutes} min</Chip>
      </div>
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-cf-hi">{lesson.title}</h1>
      <p className="mt-2 text-cf-mid">{lesson.summary}</p>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Cube stage */}
        <div>
          {algo ? (
            <CubeStage
              algorithm={algo.notation}
              setupMoves={algo.setup}
              height={420}
              autoSpin={false}
            />
          ) : (
            <CubeStage height={420} algorithm="" autoSpin={true} />
          )}
        </div>

        {/* Steps */}
        <GlassPanel className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-cf-lo">
                Step {stepIndex + 1} of {lesson.steps.length}
              </span>
              <div className="flex gap-1">
                {lesson.steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-6 rounded-full transition-colors ${
                      i <= stepIndex ? 'bg-cf-accent' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-display font-semibold text-2xl text-cf-hi leading-tight">
                  {step.title}
                </h2>
                <p className="mt-3 text-cf-mid leading-relaxed">{step.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-between">
            <Button variant="ghost" icon={ArrowLeft} onClick={prev} disabled={stepIndex === 0}>
              Back
            </Button>
            <Button iconRight={isLast ? Check : ArrowRight} onClick={next}>
              {isLast ? 'Mark complete' : 'Next step'}
            </Button>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
