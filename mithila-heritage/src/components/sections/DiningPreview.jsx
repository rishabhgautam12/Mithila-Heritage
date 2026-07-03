import { motion } from "framer-motion";
import Divider from "../ui/Divider";
import Button from "../ui/Button";
import MithilaBorder from "../ui/MithilaBorder";
import diningImage from "../../assets/images/dining.jpg";

const highlights = [
  "Authentic Mithila Cuisine", "North Indian Delicacies",
  "South Indian Specialties", "Chinese Cuisine",
  "Continental Selections", "Tandoor Collection",
  "Signature Desserts", "Premium Beverages",
];

export default function DiningPreview() {
  return (
    <section className="relative bg-maroon-deep py-20 md:py-28 overflow-hidden">
      <div className="max-w-8xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Fine Dining</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream mt-3 leading-tight">
            A Culinary Journey <span className="italic text-gold-light">Worth Savoring</span>
          </h2>
          <Divider className="mt-6 mb-7 justify-start" tone="cream" />
          <p className="text-cream/75 leading-relaxed max-w-lg">
            At The Mithila Heritage Restaurant, every meal is crafted to create memorable dining
            experiences — from authentic regional specialties to contemporary global cuisine.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-7 max-w-md">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-gold text-[10px]">◆</span>
                <span className="text-cream/70 text-[13px]">{item}</span>
              </div>
            ))}
          </div>
          <Button to="/restaurant" variant="solid" className="mt-8">
            View Menu
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9 }}
          className="aspect-[4/3] overflow-hidden"
        >
          <img src={diningImage} alt="Fine dining restaurant" className="w-full h-full object-cover" loading="lazy" />
        </motion.div>
      </div>
      <MithilaBorder flip className="absolute bottom-0 left-0 opacity-30" />
    </section>
  );
}