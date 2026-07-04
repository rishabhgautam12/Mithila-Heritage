import { motion } from "framer-motion";
import { useState } from "react";
import { FiX, FiMaximize2 } from "react-icons/fi";
import PageHero from "../components/ui/PageHero";
import MithilaBorder from "../components/ui/MithilaBorder";

import exteriorImg from "../assets/images/hero-hotel.jpg";
import roomImg from "../assets/images/room-suite.jpg";
import restaurantImg from "../assets/images/dining.jpg";
import rooftopImg from "../assets/images/rooftop.jpg";
import eventsImg from "../assets/images/banquet.jpg";
import conferenceImg from "../assets/images/conference.jpg";

// Desktop sequence — reads correctly across a 4-column grid.
const desktopTiles = [
  { type: "text", title: "Hotel Exterior", desc: "Royal architecture with warm evening lights and Mithila-inspired details." },
  { type: "image", src: exteriorImg, alt: "The Mithila Heritage exterior at dusk" },
  { type: "text", title: "Luxury Rooms", desc: "Spacious interiors with premium comfort and crafted heritage accents." },
  { type: "image", src: roomImg, alt: "Luxury room interior with Mithila art" },

  { type: "image", src: restaurantImg, alt: "Fine dining restaurant interior" },
  { type: "text", title: "Restaurant", desc: "Elegant dining for regional flavors, classics and slow conversations." },
  { type: "image", src: rooftopImg, alt: "Rooftop lounge at sunset" },
  { type: "text", title: "Rooftop Lounge", desc: "Open-air evenings with city views, soft lighting and relaxed seating." },

  { type: "text", title: "Swimming Pool", desc: "A tranquil escape with loungers, cabanas and skyline views." },
  { type: "pattern" },
  { type: "text", title: "Weddings & Events", desc: "Grand celebrations staged with floral décor and royal detailing." },
  { type: "image", src: eventsImg, alt: "Wedding stage decorated with flowers and chandeliers" },

  { type: "image", src: conferenceImg, alt: "Executive conference room" },
  { type: "text", title: "Conference", desc: "Boardrooms designed for focus, comfort and seamless connectivity." },
];

// Mobile sequence — strict text/image alternation so the single-column
// stack never puts two images or two text tiles back to back.
const mobileTiles = [
  { type: "text", title: "Hotel Exterior", desc: "Royal architecture with warm evening lights and Mithila-inspired details." },
  { type: "image", src: exteriorImg, alt: "The Mithila Heritage exterior at dusk" },
  { type: "text", title: "Luxury Rooms", desc: "Spacious interiors with premium comfort and crafted heritage accents." },
  { type: "image", src: roomImg, alt: "Luxury room interior with Mithila art" },

  { type: "text", title: "Restaurant", desc: "Elegant dining for regional flavors, classics and slow conversations." },
  { type: "image", src: restaurantImg, alt: "Fine dining restaurant interior" },
  { type: "text", title: "Rooftop Lounge", desc: "Open-air evenings with city views, soft lighting and relaxed seating." },
  { type: "image", src: rooftopImg, alt: "Rooftop lounge at sunset" },

  { type: "text", title: "Swimming Pool", desc: "A tranquil escape with loungers, cabanas and skyline views." },
  { type: "pattern" },
  { type: "text", title: "Weddings & Events", desc: "Grand celebrations staged with floral décor and royal detailing." },
  { type: "image", src: eventsImg, alt: "Wedding stage decorated with flowers and chandeliers" },

  { type: "text", title: "Conference", desc: "Boardrooms designed for focus, comfort and seamless connectivity." },
  { type: "image", src: conferenceImg, alt: "Executive conference room" },
];

function PatternTile() {
  return (
    <div className="relative w-full h-full aspect-square bg-gradient-to-br from-maroon-deep via-maroon to-maroon-deep flex items-center justify-center overflow-hidden">
      <svg width="120" height="120" viewBox="0 0 120 120" className="opacity-70">
        <g stroke="#E8C96A" strokeWidth="1" fill="none">
          <circle cx="60" cy="60" r="10" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <line
                key={i}
                x1={60 + Math.cos(a) * 16}
                y1={60 + Math.sin(a) * 16}
                x2={60 + Math.cos(a) * 46}
                y2={60 + Math.sin(a) * 46}
              />
            );
          })}
          <circle cx="60" cy="60" r="46" />
        </g>
      </svg>
    </div>
  );
}

function GalleryGrid({ tiles, onOpen }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile, i) => {
        if (tile.type === "text") {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center px-6 py-10 aspect-square"
            >
              <h3 className="font-display text-2xl text-charcoal">{tile.title}</h3>
              <p className="text-muted text-sm mt-3 leading-relaxed">{tile.desc}</p>
            </motion.div>
          );
        }

        if (tile.type === "pattern") {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
            >
              <PatternTile />
            </motion.div>
          );
        }

        return (
          <motion.button
            key={i}
            type="button"
            onClick={() => onOpen(tile.src)}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden aspect-square"
          >
            <img
              src={tile.src}
              alt={tile.alt}
              loading="lazy"
              className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-500 flex items-center justify-center">
              <FiMaximize2 className="text-cream text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

export default function Gallery() {
  const [activeSrc, setActiveSrc] = useState(null);
  const allImages = [...new Set(desktopTiles.filter((t) => t.type === "image").map((t) => t.src))];

  return (
    <section className="pb-24 bg-cream">
      <PageHero image={exteriorImg} kicker="Gallery" title="Explore Our Spaces" height="min-h-[300px] md:min-h-[380px]" />
      <MithilaBorder />

      <div className="max-w-8xl mx-auto px-6 md:px-10 mt-14">
        {/* Mobile-only sequence */}
        <div className="sm:hidden">
          <GalleryGrid tiles={mobileTiles} onOpen={setActiveSrc} />
        </div>
        {/* Tablet/Desktop sequence */}
        <div className="hidden sm:block">
          <GalleryGrid tiles={desktopTiles} onOpen={setActiveSrc} />
        </div>
      </div>

      {activeSrc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-charcoal/95 flex items-center justify-center px-6"
          onClick={() => setActiveSrc(null)}
        >
          <button
            aria-label="Close"
            className="absolute top-6 right-6 text-cream text-3xl"
            onClick={() => setActiveSrc(null)}
          >
            <FiX />
          </button>
          <img
            src={activeSrc}
            alt=""
            className="max-h-[85vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </section>
  );
}