import { motion } from "framer-motion";
import { EASE, VIEWPORT } from "./motion-presets";

/**
 * Scroll-driven reveal that settles after its first viewport entry.
 * Opacity and transforms stay on the compositor-friendly path.
 */
export default function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  y = 18,
  x = 0,
  duration = 0.6,
  once = true,
  ...rest
}) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ ...VIEWPORT, once }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
