import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ExperienceCard({ icon, title, desc, href, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link
        to={href}
        className="group block h-full bg-cream border border-gold-pale hover:border-gold px-6 py-9 text-center transition-colors duration-300"
      >
        <span className="text-3xl block mb-4" aria-hidden="true">{icon}</span>
        <h3 className="font-display text-lg text-maroon-deep">{title}</h3>
        <p className="text-muted text-sm mt-2 leading-relaxed">{desc}</p>
      </Link>
    </motion.div>
  );
}