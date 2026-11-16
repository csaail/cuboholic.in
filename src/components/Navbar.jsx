import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SECTION_LINKS = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#toolkit', label: 'Skills' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="nav-logo">Saail Chavan</Link>
      <div className={`nav-links${menuOpen ? ' open' : ''}`}>
        {SECTION_LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={(e) => handleLinkClick(e, l.href)}>{l.label}</a>
        ))}
        <Link to="/career" onClick={close}>Résumé</Link>
        <Link to="/creative" onClick={close}>Creative</Link>
        <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>Contact</a>
      </div>
      <button
        className={`nav-toggle${menuOpen ? ' active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        aria-expanded={menuOpen}
      >
        <span></span><span></span>
      </button>
    </nav>
  );
}
