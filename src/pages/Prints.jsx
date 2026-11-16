import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import prints from '../data/prints';
import { site } from '../data/site';
import PrinterAnimation from '../components/PrinterAnimation';
import useScrollReveal from '../hooks/useScrollReveal';
import PointerFX from '../components/motion/PointerFX';

const CATEGORIES = ['All', ...Array.from(new Set(prints.map((p) => p.category)))];

const THINGS = ['Lamps', 'Desk kit', 'Planters', 'Keychains', 'Dioramas', 'Your idea'];

const STEPS = [
  {
    title: 'Model',
    body: 'Design it in CAD, or start from a sketch, photo or existing STL.',
    icon: (
      <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Zm0 0v9m0 0 8-4.5M12 12l-8-4.5M12 12v9" />
    ),
  },
  {
    title: 'Slice',
    body: 'The slicer cuts the model into hundreds of thin layers and plans every nozzle move.',
    icon: (
      <path d="M4 7h16M4 11h16M4 15h16M4 19h16M8 3h8" />
    ),
  },
  {
    title: 'Print',
    body: 'Melted filament goes down one layer at a time. Small parts take minutes, big ones take a day.',
    icon: (
      <path d="M7 3h10v6H7zM9 9h6l-1.5 4h-3L9 9Zm3 4v2M5 21h14M8 18h8" />
    ),
  },
  {
    title: 'Finish',
    body: 'Supports come off, edges get sanded, parts get assembled. Then it goes out the door.',
    icon: (
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
    ),
  },
];

const MATERIAL_NOTES = {
  PLA: 'The everyday plastic. Easy to print, crisp detail, perfect for decor.',
  'PLA+': 'A tougher PLA blend — less brittle, still prints crisp. A great all-rounder.',
  'Matte PLA': 'PLA with a chalky, no-shine finish that hides layer lines.',
  PETG: 'Stronger and more heat- and moisture-resistant than PLA. For parts that get used, not just looked at.',
  TPU: 'Flexible and rubbery — phone cases, grips, bumpers.',
  ABS: 'Heat-resistant and sandable, for tougher functional parts.',
};

// Build the materials list from whatever the prints actually use.
const MATERIALS = (() => {
  const map = new Map();
  for (const p of prints) {
    const mat = p.specs.find((s) => s.label === 'Material')?.value;
    if (!mat) continue;
    if (!map.has(mat)) map.set(mat, []);
    map.get(mat).push(p.name);
  }
  return [...map.entries()].map(([name, usedIn]) => ({ name, usedIn, note: MATERIAL_NOTES[name] || '' }));
})();

function whatsappLink(message) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function mailLink(subject, body = '') {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
}

function ContactButtons({ subject, message }) {
  return (
    <div className="prints-cta-row">
      {site.whatsappNumber && (
        <a href={whatsappLink(message)} target="_blank" rel="noreferrer" className="prints-btn prints-btn-primary">
          Chat on WhatsApp
        </a>
      )}
      <a
        href={mailLink(subject, message)}
        className={`prints-btn ${site.whatsappNumber ? 'prints-btn-ghost' : 'prints-btn-primary'}`}
      >
        {site.whatsappNumber ? 'Email instead' : 'Email me'}
      </a>
    </div>
  );
}

