export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-label reveal">01 — About</div>
        <h2 className="editorial-heading reveal">
          Building digital<br /><em>experiences</em> that matter.
        </h2>
        <div className="about-grid">
          <div className="about-text">
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
            <img
              src="/me.png"
              alt="Saail Chavan"
              className="about-photo"
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
            />
            <div className="image-placeholder" style={{ display: 'none' }}>
              <span>ADD /public/me.png</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
