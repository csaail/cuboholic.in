import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import products from '../data/products';

const WHATSAPP_NUMBER = '919999999999'; // TODO: replace with your real number (country code + number, no +)
const CONTACT_EMAIL = 'hello@cuboholic.in'; // TODO: replace

const CATEGORIES = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

function formatINR(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function Shop() {
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    document.title = 'Shop — cuboholic';
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  const filtered = category === 'All'
    ? products
    : products.filter((p) => p.category === category);

  return (
    <div className="shop-page">
      <header className="shop-nav">
        <Link to="/" className="shop-nav-logo">cuboholic</Link>
        <div className="shop-nav-links">
          <Link to="/">Portfolio</Link>
          <span className="shop-nav-current">Shop</span>
        </div>
      </header>

      <section className="shop-hero">
        <div className="container">
          <p className="shop-hero-label">Prints — 2026</p>
          <h1 className="shop-hero-title">
            3D Prints,<br />
            <em>made to order.</em>
          </h1>
          <p className="shop-hero-sub">
            A small catalog of printed objects — lamps, desk kit, planters.
            Want something custom? I print to spec.
          </p>
        </div>
      </section>

      <section className="shop-section" id="catalog">
        <div className="container">
          <div className="shop-section-head">
            <div className="section-label">01 — Catalog</div>
            <div className="shop-filters">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`shop-filter${category === c ? ' active' : ''}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="shop-grid">
            {filtered.map((p) => (
              <button
                type="button"
                className="shop-card"
                key={p.id}
                onClick={() => setSelected(p)}
              >
                <div className="shop-card-media">
                  <img src={p.images[0]} alt={p.name} loading="lazy" />
                  {!p.inStock && <span className="shop-badge">{p.leadTime}</span>}
                </div>
                <div className="shop-card-body">
                  <div className="shop-card-row">
                    <h3>{p.name}</h3>
                    <span className="shop-price">{formatINR(p.price)}</span>
                  </div>
                  <p className="shop-card-tagline">{p.tagline}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="shop-section shop-custom" id="custom">
        <div className="container">
          <div className="section-label">02 — Custom</div>
          <h2 className="editorial-heading">
            Or bring me <em>your idea.</em>
          </h2>
          <p className="body-text">
            Send a sketch, a reference image, or an STL. I'll quote material,
            size, and lead time within a day. From keychains to full dioramas —
            if it prints, I'll print it.
          </p>
          <div className="shop-cta-row">
            <a
              href={whatsappLink("Hey Saail, I'd like a custom 3D print. Here's what I'm thinking:")}
              target="_blank"
              rel="noreferrer"
              className="shop-btn shop-btn-primary"
            >
              Chat on WhatsApp
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Custom 3D print request`}
              className="shop-btn shop-btn-ghost"
            >
              Email instead
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <span>&copy; 2026 cuboholic.in — shop</span>
          <Link to="/" className="shop-footer-link">Back to portfolio &rarr;</Link>
        </div>
      </footer>

      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function ProductModal({ product, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const orderMsg = `Hi! I'd like to order: ${product.name} (${formatINR(product.price)})`;

  return (
    <div className="shop-modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="shop-modal-inner" onClick={(e) => e.stopPropagation()}>
        <button className="shop-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="shop-modal-media">
          <img src={product.images[0]} alt={product.name} />
        </div>

        <div className="shop-modal-body">
          <p className="shop-modal-cat">{product.category}</p>
          <h2 className="shop-modal-title">{product.name}</h2>
          <p className="shop-modal-tagline">{product.tagline}</p>
          <p className="shop-modal-price">{formatINR(product.price)}</p>

          <p className="shop-modal-desc">{product.description}</p>

          <dl className="shop-specs">
            {product.specs.map((s) => (
              <div className="shop-spec" key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="shop-cta-row">
            {product.razorpayLink ? (
              <a
                href={product.razorpayLink}
                target="_blank"
                rel="noreferrer"
                className="shop-btn shop-btn-primary"
              >
                Buy now — {formatINR(product.price)}
              </a>
            ) : (
              <a
                href={whatsappLink(orderMsg)}
                target="_blank"
                rel="noreferrer"
                className="shop-btn shop-btn-primary"
              >
                Order on WhatsApp
              </a>
            )}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Order: ${encodeURIComponent(product.name)}`}
              className="shop-btn shop-btn-ghost"
            >
              Email
            </a>
          </div>

          <p className="shop-lead-time">
            {product.inStock
              ? `In stock · ships in ${product.leadTime}`
              : `Made to order · ${product.leadTime}`}
          </p>
        </div>
      </div>
    </div>
  );
}
