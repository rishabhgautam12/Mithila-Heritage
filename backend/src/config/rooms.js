// Single source of truth for room inventory on the server.
// totalUnits = kitne rooms hain us category ke — apne hotel ke hisaab se change karein.
export const ROOMS = [
  { slug: "heritage-classic",     name: "Heritage Classic",      price: 2700, totalUnits: 6 },
  { slug: "heritage-deluxe",      name: "Heritage Deluxe",       price: 2999, totalUnits: 5 },
  { slug: "royal-premium-deluxe", name: "Royal Premium Deluxe",  price: 3499, totalUnits: 4 },
  { slug: "maharaja-suite",       name: "Maharaja Suite",        price: 3999, totalUnits: 2 },
];

export const roomBySlug = (slug) => ROOMS.find((r) => r.slug === slug);
