import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import PageHero from "../components/ui/PageHero";
import MithilaBorder from "../components/ui/MithilaBorder";

import heroImage from "../assets/images/mithila-art.jpg";
import roomImage from "../assets/images/room-suite.jpg";
import diningImage from "../assets/images/dining.jpg";
import rooftopImage from "../assets/images/rooftop.jpg";

const posts = [
  {
    title: "The Art of Mithila: A Living Tradition",
    excerpt: "Discover the centuries-old painting style that inspires every corner of our property, from lobby murals to guestroom art.",
    image: heroImage,
    tag: "Culture",
  },
  {
    title: "A Guide to Bihar's Regional Cuisine",
    excerpt: "From Litti Chokha to Thekua — explore the authentic flavors served at The Mithila Heritage Restaurant.",
    image: diningImage,
    tag: "Dining",
  },
  {
    title: "Planning the Perfect Rooftop Evening",
    excerpt: "Tips for making the most of sunset hours at our rooftop lounge, from seating to seasonal specials.",
    image: rooftopImage,
    tag: "Experiences",
  },
  {
    title: "Inside Our Heritage-Inspired Interiors",
    excerpt: "A closer look at how traditional Mithila craftsmanship shapes the design of every room category.",
    image: roomImage,
    tag: "Design",
  },
];

export default function Blog() {
  return (
    <>
      <PageHero image={heroImage} kicker="Stories & Insights" title="The Heritage Journal" />
      <MithilaBorder />

      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10">
          <div className="grid sm:grid-cols-2 gap-10">
            {posts.map((p, i) => (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="pt-6">
                  <span className="text-gold text-[11px] tracking-wider uppercase">{p.tag}</span>
                  <h3 className="font-display text-xl text-maroon-deep mt-2 group-hover:text-gold transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-muted text-sm mt-3 leading-relaxed">{p.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs tracking-wide uppercase text-maroon-deep mt-4">
                    Read More <FiArrowRight size={12} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}