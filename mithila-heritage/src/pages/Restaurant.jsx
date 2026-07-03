import { motion } from "framer-motion";
import PageHero from "../components/ui/PageHero";
import Divider from "../components/ui/Divider";
import Button from "../components/ui/Button";
import MithilaBorder from "../components/ui/MithilaBorder";

import diningImage from "../assets/images/dining.jpg";

const highlights = ["Family Dining", "Business Lunches", "Private Celebrations", "Group Gatherings", "Festival Specials", "Breakfast Buffet"];

const menus = [
  { category: "Mithila Specialties", items: ["Thekua", "Malpua", "Sattu Paratha", "Litti Chokha", "Khaja", "Balushahi"] },
  { category: "North Indian", items: ["Dal Makhani", "Butter Chicken", "Paneer Tikka", "Biryani", "Naan Breads", "Kebabs"] },
  { category: "South Indian", items: ["Masala Dosa", "Idli Sambar", "Uttapam", "Vada", "Rasam", "Appam"] },
  { category: "Continental & Chinese", items: ["Pasta Varieties", "Grilled Fish", "Fried Rice", "Noodles", "Soups", "Steaks"] },
];

export default function Restaurant() {
  return (
    <>
      <PageHero image={diningImage} kicker="Culinary Experiences" title="Restaurant & Dining" />
      <MithilaBorder />

      {/* Intro */}
      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Our Restaurant</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-maroon-deep mt-3 leading-tight">
              A Celebration of <span className="italic text-gold">Taste</span>
            </h2>
            <Divider className="mt-6 mb-7 justify-start" />
            <p className="text-muted leading-relaxed max-w-lg mb-4">
              At The Mithila Heritage Restaurant, every meal is crafted to create memorable dining
              experiences. From authentic regional specialties to contemporary global cuisine, our
              menu is designed to satisfy every palate.
            </p>
            <p className="text-muted leading-relaxed max-w-lg mb-8">
              Our chefs bring decades of culinary expertise and a deep passion for Mithila's rich
              food heritage to every dish they prepare.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {highlights.map((d) => (
                <div key={d} className="flex items-center gap-2">
                  <span className="text-gold text-[10px]">◆</span>
                  <span className="text-muted text-[13px]">{d}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9 }}
            className="aspect-[4/3] overflow-hidden"
          >
            <img src={diningImage} alt="Restaurant ambience" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        </div>
      </section>

      {/* Menu */}
      <section className="bg-maroon-deep py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Our Menu</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream mt-3">
              Flavours from <span className="italic text-gold-light">Around the World</span>
            </h2>
            <Divider className="mt-6" tone="cream" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {menus.map((m, i) => (
              <motion.div
                key={m.category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-7 border border-gold/25"
              >
                <h3 className="font-display text-gold text-lg mb-4 pb-3 border-b border-gold/30">
                  {m.category}
                </h3>
                <ul className="space-y-2.5">
                  {m.items.map((item) => (
                    <li key={item} className="text-cream/70 text-sm">{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Button to="/contact" variant="solid">Make a Reservation</Button>
          </div>
        </div>
      </section>
    </>
  );
}