export const PRODUCTS_DATA = [
  {
    id: 'vel-01',
    name: 'Structured Cashmere Overcoat',
    subtitle: 'Double-faced Italian virgin wool & cashmere',
    category: 'Apparel',
    price: 890,
    popularity: 98,
    isNew: true,
    stock: 6,
    colors: [
      { name: 'Oatmeal', hex: '#D6CFC2' },
      { name: 'Obsidian', hex: '#18181B' },
      { name: 'Camel', hex: '#A67B5B' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Tailored with a relaxed, architectural drape, our signature overcoat is crafted in Biella, Italy from double-faced virgin wool and Mongolian cashmere. Hand-finished seams eliminate the need for heavy lining.',
    materials: '85% Virgin Wool, 15% Cashmere. Horn buttons. Dry clean only with eco-friendly solvents.',
    shippingInfo: 'Complimentary insured courier delivery within 2–4 business days. 30-day effortless returns.'
  },
  {
    id: 'vel-02',
    name: 'Atelier Leather Tote Bag',
    subtitle: 'Full-grain vegetable-tanned Tuscan calfskin',
    category: 'Accessories',
    price: 640,
    popularity: 95,
    isNew: true,
    stock: 9,
    colors: [
      { name: 'Saddle', hex: '#8B4513' },
      { name: 'Noir', hex: '#1C1917' },
      { name: 'Stone', hex: '#C7C2B8' }
    ],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Designed to carry a 16-inch laptop and daily essentials without losing its sculptural silhouette. Features raw suede interior lining, magnetic bridge closure, and hand-painted edges.',
    materials: '100% Vegetable-tanned Italian calfskin. Brushed solid brass hardware.',
    shippingInfo: 'Includes organic cotton dust bag and authenticity certificate. Ships within 24 hours.'
  },
  {
    id: 'vel-03',
    name: 'Santal & Hinoki Eau de Parfum',
    subtitle: '100ml / 3.4 fl. oz. Extrait de Parfum',
    category: 'Fragrances',
    price: 215,
    popularity: 94,
    isNew: false,
    stock: 14,
    colors: [
      { name: '100ml Bottle', hex: '#27272A' },
      { name: '50ml Travel', hex: '#71717A' }
    ],
    sizes: ['50ml', '100ml'],
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'An intimate, meditative fragrance opening with crushed cardamom and Japanese cypress, settling into creamy Australian sandalwood, smoked papyrus, and warm ambergris.',
    materials: '28% perfume oil concentration. Botanical grain alcohol. Refillable heavyweight apothecary glass.',
    shippingInfo: 'Ground shipping compliant. Complimentary 2ml discovery sample included with every bottle.'
  },
  {
    id: 'vel-04',
    name: 'Travertine Sculptural Vessel',
    subtitle: 'Hand-turned Roman travertine centerpiece',
    category: 'Home Objects',
    price: 320,
    popularity: 88,
    isNew: true,
    stock: 4,
    colors: [
      { name: 'Raw Limestone', hex: '#E5DFD3' },
      { name: 'Silver Vein', hex: '#A8A29E' }
    ],
    sizes: ['Medium (24cm)', 'Large (32cm)'],
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Carved from a single block of porous Roman travertine, each vessel carries unique organic veining and fossilized textures. Sealed internally for fresh botanical arrangements.',
    materials: '100% Natural Italian Travertine stone with protective cork base pad.',
    shippingInfo: 'Custom foam-crated packaging ensures safe transit worldwide.'
  },
  {
    id: 'vel-05',
    name: 'Merino Ribbed Mock-Neck Knit',
    subtitle: 'Extra-fine 19.5 micron Australian merino',
    category: 'Apparel',
    price: 285,
    popularity: 92,
    isNew: false,
    stock: 18,
    colors: [
      { name: 'Espresso', hex: '#3E2723' },
      { name: 'Alabaster', hex: '#F5F5F0' },
      { name: 'Charcoal', hex: '#27272A' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Knitted in a dense half-cardigan stitch that retains structure while offering breathable warmth. Refined saddle shoulders create a clean, flattering line.',
    materials: '100% RWS-certified Extra-Fine Merino Wool. Hand wash cold or dry clean.',
    shippingInfo: 'Ships within 1–2 business days.'
  },
  {
    id: 'vel-06',
    name: 'Minimalist Chronograph Watch',
    subtitle: '38mm brushed 316L steel & sapphire crystal',
    category: 'Accessories',
    price: 780,
    popularity: 96,
    isNew: true,
    stock: 5,
    colors: [
      { name: 'Silver / Black', hex: '#D4D4D8' },
      { name: 'Champagne / Tan', hex: '#D6B98C' }
    ],
    sizes: ['38mm'],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Stripped of superfluous markings, our Bauhaus-inspired timepiece houses a Swiss Ronda movement behind a domed anti-reflective sapphire crystal.',
    materials: '316L Surgical Stainless Steel, Domed Sapphire Glass, Quick-release Italian leather strap.',
    shippingInfo: 'Includes 5-year international warranty and presentation box.'
  },
  {
    id: 'vel-07',
    name: 'Smoked Fig & Cedar Candle',
    subtitle: 'Hand-poured botanical soy & coconut wax',
    category: 'Home Objects',
    price: 95,
    popularity: 90,
    isNew: false,
    stock: 25,
    colors: [
      { name: 'Amber Glass', hex: '#78350F' },
      { name: 'Matte Ceramic', hex: '#E4E4E7' }
    ],
    sizes: ['260g (65hr)'],
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Notes of wild Mediterranean fig leaf, black tea, and Atlas cedarwood fill expansive rooms with a subtle, grounding warmth.',
    materials: '100% GMO-free soy & coconut wax blend, unbleached braided cotton wick.',
    shippingInfo: 'Ships within 24 hours.'
  },
  {
    id: 'vel-08',
    name: 'Pleated Wide-Leg Wool Trousers',
    subtitle: 'Fluid drape high-waisted tailoring',
    category: 'Apparel',
    price: 390,
    popularity: 89,
    isNew: true,
    stock: 11,
    colors: [
      { name: 'Taupe', hex: '#8C7E72' },
      { name: 'Midnight', hex: '#18181B' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Cut with deep front pleats and an elongated full-length leg that moves effortlessly. Finished with an extended waistband tab and concealed hook closure.',
    materials: '100% Tropical-weight Virgin Wool. Cupro half-lining.',
    shippingInfo: 'Complimentary hem alteration credit included.'
  },
  {
    id: 'vel-09',
    name: 'Vétiver & Bergamot Mist',
    subtitle: '100ml Eau de Cologne & Linen Spray',
    category: 'Fragrances',
    price: 165,
    popularity: 84,
    isNew: false,
    stock: 19,
    colors: [
      { name: 'Clear Apothecary', hex: '#E4E4E7' }
    ],
    sizes: ['100ml'],
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Crisp Calabrian bergamot and petitgrain brightened over earthy Haitian vetiver root. Formulated for both skin and fine natural textiles.',
    materials: 'Cold-pressed citrus essential oils, Haitian vetiver extract.',
    shippingInfo: 'Ships within 24 hours.'
  },
  {
    id: 'vel-10',
    name: 'Architectural Acetate Sunglasses',
    subtitle: 'Hand-cured Japanese Takiron acetate',
    category: 'Accessories',
    price: 340,
    popularity: 91,
    isNew: true,
    stock: 8,
    colors: [
      { name: 'Tortoise', hex: '#5C3A21' },
      { name: 'Jet Black', hex: '#09090B' }
    ],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Sculpted bevels catch the light across a bold geometric frame fitted with Carl Zeiss mineral glass lenses offering 100% UVA/UVB protection.',
    materials: 'Japanese Cellulose Acetate, 5-barrel German hinges, Zeiss optics.',
    shippingInfo: 'Includes collapsible vegan leather case and microfiber cloth.'
  },
  {
    id: 'vel-11',
    name: 'Belgian Flax Linen Throw',
    subtitle: 'Heavyweight stonewashed waffle weave',
    category: 'Home Objects',
    price: 245,
    popularity: 87,
    isNew: false,
    stock: 13,
    colors: [
      { name: 'Raw Flax', hex: '#D8D0C5' },
      { name: 'Terracotta', hex: '#9A3412' },
      { name: 'Slate', hex: '#52525B' }
    ],
    sizes: ['140 x 200 cm'],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Woven from long-staple European flax and enzyme-washed for immediate softness. Regulates temperature year-round across bed or sofa.',
    materials: '100% OEKO-TEX Certified Belgian Linen (420 GSM).',
    shippingInfo: 'Ships within 1–2 business days.'
  },
  {
    id: 'vel-12',
    name: 'Silk Charmeuse Relaxed Shirt',
    subtitle: '22-momme mulberry silk with mother-of-pearl',
    category: 'Apparel',
    price: 360,
    popularity: 93,
    isNew: true,
    stock: 7,
    colors: [
      { name: 'Ivory', hex: '#FAF9F6' },
      { name: 'Bronze', hex: '#78350F' },
      { name: 'Ink', hex: '#18181B' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1604695573706-53170668f6a6?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Luminous yet understated, featuring a concealed placket, French seams, and elongated barrel cuffs designed to be worn fluidly tucked or loose.',
    materials: '100% 22-Momme Mulberry Silk. Trochus shell buttons.',
    shippingInfo: 'Presented in signature archival garment box.'
  },
  {
    id: 'vel-13',
    name: 'Oud & Black Amber Elixir',
    subtitle: '50ml Pure Parfum Oil & Atomizer',
    category: 'Fragrances',
    price: 275,
    popularity: 95,
    isNew: true,
    stock: 6,
    colors: [
      { name: 'Smoked Obsidian', hex: '#18181B' }
    ],
    sizes: ['50ml'],
    images: [
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Aged agarwood resin meets saffron threads, labdanum, and roasted tonka bean for an unforgettable, lingering nocturnal trail.',
    materials: 'Sustainably harvested Assam oud, natural resins.',
    shippingInfo: 'Complimentary express courier shipping.'
  },
  {
    id: 'vel-14',
    name: 'Brushed Brass Desk Lamp',
    subtitle: 'Dimmable warm-spectrum architectural task light',
    category: 'Home Objects',
    price: 490,
    popularity: 86,
    isNew: false,
    stock: 5,
    colors: [
      { name: 'Unlacquered Brass', hex: '#B45309' },
      { name: 'Bronzed Steel', hex: '#3F3F46' }
    ],
    sizes: ['Standard'],
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Precision-milled from solid brass that develops a rich natural patina over time. Features a capacitive touch dimmer and 2700K museum-grade CRI 97 LED array.',
    materials: 'Solid unlacquered brass, braided textile cord.',
    shippingInfo: 'Universal 110–240V adapter included.'
  },
  {
    id: 'vel-15',
    name: 'Woven Calfskin Cardholder',
    subtitle: 'Intrecciato hand-loomed slim wallet',
    category: 'Accessories',
    price: 220,
    popularity: 89,
    isNew: false,
    stock: 22,
    colors: [
      { name: 'Espresso', hex: '#3E2723' },
      { name: 'Sage', hex: '#6B705C' },
      { name: 'Black', hex: '#18181B' }
    ],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Six card slots and a central folded-note compartment crafted from supple nappa strips woven by hand in our Florence workshop.',
    materials: '100% Full-grain Nappa Calfskin.',
    shippingInfo: 'Gift-wrapped in signature linen box.'
  },
  {
    id: 'vel-16',
    name: 'Structured Linen-Blend Blazer',
    subtitle: 'Unlined single-breasted summer tailoring',
    category: 'Apparel',
    price: 540,
    popularity: 90,
    isNew: true,
    stock: 8,
    colors: [
      { name: 'Sandstone', hex: '#D6CFC2' },
      { name: 'Olive', hex: '#4D5D53' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Breathable Belgian linen blended with crisp virgin wool to resist creasing while maintaining soft-shoulder Sartorial poise.',
    materials: '62% Belgian Linen, 38% Virgin Wool.',
    shippingInfo: 'Ships on contoured wooden hanger.'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'VLR-89421',
    date: 'October 14, 2026',
    status: 'Delivered',
    total: 1105,
    subtotal: 1105,
    discount: 0,
    shipping: 0,
    address: '14 Neftchilar Avenue, Apt 8, Baku AZ1000, Azerbaijan',
    items: [
      { id: 'vel-01', name: 'Structured Cashmere Overcoat', price: 890, qty: 1, color: 'Oatmeal', size: 'M', image: PRODUCTS_DATA[0].images[0] },
      { id: 'vel-03', name: 'Santal & Hinoki Eau de Parfum', price: 215, qty: 1, color: '100ml Bottle', size: '100ml', image: PRODUCTS_DATA[2].images[0] }
    ]
  },
  {
    id: 'VLR-84109',
    date: 'August 29, 2026',
    status: 'Delivered',
    total: 640,
    subtotal: 640,
    discount: 0,
    shipping: 0,
    address: '14 Neftchilar Avenue, Apt 8, Baku AZ1000, Azerbaijan',
    items: [
      { id: 'vel-02', name: 'Atelier Leather Tote Bag', price: 640, qty: 1, color: 'Saddle', size: 'One Size', image: PRODUCTS_DATA[1].images[0] }
    ]
  }
];

export const FAQ_DATA = [
  {
    category: 'Shipping & Delivery',
    question: 'Do you offer complimentary international shipping?',
    answer: 'Yes. All orders exceeding $250 qualify for complimentary insured express courier delivery worldwide via DHL Express. Orders under $250 incur a flat $20 shipping fee.'
  },
  {
    category: 'Shipping & Delivery',
    question: 'How long does order dispatch take?',
    answer: 'Orders placed before 14:00 GMT+4 are dispatched the same business day from our regional fulfillment ateliers. Delivery typically takes 2–4 business days across Europe, Asia, and North America.'
  },
  {
    category: 'Returns & Exchanges',
    question: 'What is your return and exchange policy?',
    answer: 'We accept returns and size exchanges within 30 days of delivery. Items must be unworn, unwashed, with original tags and archival packaging intact. Return courier labels are generated automatically from your account.'
  },
  {
    category: 'Materials & Sustainability',
    question: 'How are VELORA materials sourced?',
    answer: 'Over 92% of our textiles are certified by RWS (Responsible Wool Standard), OEKO-TEX, or vegetable-tanned in LWG-audited Italian tanneries. Every garment includes a digital provenance passport.'
  },
  {
    category: 'Sizing & Care',
    question: 'How do VELORA garments fit?',
    answer: 'Our silhouettes are designed with an intentional, architectural ease. We recommend selecting your standard size for the intended drape, or sizing down for a closer tailored fit.'
  },
  {
    category: 'Orders & Payments',
    question: 'Can I apply promotional codes at checkout?',
    answer: 'Yes. Active seasonal privileges such as VELORA10 (10% off) or WELCOME20 (20% off) can be entered directly in your Shopping Bag or during Checkout.'
  }
];

export const PROMO_CODES = {
  VELORA10: { discount: 0.10, label: '10% Seasonal Privilege' },
  WELCOME20: { discount: 0.20, label: '20% New Client Welcome' }
};
