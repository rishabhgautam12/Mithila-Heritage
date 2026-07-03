import SectionTitle from "../ui/SectionTitle";
import ExperienceCard from "../ui/ExperienceCard";

const experiences = [
  { icon: "🛏️", title: "Stay", desc: "Elegant rooms designed for comfort, relaxation and productivity.", href: "/rooms" },
  { icon: "🍽️", title: "Dine", desc: "A culinary journey across local flavors and international favorites.", href: "/restaurant" },
  { icon: "🎊", title: "Celebrate", desc: "Grand weddings, receptions and gatherings crafted with perfection.", href: "/banquet" },
  { icon: "💼", title: "Connect", desc: "Professional conference and meeting facilities for modern businesses.", href: "/conference" },
  { icon: "🌅", title: "Relax", desc: "Rooftop views, refreshing pool experiences and peaceful surroundings.", href: "/rooftop" },
];

export default function Experiences() {
  return (
    <section className="bg-cream-dark py-20 md:py-28">
      <div className="max-w-8xl mx-auto px-6 md:px-10">
        <SectionTitle eyebrow="Signature Experiences" title="Curated for Every Kind of" italicWord="Guest" className="mb-16" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {experiences.map((e, i) => (
            <ExperienceCard key={e.title} {...e} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}