import { motion } from "framer-motion";
import Button from "../ui/Button";

export default function CTABanner() {
  return (
    <section className="bg-maroon py-24 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto px-6 text-center"
      >
        <h2 className="font-display text-3xl md:text-4xl text-cream leading-tight">
          Begin Your Heritage Experience
        </h2>
        <p className="italic text-cream/75 text-lg leading-relaxed mt-5">
          "Not just a hotel — a destination that represents the pride, culture and hospitality of
          Mithila with world-class luxury."
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-9">
          <Button to="/contact" variant="solid">Book Your Stay</Button>
          <Button to="/banquet" variant="outline">Plan an Event</Button>
        </div>
      </motion.div>
    </section>
  );
}