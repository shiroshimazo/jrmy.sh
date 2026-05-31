import { motion } from "framer-motion";
import { profile } from "../data/content";
import { EASE, VIEWPORT } from "./motion/motion-presets";
import "./Footer.css";

const row = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const col = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <motion.div
        className="container footer__row"
        variants={row}
        initial="hidden"
        whileInView="show"
        exit="hidden"
        viewport={VIEWPORT}
      >
        <motion.div className="footer__col" variants={col}>
          <span className="label">Index</span>
          <span className="h2 footer__brand">{profile.name}.</span>
        </motion.div>

        <motion.div className="footer__col" variants={col}>
          <span className="label">Sections</span>
          <ul className="footer__list">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </motion.div>

        <motion.div className="footer__col" variants={col}>
          <span className="label">Elsewhere</span>
          <ul className="footer__list">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div className="footer__col footer__col--end" variants={col}>
          <span className="label">Meta</span>
          <span className="body footer__meta">
            © {year} {profile.name}
          </span>
          <span className="body footer__meta">All rights reserved</span>
        </motion.div>
      </motion.div>
    </footer>
  );
}
