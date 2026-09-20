import { motion } from "framer-motion";

// Shared inner-page hero: full-bleed image, dark gradient, kicker + title.
// Used by About, Restaurant, Banquet, Conference, Rooftop, etc.
export default function PageHero({ image, kicker, title, subtitle, height = "min-h-[380px] md:min-h-[460px]" }) {
  return (
    <section className={`relative flex items-end pb-14 pt-32 ${height} overflow-hidden`}>
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 to-maroon-deep/90" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 max-w-8xl mx-auto px-6 md:px-10 w-full"
      >
        <span className="text-gold text-xs tracking-[0.25em] uppercase block mb-2">{kicker}</span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-cream">{title}</h1>
        {subtitle && <p className="text-cream/80 italic text-lg mt-2">{subtitle}</p>}
      </motion.div>
    </section>
  );
}