import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="nav-logo">cuboholic</Link>
      <div className={`nav-links${menuOpen ? ' open' : ''}`}>
        <Link to="/career" onClick={() => setMenuOpen(false)}>Career</Link>
        <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
        <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>Contact</a>
      </div>
      <button
        className={`nav-toggle${menuOpen ? ' active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span></span><span></span>
      </button>
    </nav>
  );
}
