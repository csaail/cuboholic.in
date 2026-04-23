import { useState, useEffect } from 'react';

const PEXELS_API_KEY = '1XtTdvJhUn5pJoiI3lEbrqlg0PQwgYTD9mVbNXpJEMJjArlrtYopoQ8Z';
const COLLECTION_ID = '0xquq7j';
const PEXELS_PROFILE = 'https://www.pexels.com/@saail-chavan-3631290/gallery/';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch(
          `https://api.pexels.com/v1/collections/${COLLECTION_ID}?type=photos&per_page=16`,
          { headers: { Authorization: PEXELS_API_KEY } }
        );
        const data = await res.json();
        setPhotos(data.media || []);
      } catch (err) {
        console.error('Failed to fetch photos:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

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
      <div className="container">
        <div className="section-label reveal">03 — Gallery</div>
        <h2 className="editorial-heading reveal">
          Photographs &amp;<br /><em>captured moments.</em>
        </h2>
        <p className="body-text reveal">
          A rolling reel of favorites. Full set lives on Pexels.
        </p>
      </div>

      {loading ? (
        <div className="photo-reel photo-reel-loading">
          <div className="photo-reel-skeleton" />
          <div className="photo-reel-skeleton" />
        </div>
      ) : (
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
              {selectedPhoto.alt.replace(/^Free stock photo of /i, '')}
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
