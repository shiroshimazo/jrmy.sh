import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import "./Signature.css";

// Abstract single-line scribble that draws itself with scroll,
// like the signature section above tanvir.io's footer.
// Scroll progress drives pathLength; wrapper fades in.
export default function Signature() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const draw = useTransform(scrollYProgress, [0.15, 0.9], [0, 1]);
  const fade = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  return (
    <section ref={ref} id="signature" className="sig-section" aria-label="Signature">
      <motion.div className="sig-draw" style={reduce ? { opacity: 1 } : { opacity: fade }}>
        <svg viewBox="0 0 143 108" role="img" aria-label="Jeremy scribble signature">
          <motion.path
            d="M 16 66 C 20 62, 24 58, 27 52 C 33 38, 40 26, 48 18 C 52 14, 56 12, 55 17 C 53 28, 46 44, 39 60 C 35 70, 31 80, 30 90 C 29.5 95, 32 96, 34 91 C 38 81, 44 70, 50 64 C 54 60, 58 60, 57 65 C 56 70, 58 68, 61 63 C 64 58, 66 54, 69 56 C 71 58, 70 63, 72 66 C 75 70, 80 64, 82 60 C 84 57, 86 55, 88 57 C 90 60, 89 65, 92 67 C 96 70, 101 62, 103 55 C 105 47, 106 38, 109 30 C 110 26, 112 24, 112 28 C 111 38, 108 52, 106 66 C 105 74, 105 82, 108 88 C 115 80, 124 60, 132 40"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={reduce ? { pathLength: 1 } : { pathLength: draw }}
          />
        </svg>
      </motion.div>
    </section>
  );
}
