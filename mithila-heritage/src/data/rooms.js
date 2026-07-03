import roomImage from "../assets/images/room-suite.jpg";

export const rooms = [
  {
    num: "01",
    slug: "heritage-classic",
    name: "Heritage Classic",
    tagline: "Comfort Meets Convenience",
    desc: "Comfortable and thoughtfully designed for travelers seeking convenience and value.",
    longDesc:
      "Heritage Classic is thoughtfully designed for travelers seeking convenience and value without compromising on comfort. Mithila-inspired interiors, spacious layout and premium furnishings throughout — each room reflects the rich heritage of the region through handcrafted accents and traditional artwork.",
    price: 2700,
    occupancy: 2,
    size: "180 sq.ft",
    bedType: "Queen Bed",
    amenities: ["High-Speed Wi-Fi", "King Size Bed", "Air Conditioning", "Smart TV", "Luxury Bathroom", "Room Service 24/7"],
    features: [
      "Premium Bedding", "High-Speed Wi-Fi", "Smart Television", "Air Conditioning",
      "Modern Bathroom", "Work Desk", "Wardrobe", "24-Hour Room Service",
      "Daily Housekeeping", "Complimentary Toiletries",
    ],
    img: roomImage,
    gallery: [roomImage, roomImage, roomImage],
  },
  {
    num: "02",
    slug: "heritage-deluxe",
    name: "Heritage Deluxe",
    tagline: "Spacious & Modern",
    desc: "A perfect blend of space, elegance and comfort with enhanced interiors.",
    longDesc:
      "A perfect blend of space, elegance and comfort. Heritage Deluxe offers an enhanced living area and upgraded interiors, ideal for guests who want a little extra room to relax during their stay.",
    price: 2999,
    occupancy: 2,
    size: "220 sq.ft",
    bedType: "King Bed",
    amenities: ["High-Speed Wi-Fi", "King Size Bed", "Air Conditioning", "Smart TV", "Luxury Bathroom", "Room Service 24/7"],
    features: [
      "Spacious Layout", "King Size Bed", "Enhanced Interiors", "Smart Entertainment System",
      "Luxury Bathroom Amenities", "Seating Area", "Premium Furnishings", "Mini Refrigerator",
      "High-Speed Wi-Fi", "24-Hour Room Service",
    ],
    img: roomImage,
    gallery: [roomImage, roomImage, roomImage],
  },
  {
    num: "03",
    slug: "royal-premium-deluxe",
    name: "Royal Premium Deluxe",
    tagline: "Premium Comfort, Royal Touch",
    desc: "Premium stay with luxury comfort and Mithila-inspired royal interiors.",
    longDesc:
      "Royal Premium Deluxe brings together refined interiors and generous space for guests who expect more from their stay. Mithila-inspired art accents the room, paired with plush furnishings and elevated amenities for a truly royal experience.",
    price: 3499,
    occupancy: 3,
    size: "260 sq.ft",
    bedType: "King Bed + Sofa",
    amenities: ["High-Speed Wi-Fi", "King Size Bed", "Air Conditioning", "Smart TV", "Mini Bar", "Room Service 24/7"],
    features: [
      "Premium Interior Design", "King Size Bed", "Separate Seating Area", "Smart Entertainment System",
      "Luxury Bathroom", "Mini Bar", "Refrigerator", "High-Speed Wi-Fi",
      "Complimentary Breakfast", "Priority Housekeeping",
    ],
    img: roomImage,
    gallery: [roomImage, roomImage, roomImage],
  },
  {
    num: "04",
    slug: "maharaja-suite",
    name: "Maharaja Suite",
    tagline: "Sophistication & Exclusivity",
    desc: "Designed for guests who appreciate sophistication and exclusivity.",
    longDesc:
      "Designed for guests who appreciate sophistication and exclusivity, the Maharaja Suite is the pinnacle of accommodation at The Mithila Heritage — a separate living area, dedicated workspace, and personalized service that defines royal hospitality.",
    price: 3999,
    occupancy: 4,
    size: "380 sq.ft",
    bedType: "King Bed + Living Room",
    amenities: ["High-Speed Wi-Fi", "King Size Bed", "Air Conditioning", "Smart TV", "Mini Bar", "Room Service 24/7"],
    features: [
      "Separate Living Area", "Premium Interior Design", "Luxury Bathroom", "Exclusive Amenities",
      "Dedicated Workspace", "Mini Bar", "Butler Service", "High-Speed Wi-Fi",
      "Complimentary Breakfast", "Airport Pickup on Request",
    ],
    img: roomImage,
    gallery: [roomImage, roomImage, roomImage],
  },
];

export const getRoomBySlug = (slug) => rooms.find((r) => r.slug === slug);