import { motion } from "framer-motion";
import Button from "../ui/Button";
import heroVideo from "../../assets/video/hero-video.webm";
import heroImage from "../../assets/images/hero-hotel.jpg";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={heroImage}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/35 to-charcoal/50" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gold-light text-xs sm:text-sm tracking-[0.35em] uppercase mb-5"
        >
          The Mithila Heritage
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl text-cream leading-[1.1] max-w-4xl"
        >
          Experience the Soul of <span className="italic text-gold-light">Mithila</span>, Wrapped
          in Luxury
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-6 text-cream/85 text-base sm:text-lg max-w-xl font-light"
        >
          A destination where timeless tradition, refined hospitality and modern elegance come
          together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-9 flex flex-wrap justify-center gap-4"
        >
          <Button to="/booking" variant="solid">
            Book Your Stay
          </Button>
          <Button to="/banquet" variant="outline">
            Plan Your Event
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 text-cream/70"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-8 bg-cream/60"
        />
      </motion.div>
    </section>
  );
}