import { motion } from "framer-motion";
import Divider from "../ui/Divider";
import Button from "../ui/Button";
import conferenceImage from "../../assets/images/conference.jpg";

const items = [
  "Corporate Meetings", "Training Programs", "Workshops", "Seminars",
  "Product Launches", "Business Conferences", "Audio-Visual Tech", "High-Speed Internet",
];

export default function ConferencePreview() {
  return (
    <section className="bg-cream-dark py-20 md:py-28">
      <div className="max-w-8xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Conferences &amp; Business Events</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-maroon-deep mt-3 leading-tight">
            Professional Spaces for <span className="italic text-gold">Productive Meetings</span>
          </h2>
          <Divider className="mt-6 mb-7 justify-start" />
          <p className="text-muted leading-relaxed max-w-lg">
            Designed for modern professionals and organizations. State-of-the-art facilities that
            help you focus, collaborate and succeed.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-7 max-w-md">
            {items.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-gold text-[10px]">◆</span>
                <span className="text-muted text-[13px]">{item}</span>
              </div>
            ))}
          </div>
          <Button to="/conference" variant="solid" className="mt-8">
            Request a Proposal
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9 }}
          className="aspect-[4/3] overflow-hidden"
        >
          <img src={conferenceImage} alt="Executive conference room" className="w-full h-full object-cover" loading="lazy" />
        </motion.div>
      </div>
    </section>
  );
}