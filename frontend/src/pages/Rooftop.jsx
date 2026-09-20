import { motion } from "framer-motion";
import PageHero from "../components/ui/PageHero";
import Divider from "../components/ui/Divider";
import Button from "../components/ui/Button";
import MithilaBorder from "../components/ui/MithilaBorder";

import rooftopImage from "../assets/images/rooftop.jpg";

const rooftopFeatures = ["Open-Air Seating", "Elegant Evening Ambience", "Sunset Lounge", "Live Music Events", "Private Celebrations", "Romantic Dining Setup", "Corporate Gatherings", "Premium Food & Beverage"];
const poolFeatures = ["Crystal-Clear Water", "Poolside Seating", "Changing Facilities", "Family-Friendly Environment", "Professional Maintenance", "Evening Illumination", "Safe & Hygienic", "Poolside Refreshments"];

function PoolImage() {
  return (
    <div className="relative w-full h-full aspect-[4/3] bg-gradient-to-br from-maroon-deep via-maroon to-maroon-deep flex items-center justify-center overflow-hidden">
      <svg width="90" height="90" viewBox="0 0 90 90" className="opacity-50">
        <g stroke="#E8C96A" strokeWidth="1" fill="none">
          <circle cx="45" cy="45" r="8" />
          <circle cx="45" cy="45" r="34" />
        </g>
      </svg>
    </div>
  );
}

export default function Rooftop() {
  return (
    <>
      <PageHero
        image={rooftopImage}
        kicker="Sky-High Experiences"
        title="Rooftop & Pool"
        subtitle="Above the City. Beyond Expectations."
      />
      <MithilaBorder />

      {/* Rooftop */}
      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Rooftop Lounge</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-maroon-deep mt-3 leading-tight">
              Above the City, <span className="italic text-gold">Beyond Expectations</span>
            </h2>
            <Divider className="mt-6 mb-7 justify-start" />
            <p className="text-muted leading-relaxed max-w-lg mb-7">
              The rooftop at The Mithila Heritage is designed as an exclusive destination where
              guests can unwind, celebrate, and enjoy breathtaking views of the city skyline.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md mb-8">
              {rooftopFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="text-gold text-[10px]">◆</span>
                  <span className="text-muted text-[13px]">{f}</span>
                </div>
              ))}
            </div>
            <Button to="/contact" variant="solid">Reserve Rooftop</Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9 }}
            className="aspect-[4/3] overflow-hidden"
          >
            <img src={rooftopImage} alt="Rooftop at night" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        </div>
      </section>

      {/* Pool */}
      <section className="bg-cream-dark py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9 }}
            className="order-2 lg:order-1"
          >
            <PoolImage />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Swimming Pool</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-maroon-deep mt-3 leading-tight">
              A Space to <span className="italic text-gold">Relax &amp; Recharge</span>
            </h2>
            <Divider className="mt-6 mb-7 justify-start" />
            <p className="text-muted leading-relaxed max-w-lg mb-7">
              Our beautifully designed swimming pool offers a refreshing retreat for guests seeking
              leisure and relaxation. Enjoy refreshments, relaxation, and a resort-style atmosphere
              without leaving the property.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {poolFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="text-gold text-[10px]">◆</span>
                  <span className="text-muted text-[13px]">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-maroon-deep py-16 px-6 text-center">
        <p className="font-display italic text-cream text-xl md:text-2xl max-w-2xl mx-auto mb-7">
          Perfect for Couples · Family Gatherings · Birthday Celebrations · Corporate Networking
        </p>
        <Button to="/contact" variant="solid">Book Your Experience</Button>
      </section>
    </>
  );
}