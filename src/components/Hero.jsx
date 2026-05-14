import { motion } from "framer-motion";
import Button from "./Button";
import { profile } from "../data/content";
import profileImg from "../assets/profile.jpg";
import { EASE } from "./motion/motion-presets";
import "./Hero.css";

const handleScroll = (e, id) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export default function Hero() {
  return (
    <section id="home" className="section section--hero hero">
      <div className="container hero__grid">
        <motion.figure
          className="hero__portrait"
          initial={{ opacity: 0, x: 40, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
        >
          <img
            src={profileImg}
            alt={`Portrait of ${profile.name}`}
            loading="eager"
            decoding="async"
          />
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
            ▍ {profile.role} — {profile.location}
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
