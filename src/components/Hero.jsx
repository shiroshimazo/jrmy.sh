import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "./Button";
import { profile, experience } from "../data/content";
import { SOCIAL_ICONS } from "../data/socialIcons";
import portrait240 from "../assets/profile-240.webp";
import portrait360 from "../assets/profile-360.webp";
import portrait240Jpg from "../assets/profile-240.jpg";
import portrait360Jpg from "../assets/profile-360.jpg";
import { EASE, VIEWPORT } from "./motion/motion-presets";
import { scrollToSection } from "../utils/scrollToSection";
import "./Hero.css";

// Transform + opacity only. These are the two properties the compositor can
// animate on its own thread. `filter: blur()` cannot: it forces a re-raster
// of the text on every frame, which on a high-refresh display means paying
// for 120 of them per second during the reveal.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Professional work only. The school entries stay in the About timeline.
const work = experience.filter((e) => e.work);

export default function Hero() {
  const lenis = useLenis();

  const handleScroll = (event, id) => {
    event.preventDefault();
    scrollToSection(id, lenis);
  };

  return (
    <section id="home" className="section section--hero hero">
      <motion.div
        className="container hero__inner"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.figure
          className="hero__portrait"
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          {/* 2.5 KB instead of 1.75 MB: the source is 1109x1419 but this
              renders at 96 CSS px, so only 2x/3x squares ever get requested. */}
          <picture>
            <source
              type="image/webp"
              srcSet={`${portrait240} 240w, ${portrait360} 360w`}
              sizes="96px"
            />
            <img
              src={portrait360Jpg}
              srcSet={`${portrait240Jpg} 240w, ${portrait360Jpg} 360w`}
              sizes="96px"
              width="360"
              height="360"
              alt={`Portrait of ${profile.name}`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </motion.figure>

        <motion.header className="hero__header" variants={item}>
          <h1 className="hero__name">{profile.name}</h1>
          <p className="hero__role">{profile.heroRole}</p>
        </motion.header>

        <motion.div className="hero__bio" variants={item}>
          <p className="hero__lead">{profile.introLead}</p>
          <p className="hero__note">{profile.intro}</p>
        </motion.div>

        <motion.ul className="hero__socials" variants={item} role="list">
          {profile.socials.map((s) => {
            const Icon = SOCIAL_ICONS[s.label];
            if (!Icon) return null;
            return (
              <li key={s.label}>
                <a
                  className="hero__social"
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                >
                  <HugeiconsIcon icon={Icon} size={20} strokeWidth={1.5} />
                </a>
              </li>
            );
          })}
        </motion.ul>

        <motion.div className="hero__cta" variants={item}>
          <Button
            as="a"
            href="#projects"
            variant="ghost"
            onClick={(e) => handleScroll(e, "projects")}
          >
            View Projects
          </Button>
          <Button
            as="a"
            href="#contact"
            variant="primary"
            onClick={(e) => handleScroll(e, "contact")}
          >
            Get in Touch
          </Button>
        </motion.div>

        {/* Sits below the fold on a phone, so it reveals on its own rather
            than riding the entrance stagger. */}
        <motion.section
          className="hero__work"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.h2 className="label hero__work-head" variants={item}>
            Work
          </motion.h2>

          <ul className="work" role="list">
            {work.map((e) => (
              <motion.li className="work__item" key={e.role + e.period} variants={item}>
                <span className="work__period">{e.period}</span>
                <span className="work__leader" aria-hidden="true" />
                <span className="work__details">
                  {e.tag && <span className="work__tag">{e.tag}</span>}
                  <span className="work__role">{e.role}</span>
                  <span className="work__at"> — </span>
                  <span className="work__company">{e.company}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </motion.div>
    </section>
  );
}