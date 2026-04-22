// Product catalog for shop.cuboholic.in
// Edit freely — add images to public/shop/ and reference with /shop/filename.jpg
// price is in INR. razorpayLink is optional (use Razorpay payment-page link for direct checkout).

const products = [
  {
    id: 'cube-lamp',
    name: 'Infinity Cube Lamp',
    tagline: 'Ambient desk lamp with rotating inner cube',
    price: 1499,
    category: 'Lighting',
    images: ['/shop/placeholder-1.svg'],
    description:
      'A hand-printed geometric lamp. Warm 3000K LED, USB-C powered. Each unit is printed and assembled to order — expect minor variation in finish.',
    specs: [
      { label: 'Material', value: 'PLA+' },
      { label: 'Size', value: '80 × 80 × 80 mm' },
      { label: 'Weight', value: '220 g' },
      { label: 'Print time', value: '~14 h' },
    ],
    inStock: true,
    leadTime: '3–5 days',
    razorpayLink: '', // e.g. 'https://rzp.io/l/your-link'
  },
  {
    id: 'desk-organizer',
    name: 'Modular Desk Organizer',
    tagline: 'Stackable trays for pens, cables, knick-knacks',
    price: 899,
    category: 'Desk',
    images: ['/shop/placeholder-2.svg'],
    description:
      'Print-to-order modular system. Mix and match trays to fit your desk. Sold as a set of 3.',
    specs: [
      { label: 'Material', value: 'PETG' },
      { label: 'Set', value: '3 trays' },
      { label: 'Colors', value: 'Black, White, Sand' },
    ],
    inStock: true,
    leadTime: '2–4 days',
    razorpayLink: '',
  },
  {
    id: 'planter-geo',
    name: 'Geometric Planter',
    tagline: 'Low-poly planter for small succulents',
    price: 599,
    category: 'Home',
    images: ['/shop/placeholder-3.svg'],
    description:
      'Faceted planter with drainage tray. Printed in matte PLA. Plant not included.',
    specs: [
      { label: 'Material', value: 'Matte PLA' },
      { label: 'Size', value: '100 × 100 × 90 mm' },
      { label: 'Drainage', value: 'Yes' },
    ],
    inStock: false,
    leadTime: 'Restocking',
    razorpayLink: '',
  },
];

export default products;
