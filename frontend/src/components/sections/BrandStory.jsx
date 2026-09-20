import { motion } from "framer-motion";
import Divider from "../ui/Divider";
import Button from "../ui/Button";
import artImage from "../../assets/images/mithila-art.jpg";

export default function BrandStory() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="max-w-8xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Brand Story</span>
          <h2 className="font-display text-4xl md:text-5xl text-maroon-deep mt-3 leading-tight">
            More Than a Hotel.
            <br />
            <span className="italic text-gold">A Heritage.</span>
          </h2>
          <Divider className="mt-6 mb-7 justify-start" />
          <p className="text-muted leading-relaxed max-w-lg">
            The Mithila Heritage is inspired by the rich culture, art, hospitality and values of
            the Mithila region. Every corner reflects a balance between traditional elegance and
            contemporary comfort.
          </p>
          <p className="text-muted leading-relaxed max-w-lg mt-4">
            From handcrafted Mithila-inspired interiors to thoughtfully designed guest
            experiences, our goal is simple — to make every guest feel welcomed, valued, and
            remembered.
          </p>
          <Button to="/rooms" variant="outlineDark" className="mt-8">
            Explore Rooms
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9 }}
          className="relative"
        >
          <div className="aspect-square overflow-hidden bg-gold-pale">
            <img
              src={artImage}
              alt="Traditional Mithila peacock and lotus folk-art motif"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 sm:left-auto sm:-right-6 bg-maroon-deep text-cream w-32 h-32 sm:w-36 sm:h-36 flex flex-col items-center justify-center text-center border border-gold px-4">
            <span className="text-gold text-xl">∞</span>
            <span className="text-[10px] tracking-[0.2em] uppercase mt-2 leading-relaxed">
              Legacy of Mithila
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
