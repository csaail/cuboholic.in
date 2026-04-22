export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-art reveal">
        <img src="/hero.png" alt="Saail Chavan — developer, photographer, illustrator" />
      </div>

      <div className="hero-tagline-wrap reveal">
        <p className="hero-tagline-main">
          Code, cameras, and the occasional <em>Rubik's cube.</em>
        </p>

        <div className="hero-cta-row">
          <a href="#projects" className="btn-pill btn-pill-dark">See my work</a>
          <a href="#contact" className="btn-pill btn-pill-light">Say hi</a>
        </div>

        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </div>
    </section>
  );
}
