import { motion } from "framer-motion";
import { EASE, VIEWPORT } from "./motion/motion-presets";
import "./SectionTitle.css";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export default function SectionTitle({ index, label, title, lead }) {
  return (
    <motion.header
      className="sect-title"
      variants={container}
      initial="hidden"
      whileInView="show"
      exit="hidden"
      viewport={VIEWPORT}
    >
      <motion.div className="sect-title__meta" variants={item}>
        {index && <span className="label sect-title__index">{index}</span>}
        {label && <span className="label sect-title__label">{label}</span>}
      </motion.div>
      <motion.h2 className="h1 sect-title__heading" variants={item}>
        {title}
      </motion.h2>
      {lead && (
        <motion.p className="body sect-title__lead" variants={item}>
          {lead}
        </motion.p>
      )}
    </motion.header>
  );
}
