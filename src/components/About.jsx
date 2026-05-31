import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { profile, skills, experience } from "../data/content";
import { EASE, VIEWPORT } from "./motion/motion-presets";
import "./About.css";

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const cell = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const timelineRow = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function About() {
  // The currently open certificate ({ src, role }), or null when closed.
  const [cert, setCert] = useState(null);

  // Close on Escape and lock body scroll while the modal is open.
  useEffect(() => {
    if (!cert) return;
    const onKey = (e) => e.key === "Escape" && setCert(null);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [cert]);

  return (
    <section id="about" className="section about">
      <div className="container">
        <SectionTitle
          index="02"
          label="About"
          title="A designer-engineer focused on clarity and craft."
          lead={profile.intro}
        />

        <motion.div
          className="about__grid"
          variants={grid}
          initial="hidden"
          whileInView="show"
          exit="hidden"
          viewport={VIEWPORT}
        >
          <motion.div className="about__pane" variants={cell}>
            <span className="label about__pane-title">Profile</span>
            <p className="body">
              I work across the stack but care most about the surface where
              software meets people. My approach is restrained: clear types,
              tight spacing, considered motion.
            </p>
            <dl className="about__facts">
              <div>
                <dt className="label">Based</dt>
                <dd className="body about__fact">{profile.location}</dd>
              </div>
              <div>
                <dt className="label">Focus</dt>
                <dd className="body about__fact">Interface systems</dd>
              </div>
              <div>
                <dt className="label">Available</dt>
                <dd className="body about__fact">Selective freelance</dd>
              </div>
            </dl>
          </motion.div>

          <motion.div className="about__pane" variants={cell}>
            <span className="label about__pane-title">Skills</span>
            <ul className="skills">
              {skills.map((g) => (
                <li key={g.group} className="skills__group">
                  <span className="label skills__group-title">{g.group}</span>
                  <ul className="skills__items">
                    {g.items.map((s) => (
                      <li key={s} className="skills__item">
                        {s}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <div className="about__timeline">
          <div className="about__timeline-head">
            <span className="label">Experience & Education</span>
            <span className="label about__count">
              {String(experience.length).padStart(2, "0")} entries
            </span>
          </div>

          <motion.ol
            className="timeline"
            variants={grid}
            initial="hidden"
            whileInView="show"
            exit="hidden"
            viewport={VIEWPORT}
          >
            {experience.map((e) => (
              <motion.li
                key={e.role + e.period}
                className="timeline__row"
                variants={timelineRow}
              >
                <span className="label timeline__period">{e.period}</span>
                <div className="timeline__body">
                  <h3 className="h2 timeline__role">{e.role}</h3>
                  <span className="label timeline__company">{e.company}</span>
                  <p className="body">{e.summary}</p>
                  {e.cert && (
                    <button
                      type="button"
                      className="label timeline__cert-btn"
                      onClick={() => setCert({ src: e.cert, role: e.role })}
                    >
                      View Cert
                      <Arrow />
                    </button>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {cert && (
            <motion.div
              className="cert-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`${cert.role} certificate`}
              onClick={() => setCert(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <motion.div
                className="cert-modal__frame"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.26, ease: EASE }}
              >
                <button
                  type="button"
                  className="label cert-modal__close"
                  onClick={() => setCert(null)}
                  aria-label="Close"
                >
                  Close ✕
                </button>
                <img
                  className="cert-modal__img"
                  src={cert.src}
                  alt={`${cert.role} certificate`}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3 11L11 3M11 3H4.5M11 3V9.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}
