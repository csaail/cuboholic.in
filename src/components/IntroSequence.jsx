import { useState, useEffect, useMemo, useCallback } from 'react';
import './IntroSequence.css';

const messages = [
  'Welcome to my corner of the internet.',
  'A space for code, photography, and visual stories.',
  'Shall we begin?',
];

export default function IntroSequence({ onComplete }) {
  const [scene, setScene] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgState, setMsgState] = useState('entering'); // 'entering' | 'exiting'
  const [curtain, setCurtain] = useState(false);

  const isTouchDevice = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches,
    []
  );

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Lock scroll while intro is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Reduced motion: skip straight to curtain
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      triggerCurtain();
    }
  }, []);

  // Scene 0 auto-advance
  useEffect(() => {
    if (scene !== 0) return;
    const id = setTimeout(() => setScene(1), 2200);
    return () => clearTimeout(id);
  }, [scene]);

  // Scene 2 auto-advance
  useEffect(() => {
    if (scene !== 2) return;
    const id = setTimeout(() => triggerCurtain(), 2800);
    return () => clearTimeout(id);
  }, [scene]);

  // Curtain completion
  useEffect(() => {
    if (!curtain) return;
    const id = setTimeout(() => {
      try { localStorage.setItem('intro-seen', 'true'); } catch {}
      onComplete();
    }, 1300);
    return () => clearTimeout(id);
  }, [curtain, onComplete]);

  const triggerCurtain = useCallback(() => {
    setScene(-1);
    setCurtain(true);
  }, []);

  const handleClick = useCallback((e) => {
    // Don't advance if clicking skip button
    if (e.target.closest('.intro-skip')) return;
    if (scene !== 1 || msgState === 'exiting') return;

    if (msgIndex < messages.length - 1) {
      // Transition to next message
      setMsgState('exiting');
      setTimeout(() => {
        setMsgIndex((i) => i + 1);
        setMsgState('entering');
      }, 400);
    } else {
      // Last message — advance to name reveal
      setMsgState('exiting');
      setTimeout(() => setScene(2), 400);
    }
  }, [scene, msgIndex, msgState]);

  const handleSkip = useCallback((e) => {
    e.stopPropagation();
    triggerCurtain();
  }, [triggerCurtain]);

  return (
    <>
      <div
        className={`intro-overlay${curtain ? ' curtain-active' : ''}`}
        onClick={handleClick}
      >
        <div className="intro-curtain-left" />
        <div className="intro-curtain-right" />

        {/* Scene 0: Greeting */}
        <div className={`intro-scene${scene === 0 ? ' active' : ''}`}>
          <p className="intro-greeting">{greeting}</p>
          <div className="intro-line" />
        </div>

        {/* Scene 1: Messages */}
        <div className={`intro-scene${scene === 1 ? ' active' : ''}`}>
          <div className="intro-message-wrapper">
            <p className={`intro-message ${msgState}`} key={msgIndex}>
              {messages[msgIndex]}
            </p>
          </div>
          <p className="intro-prompt">
            {isTouchDevice ? 'Tap anywhere to continue' : 'Click anywhere to continue'}
          </p>
        </div>

        {/* Scene 2: Name Reveal */}
        <div className={`intro-scene${scene === 2 ? ' active' : ''}`}>
          <div className="intro-name-block">
            <span className={`intro-name-first${scene === 2 ? ' reveal-clip' : ''}`}>
              Saail
            </span>
            <span className={`intro-name-last${scene === 2 ? ' reveal-clip' : ''}`}>
              Chavan
            </span>
            <p className="intro-tagline">Developer &middot; Photographer &middot; Illustrator</p>
          </div>
        </div>
      </div>

      {!curtain && (
        <button className="intro-skip" onClick={handleSkip}>
          Skip
        </button>
      )}
    </>
  );
}
