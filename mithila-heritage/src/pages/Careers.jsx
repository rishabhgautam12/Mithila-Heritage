import { motion } from "framer-motion";
import { FiBriefcase, FiMapPin, FiClock } from "react-icons/fi";
import PageHero from "../components/ui/PageHero";
import MithilaBorder from "../components/ui/MithilaBorder";
import Button from "../components/ui/Button";

import heroImage from "../assets/images/conference.jpg";

const openings = [
  { title: "Front Desk Executive", dept: "Guest Relations", type: "Full-Time" },
  { title: "Executive Chef", dept: "Culinary", type: "Full-Time" },
  { title: "Event Coordinator", dept: "Banquet & Events", type: "Full-Time" },
  { title: "Housekeeping Supervisor", dept: "Housekeeping", type: "Full-Time" },
];

const why = [
  { title: "Grow With Us", desc: "Structured training and internal growth paths across departments." },
  { title: "Culture First", desc: "A workplace that celebrates Mithila heritage and genuine hospitality." },
  { title: "Guest-Centric Team", desc: "Work alongside a team dedicated to creating unforgettable stays." },
];

export default function Careers() {
  return (
    <>
      <PageHero image={heroImage} kicker="Join Our Team" title="Careers at The Mithila Heritage" />
      <MithilaBorder />

      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-maroon-deep">
              Build a Career in <span className="italic text-gold">Luxury Hospitality</span>
            </h2>
            <p className="text-muted leading-relaxed mt-5">
              We're always looking for passionate, service-minded people to join our family. Explore
              current openings below or send us your resume for future opportunities.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-7 mb-20">
            {why.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-cream-dark border border-gold-pale p-8 text-center"
              >
                <h3 className="font-display text-lg text-maroon">{w.title}</h3>
                <p className="text-muted text-sm mt-2 leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>

          <h3 className="font-display text-2xl text-maroon-deep text-center mb-10">Current Openings</h3>
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {openings.map((job, i) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gold-pale px-6 py-5"
              >
                <div>
                  <h4 className="font-display text-lg text-maroon-deep">{job.title}</h4>
                  <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-muted">
                    <span className="flex items-center gap-1.5"><FiBriefcase size={12} /> {job.dept}</span>
                    <span className="flex items-center gap-1.5"><FiClock size={12} /> {job.type}</span>
                    <span className="flex items-center gap-1.5"><FiMapPin size={12} /> Bihar, India</span>
                  </div>
                </div>
                <Button to="/contact" variant="outlineDark" showArrow={false} className="shrink-0">
                  Apply Now
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}