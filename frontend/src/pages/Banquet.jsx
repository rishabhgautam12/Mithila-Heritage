import { motion } from "framer-motion";
import PageHero from "../components/ui/PageHero";
import Divider from "../components/ui/Divider";
import Button from "../components/ui/Button";
import MithilaBorder from "../components/ui/MithilaBorder";

import banquetImage from "../assets/images/banquet.jpg";

const occasions = [
  { title: "Weddings", icon: "💍", desc: "Grand celebrations crafted with love and perfection" },
  { title: "Receptions", icon: "🥂", desc: "Elegant evenings to toast your new journey" },
  { title: "Engagements", icon: "💐", desc: "The perfect start to a beautiful love story" },
  { title: "Anniversaries", icon: "❤️", desc: "Milestones worth celebrating in grand style" },
  { title: "Birthday Celebrations", icon: "🎂", desc: "Memorable parties for every age and milestone" },
  { title: "Cultural Events", icon: "🎭", desc: "Traditional gatherings honouring our rich heritage" },
];

const services = [
  "Customized Decoration", "Event Planning Assistance", "Catering Solutions",
  "Stage Setup", "Sound & Lighting", "Photography Support", "Guest Management", "Custom Menus",
];

export default function Banquet() {
  return (
    <>
      <PageHero
        image={banquetImage}
        kicker="Banquet & Events"
        title="Weddings & Celebrations"
        subtitle="Where Celebrations Become Memories"
      />
      <MithilaBorder />

      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-maroon-deep">
              Craft Your <span className="italic text-gold">Perfect Day</span>
            </h2>
            <Divider className="mt-6 mb-6" />
            <p className="text-muted leading-relaxed">
              Every special occasion deserves a venue that reflects its importance. Our banquet
              hall is designed to host elegant celebrations with seamless service and exceptional
              attention to detail.
            </p>
          </div>

          {/* Occasions grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {occasions.map((o, i) => (
              <motion.div
                key={o.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-cream-dark border border-gold-pale p-8 text-center"
              >
                <div className="text-4xl mb-4">{o.icon}</div>
                <h3 className="font-display text-lg text-maroon">{o.title}</h3>
                <p className="text-muted text-sm mt-2 leading-relaxed">{o.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Services */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9 }}
              className="aspect-[4/3] overflow-hidden"
            >
              <img src={banquetImage} alt="Banquet hall" className="w-full h-full object-cover" loading="lazy" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="font-display text-2xl md:text-3xl text-maroon-deep mb-4">
                Our Banquet Services
              </h3>
              <p className="text-muted leading-relaxed mb-6">
                From intimate gatherings to grand celebrations, our dedicated events team ensures
                every detail is perfect. We offer end-to-end event planning with personalized
                service.
              </p>
              <div className="flex flex-col gap-1 mb-8">
                {services.map((s) => (
                  <div key={s} className="flex items-center gap-3 py-2 border-b border-gold-pale">
                    <span className="text-gold text-[10px] shrink-0">◆</span>
                    <span className="text-muted text-[13px] tracking-wide">{s}</span>
                  </div>
                ))}
              </div>
              <Button to="/contact" variant="solid">Plan Your Event</Button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}