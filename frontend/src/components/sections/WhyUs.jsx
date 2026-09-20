import { motion } from "framer-motion";
import SectionTitle from "../ui/SectionTitle";

const reasons = [
  "Premium Location", "Cultural Identity with Modern Luxury", "Elegant Architecture",
  "Spacious Rooms", "Fine Dining Experience", "Rooftop Lounge", "Swimming Pool",
  "Grand Banquet Facilities", "Professional Conference Spaces", "Secure Parking",
  "24×7 Guest Assistance", "Personalized Hospitality", "Power Backup",
  "High-Speed Wi-Fi", "CCTV Security",
];

export default function WhyUs() {
  return (
    <section className="bg-maroon-deep py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <SectionTitle
          eyebrow="Why The Mithila Heritage?"
          title="Because Excellence Is in"
          italicWord="Every Detail"
          dark
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
          {reasons.map((r, i) => (
            <motion.div
              key={r}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="py-4 px-3 border border-gold/20"
            >
              <span className="text-gold text-base">✦</span>
              <p className="text-cream/80 text-[11px] tracking-wide mt-1.5 leading-snug">{r}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}