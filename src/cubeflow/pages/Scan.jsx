import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassPanel from '../components/ui/GlassPanel.jsx';
import Button from '../components/ui/Button.jsx';
import Chip from '../components/ui/Chip.jsx';

const FACES_TO_SCAN = ['U', 'F', 'R', 'D', 'B', 'L'];
const FACE_LABELS = {
  U: { name: 'White (top)', color: '#FFFFFF' },
  D: { name: 'Yellow (bottom)', color: '#FFD400' },
  F: { name: 'Green (front)', color: '#009B48' },
  B: { name: 'Blue (back)', color: '#0046AD' },
  R: { name: 'Red (right)', color: '#B71234' },
  L: { name: 'Orange (left)', color: '#FF5800' },
};

export default function Scan() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);
  const [captured, setCaptured] = useState({});

  useEffect(() => {
    let active = true;
    async function start() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 640 } },
          audio: false,
        });
        if (!active) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play();
        }
      } catch (e) {
        setError(e.message || 'Could not access camera.');
      }
    }
    start();
    return () => {
      active = false;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(v, 0, 0);
    const dataUrl = c.toDataURL('image/jpeg', 0.7);
    const face = FACES_TO_SCAN[step];
    setCaptured((p) => ({ ...p, [face]: dataUrl }));
    if (step < FACES_TO_SCAN.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const allDone = Object.keys(captured).length === FACES_TO_SCAN.length;
  const currentFace = FACES_TO_SCAN[step];
  const label = FACE_LABELS[currentFace];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <Chip tone="warn">Beta</Chip>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-cf-hi mt-3">Scan your cube.</h1>
        <p className="mt-3 text-cf-mid max-w-2xl">
          Show all six faces to your camera one at a time. CubeFlow reads the colors and lets you
          continue solving from your real cube state.
        </p>
      </div>

      {error ? (
        <GlassPanel className="!border-cf-danger/40 !bg-cf-danger/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-cf-danger mt-0.5" />
            <div>
              <div className="font-display font-semibold text-cf-hi">Camera unavailable</div>
              <div className="text-sm text-cf-mid mt-1">{error}</div>
              <div className="text-xs text-cf-lo mt-2">Try Chrome/Safari, allow camera access, and ensure you're on HTTPS.</div>
            </div>
          </div>
        </GlassPanel>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <GlassPanel className="!p-3 relative aspect-video overflow-hidden">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover rounded-cf-md bg-black"
            />
            <canvas ref={canvasRef} className="hidden" />
            {/* 3x3 reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-[60%] aspect-square">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-2 border-white/80 rounded-md backdrop-blur-[2px] shadow-cf-glow"
                  />
                ))}
              </div>
            </div>
            {/* Current face badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 cf-glass rounded-full px-4 py-2 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full ring-2 ring-white/30" style={{ background: label.color }} />
              <span className="text-sm text-cf-hi font-medium">Show {label.name}</span>
            </div>
          </GlassPanel>

          <div className="space-y-4">
            <GlassPanel>
              <div className="text-xs uppercase tracking-wider text-cf-lo mb-3">Progress</div>
              <div className="grid grid-cols-3 gap-2">
                {FACES_TO_SCAN.map((f, i) => {
                  const done = !!captured[f];
                  const active = i === step && !allDone;
                  return (
                    <button
                      key={f}
                      onClick={() => setStep(i)}
                      className={`aspect-square rounded-cf-md flex flex-col items-center justify-center text-xs font-display font-bold border-2 transition-all ${
                        done
                          ? 'border-cf-accent2 bg-cf-accent2/10 text-cf-accent2'
                          : active
                          ? 'border-cf-accent text-cf-accent shadow-cf-glow'
                          : 'border-cf-line text-cf-mid hover:border-cf-line2'
                      }`}
                    >
                      {done ? <Check className="w-4 h-4" /> : f}
                      <span className="text-[9px] text-cf-lo mt-0.5">{f}</span>
                    </button>
                  );
                })}
              </div>
            </GlassPanel>

            <Button
              onClick={captureFrame}
              icon={Camera}
              size="lg"
              className="w-full"
              disabled={allDone}
            >
              {allDone ? 'All faces captured' : `Capture ${label.name}`}
            </Button>

            {allDone ? (
              <GlassPanel className="!bg-cf-accent2/10 !border-cf-accent2/30">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-cf-accent2" />
                  <span className="text-sm font-display font-semibold text-cf-hi">All 6 faces captured</span>
                </div>
                <div className="text-xs text-cf-mid mb-3">
                  Color recognition is in beta — we'll match your faces to a state in the next release.
                </div>
                <Link to="/cubeflow/solver"><Button iconRight={ArrowRight} className="w-full">Continue to solver</Button></Link>
              </GlassPanel>
            ) : (
              <GlassPanel className="!bg-cf-accent/5 !border-cf-accent/20">
                <div className="text-xs text-cf-mid">
                  <strong className="text-cf-hi">Tips:</strong> Use even lighting. Hold your cube ~20 cm from the lens.
                  Align the cube's face inside the 3×3 reticle.
                </div>
              </GlassPanel>
            )}

            <button onClick={() => { setCaptured({}); setStep(0); }} className="text-xs text-cf-mid hover:text-cf-hi flex items-center gap-1">
              <X className="w-3 h-3" /> Reset capture
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
