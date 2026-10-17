import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@hugeicons/core-free-icons";
import { profile } from "../data/content";
import portrait240 from "../assets/profile-240.webp";
import portrait360 from "../assets/profile-360.webp";
import portrait240Jpg from "../assets/profile-240.jpg";
import portrait360Jpg from "../assets/profile-360.jpg";
import { EASE, VIEWPORT } from "./motion/motion-presets";
import { useClickSound } from "../hooks/useClickSound";
import "./Footer.css";

const row = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const col = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

// Looked up by the display label in profile.socials, so these keys must match
// those labels exactly — case included. Hugeicons spells two of them
// GithubIcon / LinkedinIcon, so the imports are aliased rather than keyed as
// they come. A casing drift here does not throw; it just makes a brand quietly
// disappear from the footer, which is why the dev check below exists.
const SOCIAL_ICONS = {
  Facebook: FacebookIcon,
  GitHub: GithubIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedinIcon,
};

if (import.meta.env.DEV) {
  const unmapped = profile.socials
    .filter((s) => !SOCIAL_ICONS[s.label])
    .map((s) => s.label);
  if (unmapped.length) {
    console.warn(
      `Footer: SOCIAL_ICONS has no icon for ${unmapped.join(", ")} — ` +
        "key it exactly as the label in profile.socials."
    );
  }
}

export default function Footer() {
  const year = new Date().getFullYear();
  const play = useClickSound();
  const marked = profile.socials.filter((s) => SOCIAL_ICONS[s.label]);

  return (
    <footer className="footer">
      <motion.div
        className="container footer__row"
        variants={row}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
      >
        <motion.figure className="footer__portrait" variants={col}>
          <picture>
            <source
              type="image/webp"
              srcSet={`${portrait240} 240w, ${portrait360} 360w`}
              sizes="54px"
            />
            <img
              src={portrait360Jpg}
              srcSet={`${portrait240Jpg} 240w, ${portrait360Jpg} 360w`}
              sizes="54px"
              width="360"
              height="360"
              alt={`Portrait of ${profile.name}`}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </motion.figure>

        <motion.p className="body footer__copy" variants={col}>
          Copyright © {year} {profile.name}
        </motion.p>

        <motion.ul className="footer__socials" variants={col} role="list">
          {marked.map((s) => (
            <li key={s.label}>
              <a
                className="footer__social"
                href={s.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => play("tap")}
                aria-label={s.label}
              >
                <HugeiconsIcon icon={SOCIAL_ICONS[s.label]} size={22} strokeWidth={1.5} />
              </a>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </footer>
  );
}