import { motion } from "framer-motion";
import SectionTitle from "../ui/SectionTitle";
import Button from "../ui/Button";
import rooftopImage from "../../assets/images/rooftop.jpg";
import diningImage from "../../assets/images/dining.jpg";

function PoolPlaceholder() {
  return (
    <div className="relative w-full h-full min-h-[260px] bg-gradient-to-br from-maroon-deep via-maroon to-maroon-deep flex items-end p-6">
      <svg width="70" height="70" viewBox="0 0 70 70" className="absolute top-6 right-6 opacity-40">
        <g stroke="#E8C96A" strokeWidth="1" fill="none">
          <circle cx="35" cy="35" r="6" />
          <circle cx="35" cy="35" r="26" />
        </g>
      </svg>
      <div>
        <p className="text-cream/75 text-[11px] tracking-[0.2em] uppercase mb-2">Swimming Pool</p>
        <h3 className="font-display text-cream text-xl leading-snug">A Space to Relax &amp; Recharge</h3>
      </div>
    </div>
  );
}

const cards = [
  {
    image: rooftopImage,
    kicker: "Rooftop Experience",
    title: "Above the City. Beyond Expectations.",
    desc: "An exclusive destination where guests unwind, celebrate and enjoy breathtaking views under candlelight and open sky.",
    features: ["Open-Air Seating", "Sunset Lounge", "Live Music", "Private Celebrations"],
    cta: "Explore Rooftop",
    to: "/rooftop",
  },
  {
    image: null,
    kicker: "Swimming Pool",
    title: "A Space to Relax & Recharge",
    desc: "Our beautifully designed pool offers a refreshing retreat with poolside refreshments and a resort-style atmosphere.",
    features: ["Crystal-Clear Water", "Poolside Seating", "Family Friendly", "Evening Illumination"],
    cta: "Learn More",
    to: "/rooftop",
  },
  {
    image: diningImage,
    kicker: "Evening Dining",
    title: "Flavors Made for Slow Evenings",
    desc: "Relax into warm hospitality with chef-led plates, soft lighting and a calm setting designed for unhurried conversations.",
    features: ["Chef Specials", "Regional Plates", "Warm Ambience", "Private Tables"],
    cta: "View Dining",
    to: "/restaurant",
  },
];

export default function RelaxSection() {
  return (
    <section className="bg-cream-dark py-20 md:py-28">
      <div className="max-w-8xl mx-auto px-6 md:px-10">
        <SectionTitle title="Unwind &" italicWord="Recharge" className="mb-14" />
        <div className="grid md:grid-cols-3 gap-7">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="bg-cream flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {c.image ? (
                  <>
                    <img src={c.image} alt={c.title} loading="lazy" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/10 to-transparent flex items-end p-5">
                      <div>
                        <p className="text-cream/75 text-[11px] tracking-[0.2em] uppercase mb-2">{c.kicker}</p>
                        <h3 className="font-display text-cream text-xl leading-snug">{c.title}</h3>
                      </div>
                    </div>
                  </>
                ) : (
                  <PoolPlaceholder />
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-muted text-sm leading-relaxed mb-5">{c.desc}</p>
                <div className="flex flex-col gap-2 mb-6">
                  {c.features.map((f) => (
                    <span key={f} className="flex items-center gap-2 text-[13px] text-muted">
                      <span className="text-gold text-[10px]">✦</span>
                      {f}
                    </span>
                  ))}
                </div>
                <Button to={c.to} variant="outlineDark" className="mt-auto justify-center">
                  {c.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}