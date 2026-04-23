import { useState, useEffect } from 'react';
import projects from '../data/projects';

export default function Projects() {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [selected]);

  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-label reveal">02 — Projects</div>
        <h2 className="editorial-heading reveal">
          Things I've <em>made.</em>
        </h2>

        <div className="project-grid">
          {projects.map((p, i) => (
            <button
              type="button"
              key={p.slug}
              onClick={() => setSelected(p)}
              className={`project-polaroid reveal ${i % 2 === 0 ? 'tilt-left' : 'tilt-right'}`}
            >
              <div className="project-polaroid-media">
                <img
                  src={p.thumb}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                />
              </div>
              <div className="project-polaroid-body">
                <div className="project-polaroid-head">
                  <h3>{p.name}</h3>
                  <span className="project-polaroid-arrow" aria-hidden="true">↗</span>
                </div>
                <p className="project-polaroid-tagline">{p.tagline}</p>
                <div className="project-polaroid-tags">
                  {p.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="gh-profile-link reveal">
          <a
            href="https://github.com/csaail"
            target="_blank"
            rel="noreferrer"
            className="gh-view-all"
          >
            <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
            More on GitHub
            <span>&rarr;</span>
          </a>
        </div>
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <div className="project-modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="project-modal-inner" onClick={(e) => e.stopPropagation()}>
        <button className="project-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="project-modal-body">
          <p className="project-modal-slug">Project · {project.slug}</p>
          <h2 className="project-modal-title">{project.name}</h2>
          <p className="project-modal-tagline">{project.tagline}</p>
          <p className="project-modal-desc">{project.description}</p>

          <div className="project-modal-tags">
            {project.tech.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          <div className="project-modal-cta">
            {project.codeLink && (
              <a
                href={project.codeLink}
                target="_blank"
                rel="noreferrer"
                className="project-modal-btn project-modal-btn-dark"
              >
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                </svg>
                View Code
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noreferrer"
                className="project-modal-btn project-modal-btn-light"
              >
                Live Site ↗
              </a>
            )}
          </div>
        </div>

        <div className="project-modal-media">
          <img src={project.thumb} alt={project.name} />
        </div>
      </div>
    </div>
  );
}
