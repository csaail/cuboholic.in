import { useState } from 'react';

const items = [
  { category: 'photo', label: 'Photo 1', bg: 'linear-gradient(135deg,#1a1a2e,#2a2a4e)', tall: true },
  { category: 'illustration', label: 'Illustration 1', bg: 'linear-gradient(135deg,#2e1a1a,#4e2a2a)', tall: false },
  { category: 'photo', label: 'Photo 2', bg: 'linear-gradient(135deg,#1a2e1a,#2a4e2a)', tall: false },
  { category: 'illustration', label: 'Illustration 2', bg: 'linear-gradient(135deg,#2e2e1a,#4e4e2a)', tall: true },
  { category: 'photo', label: 'Photo 3', bg: 'linear-gradient(135deg,#1a1a2e,#3a2a4e)', tall: false },
  { category: 'illustration', label: 'Illustration 3', bg: 'linear-gradient(135deg,#2e1a2e,#4e2a4e)', tall: false },
];

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Photography', value: 'photo' },
  { label: 'Illustrations', value: 'illustration' },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? items
    : items.filter((item) => item.category === activeFilter);

  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className="section-label reveal">03 — Gallery</div>
        <h2 className="editorial-heading reveal">
          Photographs &amp;<br /><em>illustrations</em>
        </h2>

        <div className="gallery-filters reveal">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`filter-btn${activeFilter === f.value ? ' active' : ''}`}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filtered.map((item, i) => (
            <div className="gallery-item reveal" key={i}>
              <div
                className={`image-placeholder${item.tall ? ' tall' : ''}`}
                style={{ background: item.bg }}
              >
                <span>{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
