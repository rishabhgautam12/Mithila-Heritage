import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import SectionTitle from "../components/ui/SectionTitle";
import Divider from "../components/ui/Divider";
import Button from "../components/ui/Button";
import MithilaBorder from "../components/ui/MithilaBorder";

import heroImage from "../assets/images/hero-hotel.jpg";
import artImage from "../assets/images/mithila-art.jpg";

const stats = [
  { num: "50+", label: "Luxury Rooms & Suites" },
  { num: "10K+", label: "Happy Guests Yearly" },
  { num: "100+", label: "Curated Dishes & Beverages" },
  { num: "8+", label: "Years of Hospitality" },
];

const values = [
  { title: "Heritage First", desc: "Every design choice honours the art and traditions of Mithila, keeping our cultural roots alive in a modern setting." },
  { title: "Genuine Hospitality", desc: "We treat every guest as family — attentive, warm, and personal service from arrival to departure." },
  { title: "Uncompromising Quality", desc: "From linens to cuisine, we hold every detail to a standard worthy of the Mithila Heritage name." },
];

export default function About() {
  return (
    <>
      <PageHero image={heroImage} kicker="Who We Are" title="About The Mithila Heritage" />
      <MithilaBorder />

      {/* Story */}
      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Our Story</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-maroon-deep mt-3 leading-tight">
              More Than a Hotel.
              <br />
              <span className="italic text-gold">A Heritage.</span>
            </h2>
            <Divider className="mt-6 mb-7 justify-start" />
            <p className="text-muted leading-relaxed max-w-lg mb-4">
              The Mithila Heritage is inspired by the rich culture, art, hospitality, and values of
              the Mithila region of Bihar. Every corner of the property reflects a perfect balance
              between traditional elegance and contemporary comfort.
            </p>
            <p className="text-muted leading-relaxed max-w-lg mb-8">
              From handcrafted Madhubani-inspired interiors to thoughtfully designed guest
              experiences, our goal is simple — to make every guest feel welcomed, valued, and
              remembered. Whether you are visiting for business, leisure, celebrations, or special
              occasions, we offer an experience that goes beyond accommodation.
            </p>
            <Button to="/rooms" variant="solid">Explore Our Rooms</Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9 }}
            className="aspect-[3/4] overflow-hidden"
          >
            <img src={artImage} alt="Mithila art heritage" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-maroon-deep py-14 md:py-16">
        <div className="max-w-8xl mx-auto px-6 md:px-10 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-gold-light text-4xl md:text-5xl">{s.num}</p>
              <p className="text-cream/70 text-[11px] tracking-[0.15em] uppercase mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-dark py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10">
          <SectionTitle title="Our" italicWord="Values" className="mb-14" />
          <div className="grid sm:grid-cols-3 gap-7">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-cream border border-gold-pale p-8 text-center"
              >
                <h3 className="font-display text-xl text-maroon">{v.title}</h3>
                <p className="text-muted text-sm mt-3 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}