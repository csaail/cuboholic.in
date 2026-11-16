import { useState, useEffect } from 'react';
import photos from '../data/gallery.json'; // generated at build time by scripts/fetch-gallery.js
import Scribble from './motion/Scribble';
import SectionNumber from './motion/SectionNumber';

const PEXELS_PROFILE = 'https://www.pexels.com/@saail-chavan-3631290/gallery/';

export default function Gallery({ standalone = false }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    if (!selectedPhoto) return;
    const onKey = (e) => { if (e.key === 'Escape') setSelectedPhoto(null); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedPhoto]);

  const half = Math.ceil(photos.length / 2);
  const row1 = photos.slice(0, half);
  const row2 = photos.slice(half);

  return (
    <section className="section gallery-section" id="gallery">
      {!standalone && <SectionNumber n="05" />}
      <div className="container">
        <div className="section-label reveal">{standalone ? 'Photography' : '05 — Photography'}</div>
        <h2 className="editorial-heading reveal">
          Photographs &amp;<br /><Scribble variant="swoosh">captured moments.</Scribble>
        </h2>
        <p className="body-text reveal">
          A rolling reel of favorites. Full set lives on Pexels.
        </p>
      </div>

      {photos.length > 0 && (
        <div className="photo-reel">
          <PhotoRow photos={row1} onOpen={setSelectedPhoto} />
          <PhotoRow photos={row2} onOpen={setSelectedPhoto} reverse />
        </div>
      )}

      <div className="container">
        <div className="photo-cta reveal">
          <a
            href={PEXELS_PROFILE}
            target="_blank"
            rel="noreferrer"
            className="gh-view-all"
          >
            See full gallery on Pexels
            <span>&rarr;</span>
          </a>
        </div>
      </div>

      {selectedPhoto && (
        <div className="lightbox" onClick={() => setSelectedPhoto(null)}>
          <button
            className="lightbox-close"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <img
            src={selectedPhoto.src.large2x}
            alt={selectedPhoto.alt || 'Photo by Saail Chavan'}
            onClick={(e) => e.stopPropagation()}
          />
          {selectedPhoto.alt && (
            <p className="lightbox-caption">
              {selectedPhoto.alt}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function PhotoRow({ photos, onOpen, reverse }) {
  // Duplicate the array so the marquee loops seamlessly.
  const loop = [...photos, ...photos];
  return (
    <div className="photo-marquee">
      <div className={`photo-marquee-track${reverse ? ' reverse' : ''}`}>
        {loop.map((photo, i) => (
          <button
            type="button"
            className="photo-marquee-item"
            key={`${photo.id}-${i}`}
            onClick={() => onOpen(photo)}
          >
            <img
              src={photo.src.medium}
              alt={photo.alt || 'Photo by Saail Chavan'}
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
