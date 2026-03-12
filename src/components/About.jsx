export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-label reveal">01 — About</div>
        <div className="about-grid">
          <div className="about-text">
            <h2 className="editorial-heading reveal">
              Building digital<br /><em>experiences</em> that matter.
            </h2>
            <p className="body-text reveal">
              I'm a developer who loves crafting things for the web. When I'm not writing code, you'll find me capturing moments through my camera or creating digital illustrations.
            </p>
            <p className="body-text reveal">
              I also solve Rubik's cubes obsessively — hence the name <strong>cuboholic</strong>.
            </p>
            <div className="about-stats reveal">
              <div className="stat">
                <span className="stat-num">3+</span>
                <span className="stat-label">Years of<br />Experience</span>
              </div>
              <div className="stat">
                <span className="stat-num">20+</span>
                <span className="stat-label">Projects<br />Completed</span>
              </div>
              <div className="stat">
                <span className="stat-num">500+</span>
                <span className="stat-label">Photos<br />Captured</span>
              </div>
            </div>
          </div>
          <div className="about-image reveal">
            <div className="image-placeholder">
              <span>YOUR PHOTO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
