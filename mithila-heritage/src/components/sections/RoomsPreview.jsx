import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import SectionTitle from "../ui/SectionTitle";
import { rooms } from "../../data/rooms";

export default function RoomsPreview() {
  const featured = rooms.slice(0, 3);

  return (
    <section className="bg-cream-dark py-20 md:py-28">
      <div className="max-w-8xl mx-auto px-6 md:px-10">
        <SectionTitle eyebrow="Accommodation" title="Rooms Crafted for" italicWord="Restful Luxury" />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((room, i) => (
            <motion.div
              key={room.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group"
            >
              <Link to={`/rooms/${room.slug}`} className="block">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={room.img}
                    alt={room.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center bg-maroon-deep text-gold-light text-xs font-display">
                    {room.num}
                  </span>
                </div>
                <div className="bg-cream p-6">
                  <h3 className="font-display text-xl text-maroon-deep flex items-center justify-between">
                    {room.name}
                    <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-gold" />
                  </h3>
                  <p className="text-muted text-sm mt-2 leading-relaxed">{room.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-xs sm:text-sm tracking-[0.15em] uppercase font-medium border border-maroon-deep text-maroon-deep hover:bg-maroon-deep hover:text-cream transition-colors"
          >
            View All Rooms
          </Link>
        </div>
      </div>
    </section>
  );
}