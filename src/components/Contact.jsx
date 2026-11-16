import { useState } from 'react';
import { site, visibleSocials } from '../data/site';
import Scribble from './motion/Scribble';
import SectionNumber from './motion/SectionNumber';

const BUTTON_LABEL = {
  idle: 'Send Message →',
  sending: 'Sending…',
  sent: 'Sent ✓',
  error: 'Send Message →',
};

export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // No Formspree yet → hand off to the visitor's email app with everything pre-filled.
    if (!site.formspreeId) {
      const subject = `Hello from ${data.get('name')}`;
      const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="section section-contact" id="contact">
      <SectionNumber n="05" />
      <div className="container">
        <div className="section-label reveal">05 — Contact</div>
        <div className="contact-grid">
          <div className="contact-text">
            <h2 className="editorial-heading reveal">
              Let's build something<br /><Scribble variant="swoosh">together.</Scribble>
            </h2>
            <p className="body-text reveal">
              Open to full-time roles, freelance projects, and collaborations in AI and
              full-stack development. Send a message, or email me directly.
            </p>
            <div className="email-chip reveal">
              <span className="email-chip-dot" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="email-chip-addr">{site.email}</a>
              <button type="button" className="email-chip-copy magnetic" onClick={copyEmail} aria-live="polite">
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <div className="contact-links reveal">
              {visibleSocials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>
              ))}
            </div>
          </div>
          <form className="contact-form reveal" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" type="text" name="name" required placeholder="Your name" />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" type="email" name="email" required placeholder="you@example.com" />
            </div>
            <div className="form-field">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows="5" required placeholder="Tell me about your project..."></textarea>
            </div>
            <button type="submit" className="submit-btn" disabled={status === 'sending'}>
              {BUTTON_LABEL[status]}
            </button>
            <p className="form-status" role="status" aria-live="polite">
              {status === 'sent' && "Got it — I'll get back to you soon."}
              {status === 'error' && (
                <>Something went wrong. Email me directly at <a href={`mailto:${site.email}`}>{site.email}</a>.</>
              )}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
