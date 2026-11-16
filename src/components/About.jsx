import { Link } from 'react-router-dom';
import projects from '../data/projects';
import { experience, education, contact } from '../data/career';
import CountUp from './motion/CountUp';
import Scribble from './motion/Scribble';
import SectionNumber from './motion/SectionNumber';

export default function About() {
  const latestDegree = education[0];

  return (
    <section className="section" id="about">
      <SectionNumber n="01" />
      <div className="container">
        <div className="section-label reveal">01 — About</div>
        <h2 className="editorial-heading reveal">
          Engineering <Scribble>intelligent,</Scribble><br />user-centered software.
        </h2>
        <div className="about-grid">
          <div className="about-text">
            <p className="body-text reveal">
              I'm an AI and full-stack engineer based in {contact.location}, with 1.5+ years of
              building web apps and AI-powered products end to end — from backend services and
              AI integration to responsive front ends — with a focus on clean, reliable,
              user-friendly software.
            </p>
            <p className="body-text reveal">
              At {experience[0].company.replace(/ Limited$/, '')} I built a bilingual AI maths tutoring
              platform: LangChain and RAG over past exam papers generate lessons, quizzes and
              animated walkthroughs behind a FastAPI backend and a React/TypeScript front end.
              Before that, at {experience[1].company}, I built and published drone-control and camera
              libraries on PyPI.
            </p>
            <p className="body-text reveal">
              Away from the keyboard I take photos, fill sketchbooks and 3D-print things —
              that lives on the <Link to="/creative">creative page</Link>.
            </p>
            <div className="about-stats reveal">
              <div className="stat">
                <span className="stat-num">1.5+</span>
                <span className="stat-label">Years building<br />AI &amp; web products</span>
              </div>
              <div className="stat">
                <span className="stat-num"><CountUp to={projects.length} /></span>
                <span className="stat-label">Featured<br />projects</span>
              </div>
              <div className="stat">
                <span className="stat-num">M.Sc.</span>
                <span className="stat-label">{latestDegree.degree.replace(/^M\.Sc\.\s*/, '')}<br />{latestDegree.dates.split('—').pop().trim()}</span>
              </div>
            </div>

            <div className="about-cta reveal">
              <Link to="/career" className="btn-pill btn-pill-dark">
                Full résumé →
              </Link>
            </div>
          </div>
          <div className="about-image reveal">
            <img
              src="/me.webp"
              alt="Photo of Saail Chavan"
              className="about-photo"
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
            />
            <div className="image-placeholder" style={{ display: 'none' }}>
              <span>ADD /public/me.webp</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
