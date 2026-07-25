import { motion } from "framer-motion";
import { EASE, VIEWPORT } from "./motion-presets";

/**
 * Scroll-driven reveal. Animates in when entering viewport,
 * reverses when leaving — so scrolling up *and* down both trigger motion.
 */
export default function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  y = 24,
  x = 0,
  duration = 0.65,
  once = false,
  ...rest
}) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, x, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y, x, filter: "blur(4px)" }}
      viewport={{ ...VIEWPORT, once }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
