import { motion } from "framer-motion";
import { profile } from "../data/content";
import "./Loader.css";

// Wave loader — five bars scaling vertically, adapted from loading-ui.com/wave.
const BAR_HEIGHTS = ["50%", "75%", "100%", "75%", "50%"];

export default function Loader() {
  return (
    <motion.div
      className="loader"
      role="status"
      aria-label="Loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] }}
    >
      <div className="loader__inner">
        <span className="label loader__brand">{profile.name} / Portfolio</span>

        <span className="loader__wave" aria-hidden="true">
          {BAR_HEIGHTS.map((h, i) => (
            <span
              key={i}
              className="loader__bar"
              style={{ height: h, animationDelay: `calc(var(--delay) * ${i})` }}
            />
          ))}
        </span>

        <span className="label loader__caption">Initializing</span>
      </div>
    </motion.div>
  );
}
