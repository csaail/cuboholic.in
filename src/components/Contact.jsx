export default function Contact() {
  return (
    <section className="section section-contact" id="contact">
      <div className="container">
        <div className="section-label reveal">04 — Contact</div>
        <div className="contact-grid">
          <div className="contact-text">
            <h2 className="editorial-heading reveal">
              Let's work<br /><em>together</em>.
            </h2>
            <p className="body-text reveal">
              Have a project in mind? I'd love to hear about it. Drop me a message and I'll get back to you soon.
            </p>
            <div className="contact-links reveal">
              <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href="https://linkedin.com/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a>
              <a href="https://twitter.com/" target="_blank" rel="noreferrer">Twitter ↗</a>
            </div>
          </div>
          <form
            className="contact-form reveal"
            action="https://formspree.io/f/YOUR_FORM_ID"
            method="POST"
          >
            <div className="form-field">
              <label>Name</label>
              <input type="text" name="name" required placeholder="Your name" />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input type="email" name="email" required placeholder="you@example.com" />
            </div>
            <div className="form-field">
              <label>Message</label>
              <textarea name="message" rows="5" required placeholder="Tell me about your project..."></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message →</button>
          </form>
        </div>
      </div>
    </section>
  );
}
