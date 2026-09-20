import { motion } from "framer-motion";
import Divider from "../ui/Divider";
import Button from "../ui/Button";
import banquetImage from "../../assets/images/banquet.jpg";

const items = [
  "Weddings", "Receptions", "Engagements", "Anniversaries",
  "Cultural Events", "Custom Decoration", "Catering Solutions", "Event Planning",
];

export default function BanquetPreview() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="max-w-8xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9 }}
          className="aspect-[4/3] overflow-hidden order-2 lg:order-1"
        >
          <img src={banquetImage} alt="Banquet hall decorated for a wedding" className="w-full h-full object-cover" loading="lazy" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="order-1 lg:order-2"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Banquet &amp; Weddings</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-maroon-deep mt-3 leading-tight">
            Where Celebrations Become <span className="italic text-gold">Memories</span>
          </h2>
          <Divider className="mt-6 mb-7 justify-start" />
          <p className="text-muted leading-relaxed max-w-lg">
            Every special occasion deserves a venue that reflects its importance. Our banquet hall
            is designed to host elegant celebrations with seamless service and exceptional
            attention to detail.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-7 max-w-md">
            {items.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-gold text-[10px]">◆</span>
                <span className="text-muted text-[13px]">{item}</span>
              </div>
            ))}
          </div>
          <Button to="/banquet" variant="solid" className="mt-8">
            Plan Your Event
          </Button>
        </motion.div>
      </div>
    </section>
  );
}