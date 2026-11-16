// 3D prints showcase for /prints.
// Add photos to public/prints/ and reference them as '/prints/<file>.jpg'.
// specs is free-form; any entry labelled 'Material' also feeds the Materials section.

const prints = [
  {
    id: 'cube-lamp',
    name: 'Infinity Cube Lamp',
    tagline: 'Ambient desk lamp with a rotating inner cube',
    category: 'Lighting',
    image: '/prints/placeholder-1.svg',
    description:
      'A geometric lamp printed in parts and assembled by hand. Warm 3000K LED, USB-C powered. Every one comes off the bed slightly different.',
    specs: [
      { label: 'Material', value: 'PLA+' },
      { label: 'Size', value: '80 × 80 × 80 mm' },
      { label: 'Weight', value: '220 g' },
      { label: 'Print time', value: '~14 h' },
    ],
  },
  {
    id: 'desk-organizer',
    name: 'Modular Desk Organizer',
    tagline: 'Stackable trays for pens, cables and knick-knacks',
    category: 'Desk',
    image: '/prints/placeholder-2.svg',
    description:
      'A modular tray system — mix and match pieces to fit the desk. Printed as a set of three.',
    specs: [
      { label: 'Material', value: 'PETG' },
      { label: 'Set', value: '3 trays' },
      { label: 'Colors', value: 'Black, White, Sand' },
    ],
  },
  {
    id: 'planter-geo',
    name: 'Geometric Planter',
    tagline: 'Low-poly planter for small succulents',
    category: 'Home',
    image: '/prints/placeholder-3.svg',
    description:
      'Faceted planter with a drainage tray, printed in matte PLA so the facets catch light without shine.',
    specs: [
      { label: 'Material', value: 'Matte PLA' },
      { label: 'Size', value: '100 × 100 × 90 mm' },
      { label: 'Drainage', value: 'Yes' },
    ],
  },
];

export default prints;
