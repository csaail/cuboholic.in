import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PointerFX from '../components/motion/PointerFX';
import { contact, experience, education, certifications, skills, resumePath } from '../data/career';

export default function Career() {
  useEffect(() => {
    document.title = 'Résumé — Saail Chavan';
  }, []);

  return (
    <div className="career-page">
      <PointerFX />
      <header className="career-nav">
        <Link to="/" className="career-nav-logo">Saail Chavan</Link>
        <Link to="/" className="career-back">← Back to portfolio</Link>
      </header>

      <section className="career-hero">
        <div className="container">
          <p className="section-label">Career</p>
          <h1 className="career-hero-title">
            The <em>long version.</em>
          </h1>
          <p className="career-hero-sub">
            Experience, certifications, and the stuff that doesn't fit on the home page.
          </p>
          <div className="career-cta-row">
            {resumePath && (
              <a href={resumePath} download className="btn-pill btn-pill-dark">
                ↓ Download Resume
              </a>
            )}
            <a href={`mailto:${contact.email}`} className={`btn-pill ${resumePath ? 'btn-pill-light' : 'btn-pill-dark'}`}>
              Get in touch
            </a>
          </div>
        </div>
      </section>

      <section className="career-block">
        <div className="container">
          <div className="section-label">Experience</div>
          <div className="timeline">
            {experience.map((job, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-marker" aria-hidden="true" />
                <div className="timeline-content">
                  <div className="timeline-head">
                    <h3>{job.role}</h3>
                    <span className="timeline-dates">{job.dates}</span>
                  </div>
                  <p className="timeline-company">
                    <strong>{job.company}</strong>{job.location ? ` · ${job.location}` : ''}
                  </p>
                  <ul className="timeline-bullets">
                    {job.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="career-block">
        <div className="container">
          <div className="section-label">Education</div>
          <div className="timeline">
            {education.map((e, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-marker" aria-hidden="true" />
                <div className="timeline-content">
                  <div className="timeline-head">
                    <h3>{e.degree}</h3>
                    <span className="timeline-dates">{e.dates}</span>
                  </div>
                  <p className="timeline-company"><strong>{e.school}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="career-block">
        <div className="container">
          <div className="section-label">Certifications</div>
          <div className="cert-grid">
            {certifications.map((c, i) => (
              <a
                key={i}
                href={c.link || '#'}
                target={c.link ? '_blank' : undefined}
                rel="noreferrer"
                className={`cert-card${c.link ? '' : ' cert-card-static'}`}
              >
                <div className="cert-badge" aria-hidden="true">✓</div>
                <div className="cert-body">
                  <h4>{c.name}</h4>
                  <p>{c.issuer}{c.date ? ` · ${c.date}` : ''}</p>
                </div>
                {c.link && <span className="cert-arrow">↗</span>}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="career-block">
        <div className="container">
          <div className="section-label">Skills</div>
          <div className="skills-grid">
            {skills.map((group) => (
              <div className="skills-group" key={group.group}>
                <h4>{group.group}</h4>
                <div className="skills-items">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <span>&copy; 2026 Saail Chavan</span>
          <Link to="/" className="footer-back-link">Back to portfolio &rarr;</Link>
        </div>
      </footer>
    </div>
  );
}
