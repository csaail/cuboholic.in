import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Gallery from '../components/Gallery';
import Artwork from '../components/Artwork';
import PointerFX from '../components/motion/PointerFX';
import Scribble from '../components/motion/Scribble';
import useScrollReveal from '../hooks/useScrollReveal';

// Off-the-clock work: photography + sketchbook, with a pointer to the 3D prints page.
export default function Creative() {
  useScrollReveal(true);

  useEffect(() => {
    document.title = 'Creative — Saail Chavan';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="prints-page creative-page">
      <PointerFX />
      <header className="prints-nav">
        <Link to="/" className="prints-nav-logo">Saail Chavan</Link>
        <div className="prints-nav-links">
          <Link to="/">Portfolio</Link>
          <span className="prints-nav-current">Creative</span>
          <Link to="/prints">3D Prints</Link>
        </div>
      </header>

      <section className="creative-hero">
        <div className="container">
          <p className="prints-hero-label">Off the clock</p>
          <h1 className="editorial-heading reveal">
            When I'm not <Scribble variant="swoosh">shipping code.</Scribble>
          </h1>
          <p className="body-text reveal">
            Photographs, sketchbook pages and 3D prints — the things I make for fun.
          </p>
          <nav className="creative-jump reveal" aria-label="On this page">
            <a href="#gallery">Photography ↓</a>
            <a href="#artwork">Sketchbook ↓</a>
            <Link to="/prints">3D prints →</Link>
          </nav>
        </div>
      </section>

      <Gallery standalone />
      <Artwork standalone />

      <section className="section creative-next">
        <div className="container">
          <Link to="/prints" className="creative-next-card reveal">
            <span className="creative-next-kicker">Next up</span>
            <span className="creative-next-title">3D prints →</span>
            <span className="creative-next-sub">Lamps, desk kit, planters — layer by layer.</span>
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <span>&copy; 2026 Saail Chavan — creative</span>
          <Link to="/" className="footer-back-link">Back to portfolio &rarr;</Link>
        </div>
      </footer>
    </div>
  );
}
