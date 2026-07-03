import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar } from "react-icons/fi";
import diningImage from "../../assets/images/dining.jpg";

const testimonials = [
  { quote: "Exceptional hospitality and attention to detail. Truly a world-class experience in Bihar.", name: "Aarav S." },
  { quote: "A perfect blend of culture and luxury. The Mithila art throughout the property is breathtaking.", name: "Priya M." },
  { quote: "The ideal venue for weddings and celebrations. Every detail was handled with perfection.", name: "Rohan & Neha" },
  { quote: "Professional service, beautiful ambience and memorable experiences. Will always return.", name: "Vikram K." },
];

export default function TestimonialsShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((v) => (v + 1) % testimonials.length), 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <img src={diningImage} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-charcoal/85" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <span className="text-gold-light text-xs tracking-[0.3em] uppercase">Testimonials</span>
        <h2 className="font-display text-3xl md:text-4xl text-cream mt-3">
          What Our <span className="italic text-gold-light">Guests</span> Say
        </h2>

        <div className="flex items-center justify-center gap-2 mt-6">
          <strong className="text-cream text-lg">4.9</strong>
          <div className="flex text-gold-light" aria-label="5 star rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar key={i} fill="currentColor" size={14} />
            ))}
          </div>
          <span className="text-cream/60 text-sm">(300+ Reviews)</span>
        </div>

        <div className="min-h-[140px] flex items-center justify-center mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
            >
              <blockquote className="font-display italic text-xl md:text-2xl text-cream leading-relaxed">
                "{testimonials[active].quote}"
              </blockquote>
              <cite className="block not-italic text-gold-light text-sm tracking-wide mt-5">
                {testimonials[active].name}
              </cite>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              aria-label={`Show testimonial from ${t.name}`}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === active ? "bg-gold" : "bg-cream/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}