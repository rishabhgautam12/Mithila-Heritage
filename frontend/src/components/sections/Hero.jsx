import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";
import heroVideo from "../../assets/video/hero-video.webm";

export default function Hero() {
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(heroVideo);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let objectUrl;
    let cancelled = false;

    const playVideo = () => {
      video.muted = true;
      video.playsInline = true;

      if (video.readyState >= 2) {
        video.play().catch(() => {});
      }
    };

    const preloadAndPlay = async () => {
      try {
        const response = await fetch(heroVideo, { cache: "force-cache" });
        const blob = await response.blob();

        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setVideoSrc(objectUrl);
        video.load();
        playVideo();
      } catch {
        playVideo();
      }
    };

    preloadAndPlay();
    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("canplay", playVideo);
    document.addEventListener("visibilitychange", playVideo);
    window.addEventListener("focus", playVideo);
    window.addEventListener("pointerdown", playVideo, { once: true });
    window.addEventListener("touchstart", playVideo, { once: true });

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", playVideo);
      video.removeEventListener("canplay", playVideo);
      document.removeEventListener("visibilitychange", playVideo);
      window.removeEventListener("focus", playVideo);
      window.removeEventListener("pointerdown", playVideo);
      window.removeEventListener("touchstart", playVideo);

      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src={videoSrc}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/35 to-charcoal/50" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gold-light text-xs sm:text-sm tracking-[0.35em] uppercase mb-5"
        >
          The Mithila Heritage
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl text-cream leading-[1.1] max-w-4xl"
        >
          Experience the Soul of <span className="italic text-gold-light">Mithila</span>, Wrapped
          in Luxury
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-6 text-cream/85 text-base sm:text-lg max-w-xl font-light"
        >
          A destination where timeless tradition, refined hospitality and modern elegance come
          together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-9 flex flex-wrap justify-center gap-4"
        >
          <Button to="/booking" variant="solid">
            Book Your Stay
          </Button>
          <Button to="/banquet" variant="outline">
            Plan Your Event
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 text-cream/70"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-8 bg-cream/60"
        />
      </motion.div>
    </section>
  );
}
