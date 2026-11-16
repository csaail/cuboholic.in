// Site-wide contact details. This is the ONE place to fill in personal values.
// Anything left as '' is hidden (or falls back to email) so the site never ships a dead link.

export const site = {
  name: 'Saail Chavan',
  email: 'saail.work@gmail.com',

  // Formspree form ID (the part after formspree.io/f/). Create one free at https://formspree.io.
  // While empty, the contact form opens the visitor's email app with the message pre-filled.
  formspreeId: '',

  // WhatsApp number for 3D print requests: country code + number, digits only (e.g. '919876543210').
  // While empty, the 3D Prints page uses email instead.
  whatsappNumber: '',

  // Profiles shown in the Contact section. Entries with an empty url are hidden.
  socials: [
    { label: 'GitHub', url: 'https://github.com/csaail' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/saail' },
    { label: 'Pexels', url: 'https://www.pexels.com/@saail-chavan-3631290/gallery/' },
    { label: 'Instagram', url: '' },
    { label: 'Twitter', url: '' },
  ],
};

export const visibleSocials = site.socials.filter((s) => s.url);
