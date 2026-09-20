import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import PageHero from "../components/ui/PageHero";
import MithilaBorder from "../components/ui/MithilaBorder";

import heroImage from "../assets/images/banquet.jpg";

const testimonials = [
  { quote: "Had an amazing stay at Mithila Heritage! The rooms were elegant, and the rooftop restaurant view was breathtaking. Highly recommended.", name: "Anjali Sharma" },
  { quote: "The banquet hall was perfect for our corporate event. Excellent service and very professional staff. Truly memorable experience.", name: "Rohit Verma" },
  { quote: "A perfect blend of culture and luxury. The Mithila art throughout the property is breathtaking and the staff is so warm.", name: "Priya Singh" },
  { quote: "From check-in to check-out, everything was smooth. The staff is very friendly and helpful. Will visit again!", name: "Suresh Kumar" },
  { quote: "The ideal venue for weddings and celebrations. Every detail was handled with perfection by the events team.", name: "Neha Gupta" },
  { quote: "Professional service, beautiful ambience and memorable experiences. Will always return whenever we're in Bihar.", name: "Vikram K." },
];

export default function Testimonials() {
  return (
    <>
      <PageHero image={heroImage} kicker="Guest Reviews" title="Testimonials" />
      <MithilaBorder />

      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Guest Reviews</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-maroon-deep mt-3">
              What Our <span className="italic text-gold">Guests Say</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-5">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => <FiStar key={i} fill="currentColor" size={16} />)}
              </div>
              <span className="font-display text-maroon text-lg">4.9</span>
              <span className="text-muted text-sm">(300+ Reviews)</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-cream-dark border border-gold-pale p-7 flex flex-col"
              >
                <div className="flex gap-0.5 text-gold mb-4">
                  {Array.from({ length: 5 }).map((_, s) => <FiStar key={s} fill="currentColor" size={13} />)}
                </div>
                <p className="text-muted text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <p className="font-display text-maroon-deep mt-5">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}