export default function Prints() {
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState('All');
  useScrollReveal(true);

  useEffect(() => {
    document.title = '3D Prints — Saail Chavan';
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  const filtered = category === 'All' ? prints : prints.filter((p) => p.category === category);

  return (
    <div className="prints-page">
      <PointerFX />
      <header className="prints-nav">
        <Link to="/" className="prints-nav-logo">Saail Chavan</Link>
        <div className="prints-nav-links">
          <Link to="/">Portfolio</Link>
          <Link to="/creative">Creative</Link>
          <span className="prints-nav-current">3D Prints</span>
        </div>
      </header>

      <section className="prints-hero">
        <div className="container prints-hero-grid">
          <div>
            <p className="prints-hero-label">3D printing — FDM</p>
            <h1 className="prints-hero-title">
              Layer by layer,<br />
              <em>idea → object.</em>
            </h1>
            <p className="prints-hero-sub">
              Lamps, desk kit, planters, and whatever odd part someone needs. This is where
              everything that comes off my printer ends up.
            </p>
            <div className="prints-cta-row">
              <a href="#gallery" className="prints-btn prints-btn-primary">See the prints</a>
              <a href="#custom" className="prints-btn prints-btn-ghost">Request a print</a>
            </div>
          </div>
          <figure className="prints-printer">
            <PrinterAnimation />
            <figcaption>now printing…</figcaption>
          </figure>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...THINGS, ...THINGS, ...THINGS, ...THINGS].map((t, i) => (
            <span key={i}>
              {i > 0 && <span style={{ margin: '0 16px' }}>◼</span>}
              {t}
            </span>
          ))}
        </div>
      </div>

      <section className="prints-section" id="gallery">
        <div className="container">
          <div className="prints-section-head">
            <div className="section-label">01 — Off the bed</div>
            <div className="prints-filters">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`prints-filter${category === c ? ' active' : ''}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="prints-grid">
            {filtered.map((p) => {
              const material = p.specs.find((s) => s.label === 'Material')?.value;
              return (
                <button
                  type="button"
                  className="prints-card"
                  key={p.id}
                  onClick={() => setSelected(p)}
                >
                  <div className="prints-card-media">
                    <img src={p.image} alt={p.name} loading="lazy" />
                    <span className="prints-badge">{p.category}</span>
                  </div>
                  <div className="prints-card-body">
                    <div className="prints-card-row">
                      <h3>{p.name}</h3>
                      {material && <span className="prints-material">{material}</span>}
                    </div>
                    <p className="prints-card-tagline">{p.tagline}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="prints-section">
        <div className="container">
          <div className="section-label">02 — How it's made</div>
          <h2 className="editorial-heading">
            From a file to <em>a thing you can hold.</em>
          </h2>
          <ol className="prints-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="prints-step reveal">
                <span className="prints-step-num">{String(i + 1).padStart(2, '0')}</span>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {s.icon}
                </svg>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {MATERIALS.length > 0 && (
        <section className="prints-section">
          <div className="container">
            <div className="section-label">03 — Materials</div>
            <h2 className="editorial-heading">
              Picking the <em>right plastic.</em>
            </h2>
            <div className="prints-materials">
              {MATERIALS.map((m) => (
                <div key={m.name} className="prints-material-card reveal">
                  <div className="prints-swatch" aria-hidden="true" />
                  <h3>{m.name}</h3>
                  {m.note && <p>{m.note}</p>}
                  <p className="prints-used-in">Used in: {m.usedIn.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="prints-section prints-custom" id="custom">
        <div className="container">
          <div className="section-label">04 — Custom prints</div>
          <h2 className="editorial-heading">
            Or bring me <em>your idea.</em>
          </h2>
          <p className="body-text">
            Send a sketch, a reference image, or an STL. I'll come back with material, size,
            and how long it'll take. From keychains to full dioramas — if it prints, I'll print it.
          </p>
          <ContactButtons
            subject="Custom 3D print request"
            message="Hey Saail, I'd like a custom 3D print. Here's what I'm thinking:"
          />
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <span>&copy; 2026 Saail Chavan — 3D prints</span>
          <Link to="/" className="footer-back-link">Back to portfolio &rarr;</Link>
        </div>
      </footer>

      {selected && <PrintModal print={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function PrintModal({ print, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="prints-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={print.name}>
      <div className="prints-modal-inner" onClick={(e) => e.stopPropagation()}>
        <button className="prints-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="prints-modal-media">
          <img src={print.image} alt={print.name} />
        </div>

        <div className="prints-modal-body">
          <p className="prints-modal-cat">{print.category}</p>
          <h2 className="prints-modal-title">{print.name}</h2>
          <p className="prints-modal-tagline">{print.tagline}</p>
          <p className="prints-modal-desc">{print.description}</p>

          <dl className="prints-specs">
            {print.specs.map((s) => (
              <div className="prints-spec" key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>

          <p className="prints-modal-ask">Want one like this?</p>
          <ContactButtons
            subject={`About your print: ${print.name}`}
            message={`Hi Saail! I saw the ${print.name} on your site and I'd like one.`}
          />
        </div>
      </div>
    </div>
  );
}
