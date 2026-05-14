import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import Button from "./Button";
import { profile } from "../data/content";
import { EASE, VIEWPORT } from "./motion/motion-presets";
import "./Contact.css";

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <SectionTitle
          index="04"
          label="Contact"
          title="Have a project in mind? Let's talk."
          lead="I take on a small number of engagements each quarter. Send a short note describing what you're building and I'll reply within two business days."
        />

        <motion.div
          className="contact__grid"
          variants={grid}
          initial="hidden"
          whileInView="show"
          exit="hidden"
          viewport={VIEWPORT}
        >
          <motion.div className="contact__mail" variants={item}>
            <span className="label">Direct</span>
            <a
              className="display contact__email"
              href={`mailto:${profile.email}`}
            >
              {profile.email}
            </a>
            <div className="contact__actions">
              <Button as="a" href={`mailto:${profile.email}`} variant="primary">
                Send Email
              </Button>
            </div>
          </motion.div>

          <motion.aside className="contact__side" variants={item}>
            <div className="contact__block">
              <span className="label">Elsewhere</span>
              <ul className="contact__socials" role="list">
                {profile.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      className="contact__social"
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>{s.label}</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="contact__block">
              <span className="label">Response</span>
              <p className="body contact__note">
                Replies sent from a personal address. For NDAs, request via
                email and I'll forward a template.
              </p>
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}
