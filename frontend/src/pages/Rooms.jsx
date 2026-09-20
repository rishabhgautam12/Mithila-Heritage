import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiUsers, FiMaximize } from "react-icons/fi";
import PageHero from "../components/ui/PageHero";
import MithilaBorder from "../components/ui/MithilaBorder";
import { rooms } from "../data/rooms";

import heroImage from "../assets/images/room-suite.jpg";

export default function Rooms() {
  return (
    <>
      <PageHero image={heroImage} kicker="Accommodation" title="Rooms & Suites" />
      <MithilaBorder />

      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10">
          <div className="grid sm:grid-cols-2 gap-10">
            {rooms.map((room, i) => (
              <motion.div
                key={room.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
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
                  <div className="bg-cream-dark p-7">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-2xl text-maroon-deep">{room.name}</h3>
                        <p className="text-gold text-xs tracking-wide uppercase mt-1">{room.tagline}</p>
                      </div>
                      <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-gold shrink-0 mt-1" size={20} />
                    </div>
                    <p className="text-muted text-sm mt-3 leading-relaxed">{room.desc}</p>
                    <div className="flex items-center gap-5 mt-5 text-xs text-muted">
                      <span className="flex items-center gap-1.5"><FiUsers size={13} /> {room.occupancy} Guests</span>
                      <span className="flex items-center gap-1.5"><FiMaximize size={13} /> {room.size}</span>
                    </div>
                    <p className="text-maroon-deep font-medium mt-4">
                      From ₹{room.price.toLocaleString("en-IN")} <span className="text-muted font-normal text-sm">/ night</span>
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}