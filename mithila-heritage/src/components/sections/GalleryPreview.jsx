import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMaximize2 } from "react-icons/fi";
import SectionTitle from "../ui/SectionTitle";
import Button from "../ui/Button";

import heroImage from "../../assets/images/hero-hotel.jpg";
import roomImage from "../../assets/images/room-suite.jpg";
import diningImage from "../../assets/images/dining.jpg";
import rooftopImage from "../../assets/images/rooftop.jpg";
import banquetImage from "../../assets/images/banquet.jpg";
import conferenceImage from "../../assets/images/conference.jpg";

// Same alternating text/image square bento pattern as the full Gallery page.
const tiles = [
  { type: "text", title: "Hotel Exterior", desc: "Royal architecture with warm evening lights and Mithila-inspired details." },
  { type: "image", src: heroImage, alt: "The Mithila Heritage exterior at dusk" },
  { type: "text", title: "Luxury Rooms", desc: "Spacious interiors with premium comfort and crafted heritage accents." },
  { type: "image", src: roomImage, alt: "Luxury room interior with Mithila art" },

  { type: "image", src: diningImage, alt: "Fine dining restaurant interior" },
  { type: "text", title: "Restaurant", desc: "Elegant dining for regional flavors, classics and slow conversations." },
  { type: "image", src: rooftopImage, alt: "Rooftop lounge at sunset" },
  { type: "text", title: "Rooftop Lounge", desc: "Open-air evenings with city views, soft lighting and relaxed seating." },

  { type: "text", title: "Weddings & Events", desc: "Beautifully arranged spaces for celebrations, ceremonies and gatherings." },
  { type: "image", src: banquetImage, alt: "Wedding stage decorated with flowers and chandeliers" },
  { type: "text", title: "Conference", desc: "Boardrooms designed for focus, comfort and seamless connectivity." },
  { type: "image", src: conferenceImage, alt: "Executive conference room" },
];

export default function GalleryPreview() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="max-w-8xl mx-auto px-6 md:px-10">
        <SectionTitle eyebrow="Gallery" title="Explore Our" italicWord="Spaces" className="mb-14" />

        <Link to="/gallery" className="block">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {tiles.map((tile, i) =>
              tile.type === "text" ? (
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
              ) : (
                <motion.div
                  key={i}
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
                </motion.div>
              )
            )}
          </div>
        </Link>

        <div className="text-center mt-16">
          <Button to="/gallery" variant="outlineDark">
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}