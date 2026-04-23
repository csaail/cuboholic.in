import { useState, useEffect, useMemo } from 'react';
import artworks from '../data/artworks';

export default function Artwork() {
  const spreads = useMemo(() => {
    const out = [];
    for (let i = 0; i < artworks.length; i += 2) {
      out.push([artworks[i], artworks[i + 1] || null]);
    }
    return out;
  }, []);

  const [spreadIdx, setSpreadIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [zoom, setZoom] = useState(null);
  const totalSpreads = spreads.length;

  const goTo = (nextIdx, direction) => {
    setDir(direction);
    setSpreadIdx(nextIdx);
  };
  const canPrev = spreadIdx > 0;
  const canNext = spreadIdx < totalSpreads - 1;
  const prev = () => canPrev && goTo(spreadIdx - 1, -1);
  const next = () => canNext && goTo(spreadIdx + 1, 1);
  const jumpTo = (target) => {
    if (target === spreadIdx) return;
    goTo(target, target > spreadIdx ? 1 : -1);
  };

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e) => { if (e.key === 'Escape') setZoom(null); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [zoom]);

  return (
    <section className="section artwork-section" id="artwork">
      {/* Scattered hand-drawn doodles */}
      <Doodle className="doodle doodle-star-1" />
      <Doodle className="doodle doodle-arrow-1" variant="arrow" />
      <Doodle className="doodle doodle-squiggle-1" variant="squiggle" />
      <Doodle className="doodle doodle-heart-1" variant="heart" />
      <Doodle className="doodle doodle-star-2" />
      <Doodle className="doodle doodle-spark-1" variant="spark" />
      <Doodle className="doodle doodle-arrow-2" variant="arrow-curl" />

      <div className="container">
        <div className="section-label reveal">04 — Artwork</div>
        <h2 className="editorial-heading reveal">
          Scribbles &amp; <em>doodles.</em>
        </h2>
        <p className="body-text reveal">
          A peek inside my sketchbook — characters, moments, and whatever's stuck in my head that day.
        </p>

        <div className="sketchbook reveal">
          <div className="sketchbook-binding" aria-hidden="true" />
          <div
            className="sketchbook-spread"
            key={spreadIdx}
            data-dir={dir}
          >
            {spreads[spreadIdx].map((art, i) =>
              art ? (
                <button
                  type="button"
                  className={`sketchbook-page ${i === 0 ? 'page-left' : 'page-right'}`}
                  key={`${spreadIdx}-${i}`}
                  onClick={() => setZoom(art)}
                >
                  <img
                    src={art.src}
                    alt={art.alt}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                  />
                </button>
              ) : (
                <div className={`sketchbook-page sketchbook-page-empty ${i === 0 ? 'page-left' : 'page-right'}`} key={`empty-${i}`} />
              )
            )}
          </div>

          <div className="sketchbook-controls">
            <button
              type="button"
              className="sketchbook-btn"
              onClick={prev}
              disabled={!canPrev}
              aria-label="Previous spread"
            >
              ←
            </button>
            <div className="sketchbook-dots">
              {spreads.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  className={`sketchbook-dot${i === spreadIdx ? ' active' : ''}`}
                  onClick={() => jumpTo(i)}
                  aria-label={`Spread ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="sketchbook-btn"
              onClick={next}
              disabled={!canNext}
              aria-label="Next spread"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {zoom && (
        <div className="lightbox" onClick={() => setZoom(null)}>
          <button
            className="lightbox-close"
            onClick={() => setZoom(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <img
            src={zoom.src}
            alt={zoom.alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}

function Doodle({ className, variant = 'star' }) {
  const paths = {
    star: (
      <path
        d="M12 2l2.5 6.5L21 10l-5 4.5L17.5 21 12 17.5 6.5 21 8 14.5 3 10l6.5-1.5L12 2z"
        stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" strokeLinecap="round"
      />
    ),
    heart: (
      <path
        d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 5.5 4 4 7-2.5 4.5-9.5 9-9.5 9z"
        stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" strokeLinecap="round"
      />
    ),
    arrow: (
      <path
        d="M4 12c6-6 12-2 16 0M18 8l3 4-3 4"
        stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" strokeLinecap="round"
      />
    ),
    'arrow-curl': (
      <path
        d="M3 14c4-8 12-10 17-4M18 6l2 4-5 1"
        stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" strokeLinecap="round"
      />
    ),
    squiggle: (
      <path
        d="M2 12c3-4 5 4 8 0s5-4 8 0 5 4 4 0"
        stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" strokeLinecap="round"
      />
    ),
    spark: (
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" />
      </g>
    ),
  };
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="40"
      height="40"
      aria-hidden="true"
    >
      {paths[variant] || paths.star}
    </svg>
  );
}
