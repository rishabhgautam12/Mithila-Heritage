import { motion } from "framer-motion";
import { FiTag } from "react-icons/fi";
import PageHero from "../components/ui/PageHero";
import MithilaBorder from "../components/ui/MithilaBorder";
import Button from "../components/ui/Button";

import heroImage from "../assets/images/hero-hotel.jpg";
import roomImage from "../assets/images/room-suite.jpg";
import diningImage from "../assets/images/dining.jpg";
import banquetImage from "../assets/images/banquet.jpg";

const offers = [
  {
    tag: "Stay Longer, Save More",
    title: "3 Nights, Pay for 2",
    desc: "Book any Heritage room for three consecutive nights and the third night is on us. Valid for direct bookings only.",
    image: roomImage,
  },
  {
    tag: "Culinary Delight",
    title: "Dine-In Package",
    desc: "Complimentary breakfast and a signature Mithila thali dinner included with every Royal Premium Deluxe booking.",
    image: diningImage,
  },
  {
    tag: "Celebration Special",
    title: "Wedding Season Offer",
    desc: "Book your banquet hall for a 2026 wedding date and receive complimentary décor consultation and priority scheduling.",
    image: banquetImage,
  },
];

export default function Offers() {
  return (
    <>
      <PageHero image={heroImage} kicker="Offers & Packages" title="Curated for Every Stay" />
      <MithilaBorder />

      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((o, i) => (
              <motion.div
                key={o.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="group"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={o.image}
                    alt={o.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="bg-cream-dark p-7">
                  <span className="inline-flex items-center gap-1.5 text-gold text-[11px] tracking-wider uppercase mb-3">
                    <FiTag size={12} /> {o.tag}
                  </span>
                  <h3 className="font-display text-xl text-maroon-deep">{o.title}</h3>
                  <p className="text-muted text-sm mt-3 leading-relaxed">{o.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button to="/contact" variant="outlineDark">Enquire About Offers</Button>
          </div>
        </div>
      </section>
    </>
  );
}