import { useState } from "react";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";
import PageHero from "../components/ui/PageHero";
import MithilaBorder from "../components/ui/MithilaBorder";
import Button from "../components/ui/Button";
import { rooms } from "../data/rooms";

import heroImage from "../assets/images/room-suite.jpg";

export default function Booking() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHero image={heroImage} kicker="Reservation" title="Book Your Stay" />
      <MithilaBorder />

      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gold p-10 text-center bg-cream-dark"
            >
              <p className="font-display text-2xl text-maroon-deep mb-3">Request Received!</p>
              <p className="text-muted">
                Thank you for choosing The Mithila Heritage. Our reservations team will contact you
                shortly to confirm your booking.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs tracking-wider uppercase text-muted mb-2">Full Name</label>
                  <input required type="text" className="w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-muted mb-2">Phone Number</label>
                  <input required type="tel" className="w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="+91" />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-wider uppercase text-muted mb-2">Email Address</label>
                <input required type="email" className="w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="you@example.com" />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs tracking-wider uppercase text-muted mb-2">Check-in</label>
                  <input required type="date" className="w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-muted mb-2">Check-out</label>
                  <input required type="date" className="w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs tracking-wider uppercase text-muted mb-2">Room Type</label>
                  <select required defaultValue="" className="w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold">
                    <option value="" disabled>Select a room</option>
                    {rooms.map((r) => (
                      <option key={r.slug} value={r.slug}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-muted mb-2">Guests</label>
                  <input required type="number" min="1" defaultValue="2" className="w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-wider uppercase text-muted mb-2">Special Requests (Optional)</label>
                <textarea rows={4} className="w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none" placeholder="Any preferences we should know about..." />
              </div>

              <Button type="submit" variant="solid" showArrow={false} className="w-full justify-center">
                <span className="flex items-center gap-2">Submit Reservation Request <FiSend size={14} /></span>
              </Button>
            </motion.form>
          )}
        </div>
      </section>
    </>
  );
}