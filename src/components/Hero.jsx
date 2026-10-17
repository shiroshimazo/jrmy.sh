import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import Button from "./Button";
import { profile } from "../data/content";
import portrait240 from "../assets/profile-240.webp";
import portrait360 from "../assets/profile-360.webp";
import portrait240Jpg from "../assets/profile-240.jpg";
import portrait360Jpg from "../assets/profile-360.jpg";
import { EASE } from "./motion/motion-presets";
import { scrollToSection } from "../utils/scrollToSection";
import "./Hero.css";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
// Transform + opacity only. These are the two properties the compositor can
// animate on its own thread. `filter: blur()` cannot: it forces a re-raster
// of the text on every frame, which on a high-refresh display means paying
// for 120 of them per second during the reveal.
const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export default function Hero() {
  const lenis = useLenis();

  const handleScroll = (event, id) => {
    event.preventDefault();
    scrollToSection(id, lenis);
  };

  return (
    <section id="home" className="section section--hero hero">
      <div className="container hero__grid">
        <motion.figure
          className="hero__portrait"
initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.1 }}
        >
          {/* 2.5 KB instead of 1.75 MB: the source is 1109x1419 but this
              renders at 120 CSS px, so only 2x/3x squares ever get requested. */}
          <picture>
            <source
              type="image/webp"
              srcSet={`${portrait240} 240w, ${portrait360} 360w`}
              sizes="120px"
            />
            <img
              src={portrait360Jpg}
              srcSet={`${portrait240Jpg} 240w, ${portrait360Jpg} 360w`}
              sizes="120px"
              width="360"
              height="360"
              alt={`Portrait of ${profile.name}`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <figcaption className="label hero__portrait-cap">
            <span>Portrait</span>
            <span>— {new Date().getUTCFullYear()}</span>
          </figcaption>
        </motion.figure>

        <motion.div
          className="hero__body"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span variants={item} className="label hero__eyebrow">
            ▍ {profile.role} — {profile.status}
          </motion.span>

          <motion.h1 variants={item} className="display hero__display">
            {profile.name}
            <span className="hero__dot">.</span>
          </motion.h1>

          <motion.p variants={item} className="body hero__tagline">
            {profile.tagline}
          </motion.p>

          <motion.div variants={item} className="hero__cta">
            <Button
              as="a"
              href="#projects"
              variant="primary"
              onClick={(e) => handleScroll(e, "projects")}
            >
              View Projects
            </Button>
            <Button
              as="a"
              href="#contact"
              variant="ghost"
              onClick={(e) => handleScroll(e, "contact")}
            >
              Get in Touch
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
