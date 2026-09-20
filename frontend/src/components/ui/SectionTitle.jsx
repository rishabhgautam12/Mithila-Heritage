import { motion } from "framer-motion";
import Divider from "./Divider";

export default function SectionTitle({
  eyebrow,
  title,
  italicWord,
  align = "center",
  dark = false,
  className = "",
}) {
  const alignClass = align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`flex flex-col ${alignClass} ${className}`}
    >
      {eyebrow && (
        <span
          className={`text-xs md:text-sm tracking-[0.3em] uppercase font-ui mb-3 ${
            dark ? "text-gold-light" : "text-gold"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-3xl sm:text-4xl md:text-5xl leading-tight ${
          dark ? "text-cream" : "text-maroon-deep"
        }`}
      >
        {title}{" "}
        {italicWord && (
          <span className={`italic ${dark ? "text-gold-light" : "text-gold"}`}>{italicWord}</span>
        )}
      </h2>
      <Divider className="mt-5" tone={dark ? "cream" : "gold"} />
    </motion.div>
  );
}
