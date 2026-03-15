import { useState, useEffect, useRef } from 'react';

const PEXELS_API_KEY = '1XtTdvJhUn5pJoiI3lEbrqlg0PQwgYTD9mVbNXpJEMJjArlrtYopoQ8Z';
const COLLECTION_ID = '0xquq7j';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch(
          `https://api.pexels.com/v1/collections/${COLLECTION_ID}?type=photos&per_page=80`,
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
    if (!gridRef.current || photos.length === 0) return;
    const items = gridRef.current.querySelectorAll('.gallery-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [photos]);

  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className="section-label reveal">03 — Gallery</div>
        <h2 className="editorial-heading reveal">
          Photographs &amp;<br /><em>captured moments</em>
        </h2>

        {loading ? (
          <div className="gallery-loading">Loading photos...</div>
        ) : (
          <div className="gallery-grid" ref={gridRef}>
            {photos.map((photo, i) => (
              <div
                className="gallery-item"
                key={photo.id}
                style={{ transitionDelay: `${Math.min(i * 60, 600)}ms` }}
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.src.large}
                  alt={photo.alt || 'Photo by Saail Chavan'}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
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
            <p className="lightbox-caption">{selectedPhoto.alt.replace(/^Free stock photo of /i, '')}</p>
          )}
        </div>
      )}
    </section>
  );
}
