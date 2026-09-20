import { motion } from "framer-motion";
import PageHero from "../components/ui/PageHero";
import Divider from "../components/ui/Divider";
import Button from "../components/ui/Button";
import MithilaBorder from "../components/ui/MithilaBorder";

import conferenceImage from "../assets/images/conference.jpg";

const eventTypes = ["Corporate Meetings", "Training Programs", "Workshops", "Seminars", "Product Launches", "Business Conferences", "Board Meetings", "Team Building Events"];

const facilities = [
  { icon: "📽️", title: "Audio-Visual Technology" },
  { icon: "📡", title: "High-Speed Internet" },
  { icon: "🪑", title: "Comfortable Seating" },
  { icon: "❄️", title: "Climate Control" },
  { icon: "☕", title: "Refreshment Services" },
  { icon: "🎯", title: "Dedicated Event Support" },
];

export default function Conference() {
  return (
    <>
      <PageHero image={conferenceImage} kicker="Business Events" title="Conferences & Meetings" />
      <MithilaBorder />

      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10">
          {/* Intro */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-xs tracking-[0.3em] uppercase text-gold">Professional Spaces</span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-maroon-deep mt-3 leading-tight">
                Where Ideas <span className="italic text-gold">Come to Life</span>
              </h2>
              <Divider className="mt-6 mb-7 justify-start" />
              <p className="text-muted leading-relaxed max-w-lg mb-7">
                Our conference facilities are designed for modern professionals and organizations.
                Every space is equipped with state-of-the-art technology and ergonomic furniture to
                maximize productivity.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-md mb-8">
                {eventTypes.map((e) => (
                  <div key={e} className="flex items-center gap-2">
                    <span className="text-gold text-[10px]">◆</span>
                    <span className="text-muted text-[13px]">{e}</span>
                  </div>
                ))}
              </div>
              <Button to="/contact" variant="solid">Request a Proposal</Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9 }}
              className="aspect-[4/3] overflow-hidden"
            >
              <img src={conferenceImage} alt="Conference room" className="w-full h-full object-cover" loading="lazy" />
            </motion.div>
          </div>

          {/* Facilities */}
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl md:text-3xl text-maroon-deep">
              Facilities &amp; <span className="italic text-gold">Technology</span>
            </h3>
            <Divider className="mt-5" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {facilities.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-cream-dark border border-gold-pale p-6 text-center"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <p className="text-maroon text-xs tracking-wide leading-snug">{f.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}