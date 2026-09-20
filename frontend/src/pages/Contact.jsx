import { useState } from "react";
import { motion } from "framer-motion";
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import PageHero from "../components/ui/PageHero";
import MithilaBorder from "../components/ui/MithilaBorder";
import Button from "../components/ui/Button";

import heroImage from "../assets/images/hero-hotel.jpg";

const purposes = [
  "General Inquiry",
  "Room Reservation",
  "Wedding / Banquet",
  "Conference / Meeting",
  "Dining Reservation",
];

const details = [
  { icon: FiMapPin, label: "Address", value: "Mithila Road, Bihar, India" },
  { icon: FiPhone, label: "Phone", value: "+91 72958 48999" },
  { icon: FiMail, label: "Email", value: "info@mithilaheritage.in" },
  { icon: FiClock, label: "Front Desk", value: "Open 24 Hours" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHero image={heroImage} kicker="Get in Touch" title="Contact Us" />
      <MithilaBorder />

      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-8xl mx-auto px-6 md:px-10 grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Send a Message</span>
            <h2 className="font-display text-3xl md:text-4xl text-maroon-deep mt-3 mb-8">
              We'd Love to <span className="italic text-gold">Hear From You</span>
            </h2>

            {submitted ? (
              <div className="border border-gold p-8 text-center bg-cream-dark">
                <p className="font-display text-xl text-maroon-deep mb-2">Thank you!</p>
                <p className="text-muted text-sm">
                  Your message has been received. Our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-muted mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-muted mb-2">Phone Number</label>
                    <input
                      type="tel"
                      required
                      className="w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold"
                      placeholder="+91"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-wider uppercase text-muted mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-wider uppercase text-muted mb-2">Purpose of Visit</label>
                  <select
                    required
                    defaultValue=""
                    className="w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold"
                  >
                    <option value="" disabled>Select an option</option>
                    {purposes.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs tracking-wider uppercase text-muted mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <Button type="submit" variant="solid" showArrow={false}>
                  <span className="flex items-center gap-2">
                    Send Message <FiSend size={14} />
                  </span>
                </Button>
              </form>
            )}
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <div className="bg-maroon-deep p-8">
              <h3 className="font-display text-xl text-cream mb-6">Reach Us Directly</h3>
              <div className="space-y-6">
                {details.map((d) => (
                  <div key={d.label} className="flex gap-4">
                    <span className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                      <d.icon className="text-gold-light" size={16} />
                    </span>
                    <div>
                      <p className="text-cream/60 text-[11px] tracking-wider uppercase">{d.label}</p>
                      <p className="text-cream text-sm mt-0.5">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-6 aspect-[4/3] bg-cream-dark border border-gold-pale flex flex-col items-center justify-center gap-3 text-muted">
              <FiMapPin size={28} className="text-gold" />
              <p className="text-sm">Map location coming soon</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}